export type YoupiSessionStatus =
  | 'INITIATED'
  | 'QUEUED'
  | 'ACTIVE'
  | 'PROCESSING'
  | 'OBSERVED_SUCCESS'
  | 'RECONCILED'
  | 'MANUAL_REVIEW'
  | 'SUCCESS'
  | 'FAILED'
  | 'EXPIRED'
  | 'CANCELLED';

export type YoupiSettlementState =
  | 'NOT_APPLICABLE'
  | 'NOT_RECONCILED'
  | 'MANUAL_REVIEW'
  | 'RECONCILED'
  | 'NOT_BANK_SETTLEMENT';

export interface YoupiPaymentSessionResponse {
  paymentId: string;
  orderId: string;
  amount: string;
  amountPaise: string;
  currency: 'INR';
  status: YoupiSessionStatus;
  settlementState: YoupiSettlementState;
  method: 'UPI' | 'MANUAL_UPI' | 'COD';
  mode: 'embedded' | 'external';
  checkoutUrl: string | null;
  payeeVpa: string;
  payeeName: string;
  upiUri: string;
  intentUris: Record<string, string>;
  utrMasked: string | null;
  utrSubmitted: boolean;
  payerApp: string | null;
  rejectionReason: string | null;
  expiresAt: string;
  remainingSeconds: number;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  sessionToken?: string;
  idempotent?: boolean;
}

export interface YoupiAdminPaymentSession extends YoupiPaymentSessionResponse {
  utr: string | null;
  customer: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
  };
  itemsSummary: string;
  auditLog: Array<{
    at: string;
    actor: 'SYSTEM' | 'CUSTOMER' | 'ADMIN' | 'WEBHOOK';
    action: string;
    details?: string;
  }>;
}

export interface YoupiGatewayHealth {
  status: string;
  engine: string;
  mode: 'embedded' | 'external';
  payeeVpa: string;
  payeeName: string;
  currency: string;
  sessionTimeoutSeconds: number;
  webhookConfigured: boolean;
}

export interface CreateYoupiPaymentParams {
  orderId: string;
  amount: number | string;
  customer: {
    name: string;
    phoneNumber: string;
    email?: string;
    address?: string;
  };
  itemsSummary?: string;
  idempotencyKey?: string;
  returnUrl?: string;
  metadata?: Record<string, unknown>;
}

// =========================================================================
// TRANSPORT DETECTION: REAL EXPRESS BACKEND vs STATIC HOSTING (e.g. Cloudflare)
// =========================================================================

const STATIC_LEDGER_STORAGE_KEY = 'qavelle_youpi_pg_ledger_v1';
const DEFAULT_PAYEE_VPA = 'pranyatrivedi@ybl';
const DEFAULT_PAYEE_NAME = 'Qavelle';
const SESSION_TIMEOUT_SECONDS = 300;

const ANDROID_UPI_PACKAGES: Record<string, string> = {
  phonepe: 'com.phonepe.app',
  gpay: 'com.google.android.apps.nbu.paisa.user',
  paytm: 'net.one97.paytm',
  bhim: 'in.org.npci.upiapp',
  amazonpay: 'in.amazon.mShop.android.shopping',
  cred: 'com.dreamplug.androidapp',
  whatsapp: 'com.whatsapp',
  navi: 'com.naviapp',
  mobikwik: 'com.mobikwik_new',
  airtel: 'com.myairtelapp',
  slice: 'indwin.c3.shareapp',
  jupiter: 'money.jupiter',
  supermoney: 'money.super.payments',
};

interface StaticLedgerRecord extends YoupiAdminPaymentSession {
  sessionToken: string;
  idempotencyKey?: string;
}

interface StaticLedgerState {
  payeeVpa: string;
  payeeName: string;
  adminPasscodeHash: string | null;
  adminPasscodeSalt: string | null;
  sessions: StaticLedgerRecord[];
}

// Track whether the deployment is a static bundle without /api/youpi/v1/* Express routes
let backendUnavailableDetected = false;
// Admin tokens strictly in memory only (never stored in localStorage/sessionStorage)
const inMemoryStaticAdminTokens = new Map<string, number>();

function isJsonContentType(res: Response): boolean {
  const ct = res.headers.get('content-type') || '';
  return ct.toLowerCase().includes('application/json');
}

function isStaticFallbackResponse(res: Response): boolean {
  // On Cloudflare / static SPA hosts, /api/* either returns 404/405/501
  // or serves index.html (200 text/html) instead of application/json.
  if (res.status === 404 || res.status === 405 || res.status === 501 || res.status === 502 || res.status === 503) {
    return true;
  }
  if (!isJsonContentType(res)) {
    return true;
  }
  return false;
}

async function parseErrorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const data = await res.json();
    if (data && typeof data.error === 'string') return data.error;
    if (data && typeof data.message === 'string') return data.message;
  } catch {
    // ignore JSON parse errors
  }
  return fallback;
}

// =========================================================================
// BUILT-IN CLIENT-SIDE YOUPI-PG ENGINE (AUTOMATIC FALLBACK ON STATIC HOSTS)
// =========================================================================

function generateRandomId(prefix: string): string {
  const bytes = new Uint8Array(12);
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${prefix}_${hex}`;
}

function maskUtr(utr: string): string {
  const clean = utr.trim();
  if (clean.length <= 4) return clean;
  return `${clean.slice(0, 4)}****${clean.slice(-4)}`;
}

function toPaise(amount: number | string): number {
  const num = typeof amount === 'number' ? amount : Number.parseFloat(String(amount));
  if (!Number.isFinite(num) || num <= 0) {
    throw new Error('Payment amount must be greater than zero.');
  }
  return Math.round(num * 100);
}

function formatPaise(paise: number): string {
  return (paise / 100).toFixed(2);
}

function buildUpiQueryString(
  payeeVpa: string,
  payeeName: string,
  amountStr: string,
  orderId: string
): string {
  const cleanVpa = payeeVpa.trim();
  const cleanName = encodeURIComponent(payeeName.trim());
  const cleanNote = encodeURIComponent(`Qavelle ${orderId}`.replace(/[^a-zA-Z0-9 ._-]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 50));
  return `pa=${cleanVpa}&pn=${cleanName}&am=${amountStr}&cu=INR&tn=${cleanNote}`;
}

function buildCanonicalUpiUri(
  payeeVpa: string,
  payeeName: string,
  amountStr: string,
  orderId: string
): string {
  return `upi://pay?${buildUpiQueryString(payeeVpa, payeeName, amountStr, orderId)}`;
}

function buildIntentUris(
  payeeVpa: string,
  payeeName: string,
  amountStr: string,
  orderId: string
): Record<string, string> {
  const baseQuery = buildUpiQueryString(payeeVpa, payeeName, amountStr, orderId);

  const intents: Record<string, string> = {};
  for (const [appId, pkg] of Object.entries(ANDROID_UPI_PACKAGES)) {
    intents[appId] = `intent://pay?${baseQuery}#Intent;scheme=upi;package=${pkg};end`;
  }
  return intents;
}

function loadStaticLedger(): StaticLedgerState {
  const defaults: StaticLedgerState = {
    payeeVpa: DEFAULT_PAYEE_VPA,
    payeeName: DEFAULT_PAYEE_NAME,
    adminPasscodeHash: null,
    adminPasscodeSalt: null,
    sessions: [],
  };
  if (typeof window === 'undefined' || !window.localStorage) {
    return defaults;
  }
  try {
    const raw = window.localStorage.getItem(STATIC_LEDGER_STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as Partial<StaticLedgerState>;
    return {
      payeeVpa: typeof parsed.payeeVpa === 'string' && parsed.payeeVpa.includes('@') ? parsed.payeeVpa : DEFAULT_PAYEE_VPA,
      payeeName: typeof parsed.payeeName === 'string' && parsed.payeeName.trim() ? parsed.payeeName : DEFAULT_PAYEE_NAME,
      adminPasscodeHash: typeof parsed.adminPasscodeHash === 'string' ? parsed.adminPasscodeHash : null,
      adminPasscodeSalt: typeof parsed.adminPasscodeSalt === 'string' ? parsed.adminPasscodeSalt : null,
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
    };
  } catch {
    return defaults;
  }
}

function saveStaticLedger(state: StaticLedgerState): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    // Keep up to 250 most recent sessions in browser storage
    const trimmed: StaticLedgerState = {
      ...state,
      sessions: state.sessions.slice(0, 250),
    };
    window.localStorage.setItem(STATIC_LEDGER_STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // Ignore storage quota errors
  }
}

function computeRemainingSeconds(expiresAt: string, status: YoupiSessionStatus): number {
  if (['RECONCILED', 'SUCCESS', 'FAILED', 'EXPIRED', 'CANCELLED'].includes(status)) {
    return 0;
  }
  return Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 1000));
}

function toPublicSession(rec: StaticLedgerRecord, includeToken = false): YoupiPaymentSessionResponse {
  const remainingSeconds = computeRemainingSeconds(rec.expiresAt, rec.status);
  const status: YoupiSessionStatus =
    remainingSeconds === 0 && rec.status === 'ACTIVE' ? 'EXPIRED' : rec.status;
  return {
    paymentId: rec.paymentId,
    orderId: rec.orderId,
    amount: rec.amount,
    amountPaise: rec.amountPaise,
    currency: 'INR',
    status,
    settlementState: rec.settlementState,
    method: rec.method,
    mode: 'embedded',
    checkoutUrl: null,
    payeeVpa: rec.payeeVpa,
    payeeName: rec.payeeName,
    upiUri: rec.upiUri,
    intentUris: rec.intentUris,
    utrMasked: rec.utrMasked,
    utrSubmitted: rec.utrSubmitted,
    payerApp: rec.payerApp,
    rejectionReason: rec.rejectionReason,
    expiresAt: rec.expiresAt,
    remainingSeconds,
    createdAt: rec.createdAt,
    updatedAt: rec.updatedAt,
    completedAt: rec.completedAt,
    ...(includeToken ? { sessionToken: rec.sessionToken } : {}),
  };
}

async function hashPasscode(passcode: string, salt: string): Promise<string> {
  const input = `${salt}:${passcode}`;
  if (typeof crypto !== 'undefined' && crypto.subtle && typeof TextEncoder !== 'undefined') {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
    return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
  }
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

function issueStaticAdminToken(): { token: string; expiresAt: string } {
  const token = generateRandomId('qvl_adm');
  const expiresMs = Date.now() + 8 * 60 * 60 * 1000;
  inMemoryStaticAdminTokens.set(token, expiresMs);
  return { token, expiresAt: new Date(expiresMs).toISOString() };
}

function assertStaticAdminToken(token: string): void {
  const expires = inMemoryStaticAdminTokens.get(token);
  if (!expires || Date.now() > expires) {
    inMemoryStaticAdminTokens.delete(token);
    throw new Error('Admin session expired. Please sign in again.');
  }
}

function staticCreatePaymentSession(params: CreateYoupiPaymentParams): YoupiPaymentSessionResponse {
  const ledger = loadStaticLedger();
  const paise = toPaise(params.amount);
  const amountStr = formatPaise(paise);

  // Idempotency support
  if (params.idempotencyKey) {
    const existing = ledger.sessions.find(
      (s) => s.idempotencyKey === params.idempotencyKey && s.status === 'ACTIVE'
    );
    if (existing && computeRemainingSeconds(existing.expiresAt, existing.status) > 15) {
      return { ...toPublicSession(existing, true), idempotent: true };
    }
  }

  const now = new Date();
  const expires = new Date(now.getTime() + SESSION_TIMEOUT_SECONDS * 1000);
  const paymentId = generateRandomId('pay');
  const sessionToken = generateRandomId('st');

  const upiUri = buildCanonicalUpiUri(ledger.payeeVpa, ledger.payeeName, amountStr, params.orderId);
  const intentUris = buildIntentUris(ledger.payeeVpa, ledger.payeeName, amountStr, params.orderId);

  const record: StaticLedgerRecord = {
    paymentId,
    sessionToken,
    idempotencyKey: params.idempotencyKey,
    orderId: params.orderId,
    amount: amountStr,
    amountPaise: String(paise),
    currency: 'INR',
    status: 'ACTIVE',
    settlementState: 'NOT_RECONCILED',
    method: 'UPI',
    mode: 'embedded',
    checkoutUrl: null,
    payeeVpa: ledger.payeeVpa,
    payeeName: ledger.payeeName,
    upiUri,
    intentUris,
    utr: null,
    utrMasked: null,
    utrSubmitted: false,
    payerApp: null,
    rejectionReason: null,
    expiresAt: expires.toISOString(),
    remainingSeconds: SESSION_TIMEOUT_SECONDS,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    completedAt: null,
    customer: {
      name: params.customer.name || 'Customer',
      phone: params.customer.phoneNumber || '',
      email: params.customer.email,
      address: params.customer.address,
    },
    itemsSummary: params.itemsSummary || `QAVELLE Order ${params.orderId}`,
    auditLog: [
      {
        at: now.toISOString(),
        actor: 'SYSTEM',
        action: 'SESSION_CREATED',
        details: `NPCI UPI session created for ₹${amountStr} (${ledger.payeeVpa})`,
      },
    ],
  };

  ledger.sessions.unshift(record);
  saveStaticLedger(ledger);
  return toPublicSession(record, true);
}

function staticGetPaymentStatus(paymentId: string, sessionToken: string): YoupiPaymentSessionResponse {
  const ledger = loadStaticLedger();
  const rec = ledger.sessions.find((s) => s.paymentId === paymentId);
  if (!rec) {
    throw new Error('Payment session not found.');
  }
  if (rec.sessionToken !== sessionToken) {
    throw new Error('Invalid payment session token.');
  }
  return toPublicSession(rec, false);
}

function staticSubmitUtr(
  paymentId: string,
  sessionToken: string,
  utr: string,
  payerApp?: string
): YoupiPaymentSessionResponse {
  const cleanUtr = utr.replace(/\D/g, '');
  if (!/^\d{12}$/.test(cleanUtr)) {
    throw new Error('UTR must be an exact 12-digit UPI reference number.');
  }

  const ledger = loadStaticLedger();
  const rec = ledger.sessions.find((s) => s.paymentId === paymentId);
  if (!rec) throw new Error('Payment session not found.');
  if (rec.sessionToken !== sessionToken) throw new Error('Invalid payment session token.');

  const duplicate = ledger.sessions.find(
    (s) => s.paymentId !== paymentId && s.utr === cleanUtr && s.status !== 'FAILED' && s.status !== 'CANCELLED'
  );
  if (duplicate) {
    throw new Error('This 12-digit UTR has already been submitted for another order.');
  }

  const nowIso = new Date().toISOString();
  rec.utr = cleanUtr;
  rec.utrMasked = maskUtr(cleanUtr);
  rec.utrSubmitted = true;
  rec.payerApp = payerApp || rec.payerApp || 'UPI';
  rec.method = 'MANUAL_UPI';
  rec.status = 'MANUAL_REVIEW';
  rec.settlementState = 'MANUAL_REVIEW';
  rec.updatedAt = nowIso;
  rec.auditLog.push({
    at: nowIso,
    actor: 'CUSTOMER',
    action: 'UTR_SUBMITTED',
    details: `Submitted UTR ${rec.utrMasked} via ${rec.payerApp}; queued for merchant bank verification`,
  });

  saveStaticLedger(ledger);
  return toPublicSession(rec, false);
}

function staticConfirmCod(
  paymentId: string,
  sessionToken: string,
  codAmount?: number
): YoupiPaymentSessionResponse {
  const ledger = loadStaticLedger();
  const rec = ledger.sessions.find((s) => s.paymentId === paymentId);
  if (!rec) throw new Error('Payment session not found.');
  if (rec.sessionToken !== sessionToken) throw new Error('Invalid payment session token.');

  const nowIso = new Date().toISOString();
  if (typeof codAmount === 'number' && Number.isFinite(codAmount) && codAmount > 0) {
    const paise = toPaise(codAmount);
    rec.amountPaise = String(paise);
    rec.amount = formatPaise(paise);
  }
  rec.method = 'COD';
  rec.status = 'SUCCESS';
  rec.settlementState = 'NOT_APPLICABLE';
  rec.updatedAt = nowIso;
  rec.completedAt = nowIso;
  rec.auditLog.push({
    at: nowIso,
    actor: 'CUSTOMER',
    action: 'COD_CONFIRMED',
    details: `Confirmed Cash on Delivery for ₹${rec.amount}`,
  });

  saveStaticLedger(ledger);
  return toPublicSession(rec, false);
}

function staticCancelPayment(paymentId: string, sessionToken: string): { success: boolean; status: string } {
  const ledger = loadStaticLedger();
  const rec = ledger.sessions.find((s) => s.paymentId === paymentId);
  if (!rec) throw new Error('Payment session not found.');
  if (rec.sessionToken !== sessionToken) throw new Error('Invalid payment session token.');

  const nowIso = new Date().toISOString();
  rec.status = 'CANCELLED';
  rec.updatedAt = nowIso;
  rec.auditLog.push({
    at: nowIso,
    actor: 'CUSTOMER',
    action: 'CANCELLED',
    details: 'Customer cancelled payment session',
  });
  saveStaticLedger(ledger);
  return { success: true, status: 'CANCELLED' };
}

function staticImportBankStatementCsv(
  token: string,
  csv: string
): {
  totalLinesParsed: number;
  reconciledCount: number;
  unmatchedCreditLines: number;
  matchedOrders: Array<{ orderId: string; paymentId: string; utr: string; amount: string }>;
} {
  assertStaticAdminToken(token);
  const ledger = loadStaticLedger();
  const lines = csv
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  let totalLinesParsed = 0;
  let unmatchedCreditLines = 0;
  const matchedOrders: Array<{ orderId: string; paymentId: string; utr: string; amount: string }> = [];
  const nowIso = new Date().toISOString();

  for (const line of lines) {
    const utrMatch = line.match(/\b(\d{12})\b/);
    if (!utrMatch) continue;
    totalLinesParsed++;
    const lineUtr = utrMatch[1];

    const session = ledger.sessions.find(
      (s) =>
        s.utr === lineUtr &&
        ['ACTIVE', 'MANUAL_REVIEW', 'OBSERVED_SUCCESS', 'PROCESSING'].includes(s.status)
    );
    if (!session) {
      unmatchedCreditLines++;
      continue;
    }

    session.status = 'RECONCILED';
    session.settlementState = 'RECONCILED';
    session.updatedAt = nowIso;
    session.completedAt = nowIso;
    session.auditLog.push({
      at: nowIso,
      actor: 'ADMIN',
      action: 'CSV_RECONCILED',
      details: `Matched UTR ${maskUtr(lineUtr)} in uploaded bank statement CSV`,
    });
    matchedOrders.push({
      orderId: session.orderId,
      paymentId: session.paymentId,
      utr: lineUtr,
      amount: session.amount,
    });
  }

  saveStaticLedger(ledger);
  return {
    totalLinesParsed,
    reconciledCount: matchedOrders.length,
    unmatchedCreditLines,
    matchedOrders,
  };
}

// =========================================================================
// PUBLIC API HELPERS (AUTO-SWITCHES SEAMLESSLY BETWEEN BACKEND & STATIC MODE)
// =========================================================================

export async function getYoupiGatewayHealth(): Promise<YoupiGatewayHealth | null> {
  if (!backendUnavailableDetected) {
    try {
      const res = await fetch('/api/youpi/v1/health');
      if (!isStaticFallbackResponse(res) && res.ok) {
        return (await res.json()) as YoupiGatewayHealth;
      }
      if (isStaticFallbackResponse(res)) {
        backendUnavailableDetected = true;
      }
    } catch {
      backendUnavailableDetected = true;
    }
  }

  const ledger = loadStaticLedger();
  return {
    status: 'ok',
    engine: 'YouPI-PG Direct NPCI UPI Engine',
    mode: 'embedded',
    payeeVpa: ledger.payeeVpa,
    payeeName: ledger.payeeName,
    currency: 'INR',
    sessionTimeoutSeconds: SESSION_TIMEOUT_SECONDS,
    webhookConfigured: false,
  };
}

export async function createYoupiPaymentSession(
  params: CreateYoupiPaymentParams
): Promise<YoupiPaymentSessionResponse> {
  if (!backendUnavailableDetected) {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (params.idempotencyKey) {
        headers['Idempotency-Key'] = params.idempotencyKey;
      }

      const res = await fetch('/api/youpi/v1/payments', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          orderId: params.orderId,
          amount: typeof params.amount === 'number' ? params.amount.toFixed(2) : params.amount,
          currency: 'INR',
          customer: params.customer,
          itemsSummary: params.itemsSummary,
          returnUrl: params.returnUrl,
          metadata: params.metadata,
        }),
      });

      if (isStaticFallbackResponse(res)) {
        backendUnavailableDetected = true;
      } else {
        if (!res.ok) {
          throw new Error(await parseErrorMessage(res, 'Unable to initialize YouPI-PG payment session.'));
        }
        return (await res.json()) as YoupiPaymentSessionResponse;
      }
    } catch (err) {
      if (err instanceof TypeError) {
        backendUnavailableDetected = true;
      } else {
        throw err;
      }
    }
  }

  return staticCreatePaymentSession(params);
}

export async function getYoupiPaymentStatus(
  paymentId: string,
  sessionToken: string
): Promise<YoupiPaymentSessionResponse> {
  if (!backendUnavailableDetected) {
    try {
      const res = await fetch(`/api/youpi/v1/payments/${encodeURIComponent(paymentId)}`, {
        headers: {
          'X-Session-Token': sessionToken,
        },
      });
      if (isStaticFallbackResponse(res)) {
        backendUnavailableDetected = true;
      } else {
        if (!res.ok) {
          throw new Error(await parseErrorMessage(res, 'Failed to check payment status.'));
        }
        return (await res.json()) as YoupiPaymentSessionResponse;
      }
    } catch (err) {
      if (err instanceof TypeError) {
        backendUnavailableDetected = true;
      } else {
        throw err;
      }
    }
  }

  return staticGetPaymentStatus(paymentId, sessionToken);
}

export async function submitYoupiUtr(
  paymentId: string,
  sessionToken: string,
  utr: string,
  payerApp?: string
): Promise<YoupiPaymentSessionResponse> {
  if (!backendUnavailableDetected) {
    try {
      const res = await fetch(`/api/youpi/v1/checkout/${encodeURIComponent(paymentId)}/utr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Token': sessionToken,
        },
        body: JSON.stringify({ utr, payerApp }),
      });

      if (isStaticFallbackResponse(res)) {
        backendUnavailableDetected = true;
      } else {
        if (!res.ok) {
          throw new Error(await parseErrorMessage(res, 'Failed to submit 12-digit UTR number.'));
        }
        return (await res.json()) as YoupiPaymentSessionResponse;
      }
    } catch (err) {
      if (err instanceof TypeError) {
        backendUnavailableDetected = true;
      } else {
        throw err;
      }
    }
  }

  return staticSubmitUtr(paymentId, sessionToken, utr, payerApp);
}

export async function confirmYoupiCod(
  paymentId: string,
  sessionToken: string,
  codAmount?: number
): Promise<YoupiPaymentSessionResponse> {
  if (!backendUnavailableDetected) {
    try {
      const res = await fetch(`/api/youpi/v1/checkout/${encodeURIComponent(paymentId)}/cod`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Token': sessionToken,
        },
        body: JSON.stringify({ codAmount }),
      });

      if (isStaticFallbackResponse(res)) {
        backendUnavailableDetected = true;
      } else {
        if (!res.ok) {
          throw new Error(await parseErrorMessage(res, 'Failed to confirm Cash on Delivery.'));
        }
        return (await res.json()) as YoupiPaymentSessionResponse;
      }
    } catch (err) {
      if (err instanceof TypeError) {
        backendUnavailableDetected = true;
      } else {
        throw err;
      }
    }
  }

  return staticConfirmCod(paymentId, sessionToken, codAmount);
}

export async function cancelYoupiPayment(
  paymentId: string,
  sessionToken: string
): Promise<{ success: boolean; status: string }> {
  if (!backendUnavailableDetected) {
    try {
      const res = await fetch(`/api/youpi/v1/checkout/${encodeURIComponent(paymentId)}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Token': sessionToken,
        },
      });

      if (isStaticFallbackResponse(res)) {
        backendUnavailableDetected = true;
      } else {
        if (!res.ok) {
          throw new Error(await parseErrorMessage(res, 'Failed to cancel payment session.'));
        }
        return (await res.json()) as { success: boolean; status: string };
      }
    } catch (err) {
      if (err instanceof TypeError) {
        backendUnavailableDetected = true;
      } else {
        throw err;
      }
    }
  }

  return staticCancelPayment(paymentId, sessionToken);
}

// =========================================================================
// ADMIN API HELPERS (Bearer token stored strictly in React memory only)
// =========================================================================

export async function getYoupiAdminAuthStatus(): Promise<{
  envConfigured: boolean;
  claimed: boolean;
  needsBootstrap: boolean;
}> {
  if (!backendUnavailableDetected) {
    try {
      const res = await fetch('/api/youpi/v1/admin/auth/status');
      if (isStaticFallbackResponse(res)) {
        backendUnavailableDetected = true;
      } else {
        if (!res.ok) {
          throw new Error('Could not check admin authentication status.');
        }
        return res.json();
      }
    } catch (err) {
      if (err instanceof TypeError) {
        backendUnavailableDetected = true;
      } else {
        throw err;
      }
    }
  }

  const ledger = loadStaticLedger();
  const claimed = Boolean(ledger.adminPasscodeHash);
  return {
    envConfigured: false,
    claimed,
    needsBootstrap: !claimed,
  };
}

export async function bootstrapYoupiAdminPasscode(
  passcode: string
): Promise<{ success: boolean; token: string; expiresAt: string }> {
  if (!backendUnavailableDetected) {
    try {
      const res = await fetch('/api/youpi/v1/admin/auth/bootstrap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });
      if (isStaticFallbackResponse(res)) {
        backendUnavailableDetected = true;
      } else {
        if (!res.ok) {
          throw new Error(await parseErrorMessage(res, 'Could not initialize admin passcode.'));
        }
        return res.json();
      }
    } catch (err) {
      if (err instanceof TypeError) {
        backendUnavailableDetected = true;
      } else {
        throw err;
      }
    }
  }

  const trimmed = passcode.trim();
  if (trimmed.length < 6) {
    throw new Error('Passcode must be at least 6 characters long.');
  }
  const ledger = loadStaticLedger();
  if (ledger.adminPasscodeHash) {
    throw new Error('Admin passcode is already configured. Please sign in.');
  }
  const salt = generateRandomId('salt');
  ledger.adminPasscodeSalt = salt;
  ledger.adminPasscodeHash = await hashPasscode(trimmed, salt);
  saveStaticLedger(ledger);
  const { token, expiresAt } = issueStaticAdminToken();
  return { success: true, token, expiresAt };
}

export async function loginYoupiAdmin(
  passcode: string
): Promise<{ success: boolean; token: string; expiresAt: string }> {
  if (!backendUnavailableDetected) {
    try {
      const res = await fetch('/api/youpi/v1/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });
      if (isStaticFallbackResponse(res)) {
        backendUnavailableDetected = true;
      } else {
        if (!res.ok) {
          throw new Error(await parseErrorMessage(res, 'Invalid admin passcode.'));
        }
        return res.json();
      }
    } catch (err) {
      if (err instanceof TypeError) {
        backendUnavailableDetected = true;
      } else {
        throw err;
      }
    }
  }

  const ledger = loadStaticLedger();
  if (!ledger.adminPasscodeHash || !ledger.adminPasscodeSalt) {
    throw new Error('Admin passcode is not set up yet.');
  }
  const candidate = await hashPasscode(passcode.trim(), ledger.adminPasscodeSalt);
  if (candidate !== ledger.adminPasscodeHash) {
    throw new Error('Invalid merchant passcode.');
  }
  const { token, expiresAt } = issueStaticAdminToken();
  return { success: true, token, expiresAt };
}

export async function fetchYoupiAdminPayments(token: string): Promise<{
  mode: 'embedded' | 'external';
  payeeVpa: string;
  payeeName: string;
  sessions: YoupiAdminPaymentSession[];
}> {
  if (!backendUnavailableDetected) {
    try {
      const res = await fetch('/api/youpi/v1/admin/payments', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (isStaticFallbackResponse(res)) {
        backendUnavailableDetected = true;
      } else {
        if (!res.ok) {
          throw new Error(await parseErrorMessage(res, 'Unable to fetch YouPI-PG payments.'));
        }
        return res.json();
      }
    } catch (err) {
      if (err instanceof TypeError) {
        backendUnavailableDetected = true;
      } else {
        throw err;
      }
    }
  }

  assertStaticAdminToken(token);
  const ledger = loadStaticLedger();
  return {
    mode: 'embedded',
    payeeVpa: ledger.payeeVpa,
    payeeName: ledger.payeeName,
    sessions: ledger.sessions.map((s) => ({
      ...toPublicSession(s, false),
      utr: s.utr,
      customer: s.customer,
      itemsSummary: s.itemsSummary,
      auditLog: s.auditLog,
    })),
  };
}

export async function reviewYoupiAdminPayment(
  token: string,
  paymentId: string,
  decision: 'verify' | 'reject',
  reason?: string,
  utr?: string
): Promise<YoupiAdminPaymentSession> {
  if (!backendUnavailableDetected) {
    try {
      const res = await fetch(
        `/api/youpi/v1/admin/payments/${encodeURIComponent(paymentId)}/review`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ decision, reason, utr }),
        }
      );
      if (isStaticFallbackResponse(res)) {
        backendUnavailableDetected = true;
      } else {
        if (!res.ok) {
          throw new Error(await parseErrorMessage(res, 'Unable to record review decision.'));
        }
        return res.json();
      }
    } catch (err) {
      if (err instanceof TypeError) {
        backendUnavailableDetected = true;
      } else {
        throw err;
      }
    }
  }

  assertStaticAdminToken(token);
  const ledger = loadStaticLedger();
  const rec = ledger.sessions.find((s) => s.paymentId === paymentId);
  if (!rec) throw new Error('Payment session not found.');

  const nowIso = new Date().toISOString();
  if (decision === 'verify') {
    if (utr && /^\d{12}$/.test(utr.trim())) {
      rec.utr = utr.trim();
      rec.utrMasked = maskUtr(rec.utr);
      rec.utrSubmitted = true;
    }
    rec.status = 'RECONCILED';
    rec.settlementState = 'RECONCILED';
    rec.rejectionReason = null;
    rec.completedAt = nowIso;
    rec.auditLog.push({
      at: nowIso,
      actor: 'ADMIN',
      action: 'PAYMENT_VERIFIED',
      details: reason || 'Manually verified against bank UPI credit',
    });
  } else {
    rec.status = 'FAILED';
    rec.settlementState = 'NOT_RECONCILED';
    rec.rejectionReason = reason || 'Payment could not be verified in bank statement';
    rec.auditLog.push({
      at: nowIso,
      actor: 'ADMIN',
      action: 'PAYMENT_REJECTED',
      details: rec.rejectionReason,
    });
  }
  rec.updatedAt = nowIso;
  saveStaticLedger(ledger);

  return {
    ...toPublicSession(rec, false),
    utr: rec.utr,
    customer: rec.customer,
    itemsSummary: rec.itemsSummary,
    auditLog: rec.auditLog,
  };
}

export async function importYoupiBankStatementCsv(
  token: string,
  csv: string
): Promise<{
  totalLinesParsed: number;
  reconciledCount: number;
  unmatchedCreditLines: number;
  matchedOrders: Array<{ orderId: string; paymentId: string; utr: string; amount: string }>;
}> {
  if (!backendUnavailableDetected) {
    try {
      const res = await fetch('/api/youpi/v1/admin/statements/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ csv }),
      });
      if (isStaticFallbackResponse(res)) {
        backendUnavailableDetected = true;
      } else {
        if (!res.ok) {
          throw new Error(await parseErrorMessage(res, 'Bank statement CSV import failed.'));
        }
        return res.json();
      }
    } catch (err) {
      if (err instanceof TypeError) {
        backendUnavailableDetected = true;
      } else {
        throw err;
      }
    }
  }

  return staticImportBankStatementCsv(token, csv);
}

export async function updateYoupiAdminSettings(
  token: string,
  payeeVpa: string,
  payeeName: string
): Promise<{ success: boolean; payeeVpa: string; payeeName: string; updatedAt: string }> {
  if (!backendUnavailableDetected) {
    try {
      const res = await fetch('/api/youpi/v1/admin/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ payeeVpa, payeeName }),
      });
      if (isStaticFallbackResponse(res)) {
        backendUnavailableDetected = true;
      } else {
        if (!res.ok) {
          throw new Error(await parseErrorMessage(res, 'Could not update UPI merchant settings.'));
        }
        return res.json();
      }
    } catch (err) {
      if (err instanceof TypeError) {
        backendUnavailableDetected = true;
      } else {
        throw err;
      }
    }
  }

  assertStaticAdminToken(token);
  const cleanVpa = payeeVpa.trim();
  const cleanName = payeeName.trim();
  if (!/^[a-zA-Z0-9._-]{2,}@[a-zA-Z0-9]{2,}$/.test(cleanVpa)) {
    throw new Error('Please enter a valid UPI ID (e.g. yourname@ybl or merchant@okaxis).');
  }
  if (cleanName.length < 2) {
    throw new Error('Payee name must be at least 2 characters.');
  }

  const ledger = loadStaticLedger();
  ledger.payeeVpa = cleanVpa;
  ledger.payeeName = cleanName;
  saveStaticLedger(ledger);
  return {
    success: true,
    payeeVpa: cleanVpa,
    payeeName: cleanName,
    updatedAt: new Date().toISOString(),
  };
}
