import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import express, { Router, Request, Response, NextFunction } from 'express';

// Direct imports from the cloned YouPI-PG repository (/youpi-pg)
import { toPaise, toRupeesString } from '../youpi-pg/packages/common/src/money.js';
import { buildUpiUri, buildUpiIntentUri, isValidVpa } from '../youpi-pg/packages/common/src/upi.js';
import { generateHmac, verifyHmac, generateRandomToken } from '../youpi-pg/packages/common/src/crypto.js';
import { PaymentStatus as RawPaymentStatus, PaymentMethod } from '../youpi-pg/packages/common/src/enums.js';
import { isValidTransition, isTerminalStatus } from '../youpi-pg/packages/common/src/state-transitions.js';
import { UPI_PROVIDERS } from '../youpi-pg/packages/common/src/upi-providers.js';
import { parseStatementCsv } from '../youpi-pg/packages/core/src/statement-parser.js';

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

const runtimePaymentStatus = RawPaymentStatus as Record<string, string>;
const PaymentStatus = {
  INITIATED: (runtimePaymentStatus.INITIATED || 'INITIATED') as YoupiSessionStatus,
  QUEUED: (runtimePaymentStatus.QUEUED || 'QUEUED') as YoupiSessionStatus,
  ACTIVE: (runtimePaymentStatus.ACTIVE || 'ACTIVE') as YoupiSessionStatus,
  PROCESSING: (runtimePaymentStatus.PROCESSING || 'PROCESSING') as YoupiSessionStatus,
  OBSERVED_SUCCESS: (runtimePaymentStatus.OBSERVED_SUCCESS || 'OBSERVED_SUCCESS') as YoupiSessionStatus,
  RECONCILED: (runtimePaymentStatus.RECONCILED || 'RECONCILED') as YoupiSessionStatus,
  MANUAL_REVIEW: (runtimePaymentStatus.MANUAL_REVIEW || 'MANUAL_REVIEW') as YoupiSessionStatus,
  SUCCESS: (runtimePaymentStatus.SUCCESS || 'SUCCESS') as YoupiSessionStatus,
  FAILED: (runtimePaymentStatus.FAILED || 'FAILED') as YoupiSessionStatus,
  EXPIRED: (runtimePaymentStatus.EXPIRED || 'EXPIRED') as YoupiSessionStatus,
  CANCELLED: (runtimePaymentStatus.CANCELLED || 'CANCELLED') as YoupiSessionStatus,
} as const;

export type YoupiSettlementState =
  | 'NOT_APPLICABLE'
  | 'NOT_RECONCILED'
  | 'MANUAL_REVIEW'
  | 'RECONCILED'
  | 'NOT_BANK_SETTLEMENT';

export interface YoupiAuditEntry {
  at: string;
  actor: 'SYSTEM' | 'CUSTOMER' | 'ADMIN' | 'WEBHOOK';
  action: string;
  details?: string;
}

export interface YoupiPaymentSession {
  paymentId: string;
  orderId: string;
  amount: string;
  amountPaise: string;
  currency: 'INR';
  status: YoupiSessionStatus;
  settlementState: YoupiSettlementState;
  method: 'UPI' | 'MANUAL_UPI' | 'COD';
  mode: 'embedded' | 'external';
  externalPaymentId?: string | null;
  checkoutUrl?: string | null;
  payeeVpa: string;
  payeeName: string;
  upiUri: string;
  intentUris: Record<string, string>;
  sessionTokenHash: string;
  idempotencyKey?: string | null;
  utr?: string | null;
  payerApp?: string | null;
  rejectionReason?: string | null;
  customer: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
  };
  itemsSummary: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  completedAt?: string | null;
  auditLog: YoupiAuditEntry[];
}

interface WebhookReceipt {
  deliveryId: string;
  event: string;
  orderId?: string;
  receivedAt: string;
}

interface AdminCredentialStore {
  passcodeHash: string;
  claimedAt: string;
}

interface MerchantPayeeConfig {
  payeeVpa: string;
  payeeName: string;
  updatedAt: string;
}

interface YoupiLedgerFile {
  version: number;
  sessions: Record<string, YoupiPaymentSession>;
  idempotencyMap: Record<string, string>;
  webhookReceipts: Record<string, WebhookReceipt>;
  adminCredential: AdminCredentialStore | null;
  merchantConfig: MerchantPayeeConfig | null;
}

const SESSION_DURATION_MS = 5 * 60 * 1000; // 5-minute NPCI/YouPI-PG payment window
const WEBHOOK_TOLERANCE_MS = 2 * 60 * 60 * 1000; // 2 hours per YouPI-PG retry schedule
const ADMIN_TOKEN_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours
const LEDGER_DIR = path.resolve(process.cwd(), 'data');
const LEDGER_PATH = path.resolve(LEDGER_DIR, 'youpi-pg-ledger.json');

// Session signing secret (in-memory random fallback if env var not set)
const SESSION_SIGNING_SECRET =
  (process.env.YOUPI_SESSION_SECRET || '').trim() || crypto.randomBytes(32).toString('hex');

const FALLBACK_PUBLIC_PAYEE_VPA = 'pranyatrivedi@ybl';
const FALLBACK_PUBLIC_PAYEE_NAME = 'Qavelle';

function getPayeeConfig(): { payeeVpa: string; payeeName: string } {
  const saved = ledger.getMerchantConfig();
  if (saved && isValidVpa(saved.payeeVpa)) {
    return {
      payeeVpa: saved.payeeVpa,
      payeeName: saved.payeeName || FALLBACK_PUBLIC_PAYEE_NAME,
    };
  }
  const envVpa = (process.env.YOUPI_PAYEE_VPA || '').trim();
  const payeeVpa = envVpa && isValidVpa(envVpa) ? envVpa : FALLBACK_PUBLIC_PAYEE_VPA;
  const payeeName = (process.env.YOUPI_PAYEE_NAME || '').trim() || FALLBACK_PUBLIC_PAYEE_NAME;
  return { payeeVpa, payeeName };
}

function getExternalGatewayConfig(): {
  enabled: boolean;
  apiUrl: string;
  merchantId: string;
  apiKey: string;
  webhookSecret: string;
} {
  const rawUrl = (process.env.YOUPI_API_URL || '').trim().replace(/\/+$/, '');
  const merchantId = (process.env.YOUPI_MERCHANT_ID || '').trim();
  const apiKey = (process.env.YOUPI_MERCHANT_API_KEY || '').trim();
  const webhookSecret = (process.env.YOUPI_WEBHOOK_SECRET || '').trim();

  if (!rawUrl) {
    return { enabled: false, apiUrl: '', merchantId, apiKey, webhookSecret };
  }

  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { enabled: false, apiUrl: '', merchantId, apiKey, webhookSecret };
    }
    // Block cloud metadata IP (SSRF protection)
    if (parsed.hostname === '169.254.169.254') {
      return { enabled: false, apiUrl: '', merchantId, apiKey, webhookSecret };
    }
    return {
      enabled: true,
      apiUrl: parsed.origin + parsed.pathname.replace(/\/+$/, ''),
      merchantId,
      apiKey,
      webhookSecret,
    };
  } catch {
    return { enabled: false, apiUrl: '', merchantId, apiKey, webhookSecret };
  }
}

function settlementStateFor(status: YoupiSessionStatus): YoupiSettlementState {
  switch (status) {
    case 'RECONCILED':
      return 'RECONCILED';
    case 'OBSERVED_SUCCESS':
      return 'NOT_RECONCILED';
    case 'MANUAL_REVIEW':
      return 'MANUAL_REVIEW';
    case 'SUCCESS':
      return 'NOT_BANK_SETTLEMENT';
    default:
      return 'NOT_APPLICABLE';
  }
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token, 'utf8').digest('hex');
}

function verifyTokenHash(token: string, expectedHash: string): boolean {
  if (!token || !expectedHash) return false;
  const actual = Buffer.from(hashToken(token), 'hex');
  const expected = Buffer.from(expectedHash, 'hex');
  if (actual.length !== expected.length) return false;
  return crypto.timingSafeEqual(actual, expected);
}

function hashPasscodeScrypt(passcode: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(passcode, salt, 64).toString('hex');
  return `scrypt:${salt}:${derived}`;
}

function verifyPasscodeScrypt(passcode: string, stored: string): boolean {
  const parts = stored.split(':');
  if (parts.length !== 3 || parts[0] !== 'scrypt') return false;
  const [, salt, originalHex] = parts;
  const derived = crypto.scryptSync(passcode, salt, 64);
  const original = Buffer.from(originalHex, 'hex');
  if (derived.length !== original.length) return false;
  return crypto.timingSafeEqual(derived, original);
}

function safeCompareStrings(a: string, b: string): boolean {
  const bufA = crypto.createHash('sha256').update(a, 'utf8').digest();
  const bufB = crypto.createHash('sha256').update(b, 'utf8').digest();
  return crypto.timingSafeEqual(bufA, bufB);
}

function issueAdminBearerToken(): { token: string; expiresAt: string } {
  const exp = Date.now() + ADMIN_TOKEN_TTL_MS;
  const nonce = generateRandomToken(16);
  const payload = Buffer.from(JSON.stringify({ role: 'admin', exp, nonce }), 'utf8').toString('base64url');
  const sig = generateHmac(payload, SESSION_SIGNING_SECRET);
  return {
    token: `${payload}.${sig}`,
    expiresAt: new Date(exp).toISOString(),
  };
}

function verifyAdminBearerToken(token: string): boolean {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  if (!payload || !sig) return false;
  if (!verifyHmac(payload, SESSION_SIGNING_SECRET, sig)) return false;
  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      role?: string;
      exp?: number;
    };
    if (decoded.role !== 'admin') return false;
    if (!decoded.exp || Date.now() > decoded.exp) return false;
    return true;
  } catch {
    return false;
  }
}

function sanitizeText(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return '';
  return value.replace(/[\r\n\t]+/g, ' ').trim().slice(0, maxLength);
}

function validateSafeHttpUrl(rawUrl: unknown, req: Request): string | null {
  if (typeof rawUrl !== 'string' || !rawUrl.trim()) return null;
  try {
    const parsed = new URL(rawUrl.trim());
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
    if (parsed.username || parsed.password) return null;

    const allowedRaw = (process.env.YOUPI_ALLOWED_RETURN_ORIGINS || '').trim();
    if (allowedRaw) {
      const allowedOrigins = allowedRaw
        .split(/[\s,]+/)
        .map((s) => s.trim())
        .filter(Boolean);
      if (!allowedOrigins.includes(parsed.origin)) return null;
    } else {
      const hostHeader = (req.headers['x-forwarded-host'] || req.headers.host || '').toString().split(',')[0].trim();
      if (hostHeader && parsed.host !== hostHeader) {
        return null;
      }
    }
    return parsed.href;
  } catch {
    return null;
  }
}

function buildIntentUrisForSession(
  payeeVpa: string,
  payeeName: string,
  amountPaise: bigint,
  transactionRef: string
): Record<string, string> {
  const intents: Record<string, string> = {};
  const providerPackages: Record<string, string> = {
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

  // Include canonical package names from cloned YouPI-PG UPI_PROVIDERS
  for (const provider of UPI_PROVIDERS) {
    if (provider?.id && provider?.packageName && !providerPackages[provider.id]) {
      providerPackages[provider.id] = provider.packageName;
    }
  }

  for (const [id, pkg] of Object.entries(providerPackages)) {
    try {
      intents[id] = buildUpiIntentUri({
        payeeVpa,
        payeeName,
        amountPaise,
        transactionRef,
        packageName: pkg,
      });
    } catch {
      // Skip invalid package entry
    }
  }
  return intents;
}

class YoupiLedgerStore {
  private data: YoupiLedgerFile;

  constructor() {
    this.data = this.load();
  }

  private load(): YoupiLedgerFile {
    try {
      if (fs.existsSync(LEDGER_PATH)) {
        const raw = fs.readFileSync(LEDGER_PATH, 'utf8');
        const parsed = JSON.parse(raw) as Partial<YoupiLedgerFile>;
        return {
          version: 1,
          sessions: parsed.sessions && typeof parsed.sessions === 'object' ? parsed.sessions : {},
          idempotencyMap:
            parsed.idempotencyMap && typeof parsed.idempotencyMap === 'object' ? parsed.idempotencyMap : {},
          webhookReceipts:
            parsed.webhookReceipts && typeof parsed.webhookReceipts === 'object' ? parsed.webhookReceipts : {},
          adminCredential: parsed.adminCredential ?? null,
          merchantConfig: parsed.merchantConfig ?? null,
        };
      }
    } catch (err) {
      console.warn('[YouPI-PG] Could not load ledger file, starting fresh:', err);
    }
    return {
      version: 1,
      sessions: {},
      idempotencyMap: {},
      webhookReceipts: {},
      adminCredential: null,
      merchantConfig: null,
    };
  }

  private save(): void {
    try {
      if (!fs.existsSync(LEDGER_DIR)) {
        fs.mkdirSync(LEDGER_DIR, { recursive: true });
      }
      const tmpPath = `${LEDGER_PATH}.tmp`;
      fs.writeFileSync(tmpPath, JSON.stringify(this.data, null, 2), 'utf8');
      fs.renameSync(tmpPath, LEDGER_PATH);
    } catch (err) {
      console.error('[YouPI-PG] Failed to persist ledger:', err);
    }
  }

  public expireStaleSessions(): void {
    const now = Date.now();
    let changed = false;
    for (const session of Object.values(this.data.sessions)) {
      if (
        (session.status === PaymentStatus.ACTIVE || session.status === PaymentStatus.INITIATED) &&
        new Date(session.expiresAt).getTime() <= now
      ) {
        if (isValidTransition(session.status, PaymentStatus.EXPIRED)) {
          session.status = PaymentStatus.EXPIRED;
          session.settlementState = settlementStateFor(PaymentStatus.EXPIRED);
          session.updatedAt = new Date().toISOString();
          session.auditLog.push({
            at: session.updatedAt,
            actor: 'SYSTEM',
            action: 'SESSION_EXPIRED',
            details: '5-minute UPI payment window elapsed',
          });
          changed = true;
        }
      }
    }
    if (changed) this.save();
  }

  public getSession(paymentId: string): YoupiPaymentSession | null {
    this.expireStaleSessions();
    return this.data.sessions[paymentId] || null;
  }

  public findByIdempotencyKey(key: string): YoupiPaymentSession | null {
    this.expireStaleSessions();
    const paymentId = this.data.idempotencyMap[key];
    if (!paymentId) return null;
    return this.data.sessions[paymentId] || null;
  }

  public findByOrderId(orderId: string): YoupiPaymentSession | null {
    this.expireStaleSessions();
    const matches = Object.values(this.data.sessions)
      .filter((s) => s.orderId === orderId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return matches[0] || null;
  }

  public findByUtr(utr: string): YoupiPaymentSession | null {
    return (
      Object.values(this.data.sessions).find(
        (s) => s.utr === utr && s.status !== PaymentStatus.CANCELLED && s.status !== PaymentStatus.FAILED
      ) || null
    );
  }

  public listSessions(): YoupiPaymentSession[] {
    this.expireStaleSessions();
    return Object.values(this.data.sessions).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  public saveSession(session: YoupiPaymentSession): void {
    this.data.sessions[session.paymentId] = session;
    if (session.idempotencyKey) {
      this.data.idempotencyMap[session.idempotencyKey] = session.paymentId;
    }
    this.save();
  }

  public hasWebhookReceipt(deliveryId: string): boolean {
    return Boolean(this.data.webhookReceipts[deliveryId]);
  }

  public recordWebhookReceipt(receipt: WebhookReceipt): void {
    this.data.webhookReceipts[receipt.deliveryId] = receipt;
    this.save();
  }

  public getAdminCredential(): AdminCredentialStore | null {
    return this.data.adminCredential;
  }

  public claimAdminCredentialOnce(passcode: string): boolean {
    if (this.data.adminCredential) return false;
    this.data.adminCredential = {
      passcodeHash: hashPasscodeScrypt(passcode),
      claimedAt: new Date().toISOString(),
    };
    this.save();
    return true;
  }

  public getMerchantConfig(): MerchantPayeeConfig | null {
    return this.data.merchantConfig;
  }

  public updateMerchantConfig(payeeVpa: string, payeeName: string): MerchantPayeeConfig {
    const next: MerchantPayeeConfig = {
      payeeVpa,
      payeeName,
      updatedAt: new Date().toISOString(),
    };
    this.data.merchantConfig = next;
    this.save();
    return next;
  }
}

const ledger = new YoupiLedgerStore();

function toPublicSessionView(session: YoupiPaymentSession) {
  const remainingMs = Math.max(0, new Date(session.expiresAt).getTime() - Date.now());
  return {
    paymentId: session.paymentId,
    orderId: session.orderId,
    amount: session.amount,
    amountPaise: session.amountPaise,
    currency: session.currency,
    status: session.status,
    settlementState: session.settlementState,
    method: session.method,
    mode: session.mode,
    checkoutUrl: session.checkoutUrl || null,
    payeeVpa: session.payeeVpa,
    payeeName: session.payeeName,
    upiUri: session.upiUri,
    intentUris: session.intentUris,
    utrMasked: session.utr ? `XXXX-XXXX-${session.utr.slice(-4)}` : null,
    utrSubmitted: Boolean(session.utr),
    payerApp: session.payerApp || null,
    rejectionReason: session.rejectionReason || null,
    expiresAt: session.expiresAt,
    remainingSeconds: Math.ceil(remainingMs / 1000),
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
    completedAt: session.completedAt || null,
  };
}

function toAdminSessionView(session: YoupiPaymentSession) {
  return {
    ...toPublicSessionView(session),
    utr: session.utr || null,
    customer: session.customer,
    itemsSummary: session.itemsSummary,
    auditLog: session.auditLog,
  };
}

function requireAdminAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Admin authentication required.' });
    return;
  }
  const token = authHeader.slice('Bearer '.length).trim();
  if (!verifyAdminBearerToken(token)) {
    res.status(401).json({ error: 'Invalid or expired admin session.' });
    return;
  }
  next();
}

function extractSessionToken(req: Request): string {
  const headerToken = req.headers['x-session-token'];
  if (typeof headerToken === 'string' && headerToken.trim()) {
    return headerToken.trim();
  }
  if (req.body && typeof req.body.sessionToken === 'string') {
    return req.body.sessionToken.trim();
  }
  if (typeof req.query.sessionToken === 'string') {
    return req.query.sessionToken.trim();
  }
  return '';
}

/**
 * Raw-body webhook handler MUST be mounted BEFORE express.json() in server.ts
 * so HMAC-SHA256 signature verification runs over exact raw bytes.
 */
export function createYoupiWebhookHandler() {
  return [
    express.raw({ type: 'application/json', limit: '256kb' }),
    (req: Request, res: Response) => {
      const extConfig = getExternalGatewayConfig();
      const webhookSecret = extConfig.webhookSecret;

      if (!webhookSecret) {
        return res.status(503).json({
          error: 'YOUPI_WEBHOOK_SECRET is not configured on the server.',
        });
      }

      const rawBody = Buffer.isBuffer(req.body)
        ? req.body.toString('utf8')
        : typeof req.body === 'string'
        ? req.body
        : '';

      if (!rawBody) {
        return res.status(400).json({ error: 'Empty webhook payload.' });
      }

      const signatureHeader = String(req.headers['x-gateway-signature'] || '');
      const timestampHeader = String(req.headers['x-gateway-timestamp'] || '');
      const deliveryId = String(req.headers['x-gateway-delivery-id'] || '').trim();

      if (!signatureHeader.startsWith('sha256=')) {
        return res.status(401).json({ error: 'Invalid X-Gateway-Signature format.' });
      }
      const actualSig = signatureHeader.slice('sha256='.length).trim();

      if (timestampHeader) {
        const tsNum = Number(timestampHeader);
        if (!Number.isFinite(tsNum) || Math.abs(Date.now() - tsNum) > WEBHOOK_TOLERANCE_MS) {
          return res.status(401).json({ error: 'Webhook timestamp outside tolerance window.' });
        }
      }

      const matchesRaw = verifyHmac(rawBody, webhookSecret, actualSig);
      const matchesTimestamped =
        Boolean(timestampHeader) && verifyHmac(`${timestampHeader}.${rawBody}`, webhookSecret, actualSig);

      if (!matchesRaw && !matchesTimestamped) {
        return res.status(401).json({ error: 'Webhook signature mismatch.' });
      }

      if (deliveryId && ledger.hasWebhookReceipt(deliveryId)) {
        return res.status(200).json({ received: true, duplicate: true });
      }

      let eventPayload: Record<string, unknown>;
      try {
        eventPayload = JSON.parse(rawBody) as Record<string, unknown>;
      } catch {
        return res.status(400).json({ error: 'Malformed JSON webhook body.' });
      }

      if (eventPayload.timestamp !== undefined && eventPayload.timestamp !== null) {
        const bodyTs = Number(eventPayload.timestamp);
        if (!Number.isFinite(bodyTs) || Math.abs(Date.now() - bodyTs) > WEBHOOK_TOLERANCE_MS) {
          return res.status(401).json({ error: 'Signed payload timestamp outside tolerance window.' });
        }
      }

      const eventName = String(eventPayload.event || eventPayload.status || '').toUpperCase();
      const paymentId = String(eventPayload.paymentId || '');
      const orderId = String(eventPayload.orderId || '');
      const currency = String(eventPayload.currency || 'INR').toUpperCase();
      const eventAmountPaise = Number(eventPayload.amountPaise);
      const utr = typeof eventPayload.utr === 'string' ? eventPayload.utr.trim() : null;

      if (currency !== 'INR') {
        return res.status(400).json({ error: 'Unsupported webhook currency.' });
      }

      const session =
        (paymentId ? ledger.getSession(paymentId) : null) ||
        (orderId ? ledger.findByOrderId(orderId) : null);

      if (!session) {
        return res.status(404).json({ error: 'Unknown payment session or order.' });
      }

      if (Number.isFinite(eventAmountPaise) && BigInt(Math.round(eventAmountPaise)) !== BigInt(session.amountPaise)) {
        return res.status(400).json({ error: 'Webhook amountPaise does not match stored order amount.' });
      }

      if (deliveryId) {
        ledger.recordWebhookReceipt({
          deliveryId,
          event: eventName,
          orderId: session.orderId,
          receivedAt: new Date().toISOString(),
        });
      }

      // Enforce YouPI-PG settlement contract:
      // - OBSERVED_SUCCESS records observer match without marking bank-reconciled
      // - RECONCILED marks bank-statement settled
      // - MANUAL_REVIEW holds order for admin verification
      // - FAILED / EXPIRED / CANCELLED closes the attempt
      const validEvents: YoupiSessionStatus[] = [
        'OBSERVED_SUCCESS',
        'RECONCILED',
        'MANUAL_REVIEW',
        'SUCCESS',
        'FAILED',
        'EXPIRED',
        'CANCELLED',
      ];

      if (validEvents.includes(eventName as YoupiSessionStatus)) {
        const nextStatus = eventName as YoupiSessionStatus;
        // Per YouPI-PG contract: UPI SUCCESS is treated as OBSERVED_SUCCESS (never bank settled)
        const normalizedStatus: YoupiSessionStatus =
          nextStatus === 'SUCCESS' && session.method !== 'COD' ? 'OBSERVED_SUCCESS' : nextStatus;

        if (isValidTransition(session.status, normalizedStatus)) {
          session.status = normalizedStatus;
          session.settlementState = settlementStateFor(normalizedStatus);
          if (utr && /^\d{12}$/.test(utr)) {
            session.utr = utr;
          }
          session.updatedAt = new Date().toISOString();
          if (normalizedStatus === 'RECONCILED' || normalizedStatus === 'SUCCESS') {
            session.completedAt = session.updatedAt;
          }
          session.auditLog.push({
            at: session.updatedAt,
            actor: 'WEBHOOK',
            action: `WEBHOOK_${normalizedStatus}`,
            details: deliveryId ? `Delivery ${deliveryId}` : 'Signed YouPI-PG webhook',
          });
          ledger.saveSession(session);
        }
      }

      return res.status(200).json({
        received: true,
        paymentId: session.paymentId,
        orderId: session.orderId,
        status: session.status,
        settlementState: session.settlementState,
      });
    },
  ];
}

export function createYoupiGatewayRouter(): Router {
  const router = Router();

  // 1. Public gateway info (non-secret runtime metadata)
  router.get('/health', (_req: Request, res: Response) => {
    const ext = getExternalGatewayConfig();
    const payee = getPayeeConfig();
    res.json({
      status: 'ok',
      engine: 'YouPI-PG',
      mode: ext.enabled ? 'external' : 'embedded',
      payeeVpa: payee.payeeVpa,
      payeeName: payee.payeeName,
      currency: 'INR',
      sessionTimeoutSeconds: SESSION_DURATION_MS / 1000,
      webhookConfigured: Boolean(ext.webhookSecret),
      time: new Date().toISOString(),
    });
  });

  // 2. Create a YouPI-PG payment session (idempotent, server-validated integer paise)
  router.post('/payments', async (req: Request, res: Response) => {
    try {
      const body = req.body || {};
      const orderId = sanitizeText(body.orderId, 64);
      const rawAmount = body.amount;
      const currency = sanitizeText(body.currency || 'INR', 8).toUpperCase();
      const idempotencyKey = sanitizeText(
        req.headers['idempotency-key'] || body.idempotencyKey || '',
        128
      );

      if (!orderId) {
        return res.status(400).json({ error: 'orderId is required.' });
      }
      if (currency !== 'INR') {
        return res.status(400).json({ error: 'Only INR currency is supported.' });
      }

      let amountPaise: bigint;
      try {
        amountPaise = toPaise(rawAmount);
      } catch (err: unknown) {
        return res.status(400).json({
          error: err instanceof Error ? err.message : 'Invalid INR amount.',
        });
      }

      // Upper sanity guard (₹5,00,000 max per UPI order)
      if (amountPaise > 50000000n) {
        return res.status(400).json({ error: 'Amount exceeds single UPI transaction limit.' });
      }

      // Check idempotency key for active non-terminal session
      if (idempotencyKey) {
        const existing = ledger.findByIdempotencyKey(idempotencyKey);
        if (
          existing &&
          existing.orderId === orderId &&
          existing.amountPaise === amountPaise.toString() &&
          !isTerminalStatus(existing.status)
        ) {
          const freshToken = generateRandomToken(24);
          existing.sessionTokenHash = hashToken(freshToken);
          ledger.saveSession(existing);
          return res.status(200).json({
            ...toPublicSessionView(existing),
            sessionToken: freshToken,
            idempotent: true,
          });
        }
      }

      const customer = body.customer && typeof body.customer === 'object' ? body.customer : {};
      const customerName = sanitizeText(customer.name, 100) || 'Customer';
      const customerPhone = sanitizeText(customer.phoneNumber || customer.phone, 20);
      const customerEmail = sanitizeText(customer.email, 120);
      const customerAddress = sanitizeText(customer.address, 300);
      const itemsSummary = sanitizeText(body.itemsSummary || body.description, 300) || 'QAVELLE Royal Jewelry Order';
      const safeReturnUrl = validateSafeHttpUrl(body.returnUrl, req);

      const payee = getPayeeConfig();
      const ext = getExternalGatewayConfig();
      const nowIso = new Date().toISOString();
      const expiresAtIso = new Date(Date.now() + SESSION_DURATION_MS).toISOString();
      const formattedRupees = toRupeesString(amountPaise);
      const txnNote = `Qavelle ${orderId}`;

      const upiUri = buildUpiUri({
        payeeVpa: payee.payeeVpa,
        payeeName: payee.payeeName,
        amountPaise,
        transactionRef: txnNote,
      });

      const intentUris = buildIntentUrisForSession(
        payee.payeeVpa,
        payee.payeeName,
        amountPaise,
        txnNote
      );

      let paymentId: string = crypto.randomUUID();
      let externalPaymentId: string | null = null;
      let checkoutUrl: string | null = null;
      let sessionMode: 'embedded' | 'external' = 'embedded';

      // If an external self-hosted YouPI-PG instance is configured via server env vars, create session there
      if (ext.enabled) {
        try {
          const headers: Record<string, string> = {
            'Content-Type': 'application/json',
          };
          if (ext.merchantId) headers['X-Merchant-Id'] = ext.merchantId;
          if (ext.apiKey) headers['X-Merchant-Key'] = ext.apiKey;
          if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey;

          const extPayload: Record<string, unknown> = {
            orderId,
            amount: formattedRupees,
            currency: 'INR',
            customer: {
              fullName: customerName,
              phoneNumber: customerPhone,
              email: customerEmail || undefined,
            },
            description: itemsSummary,
            metadata: {
              store: 'QAVELLE',
              orderId,
            },
          };
          if (safeReturnUrl) {
            extPayload.returnUrl = safeReturnUrl;
          }

          const extRes = await fetch(`${ext.apiUrl}/api/v1/payments`, {
            method: 'POST',
            headers,
            body: JSON.stringify(extPayload),
          });

          if (extRes.ok) {
            const extJson = (await extRes.json()) as {
              paymentId?: string;
              checkoutUrl?: string;
            };
            if (extJson.paymentId) {
              paymentId = extJson.paymentId;
              externalPaymentId = extJson.paymentId;
            }
            if (typeof extJson.checkoutUrl === 'string') {
              try {
                const parsedCheckout = new URL(extJson.checkoutUrl);
                if (parsedCheckout.protocol === 'http:' || parsedCheckout.protocol === 'https:') {
                  checkoutUrl = parsedCheckout.href;
                }
              } catch {
                // ignore malformed external URL
              }
            }
            sessionMode = 'external';
          } else {
            console.warn(`[YouPI-PG] External gateway returned HTTP ${extRes.status}; falling back to embedded engine.`);
          }
        } catch (extErr) {
          console.warn('[YouPI-PG] External gateway unreachable; falling back to embedded engine:', extErr);
        }
      }

      const sessionToken = generateRandomToken(24);
      const session: YoupiPaymentSession = {
        paymentId,
        orderId,
        amount: formattedRupees,
        amountPaise: amountPaise.toString(),
        currency: 'INR',
        status: PaymentStatus.ACTIVE,
        settlementState: 'NOT_APPLICABLE',
        method: PaymentMethod.UPI,
        mode: sessionMode,
        externalPaymentId,
        checkoutUrl,
        payeeVpa: payee.payeeVpa,
        payeeName: payee.payeeName,
        upiUri,
        intentUris,
        sessionTokenHash: hashToken(sessionToken),
        idempotencyKey: idempotencyKey || null,
        utr: null,
        payerApp: null,
        rejectionReason: null,
        customer: {
          name: customerName,
          phone: customerPhone,
          email: customerEmail || undefined,
          address: customerAddress || undefined,
        },
        itemsSummary,
        metadata: body.metadata && typeof body.metadata === 'object' ? body.metadata : undefined,
        createdAt: nowIso,
        updatedAt: nowIso,
        expiresAt: expiresAtIso,
        completedAt: null,
        auditLog: [
          {
            at: nowIso,
            actor: 'SYSTEM',
            action: 'SESSION_CREATED',
            details: `YouPI-PG (${sessionMode}) session activated for ₹${formattedRupees}`,
          },
        ],
      };

      ledger.saveSession(session);

      return res.status(201).json({
        ...toPublicSessionView(session),
        sessionToken,
      });
    } catch (err: unknown) {
      console.error('[YouPI-PG] Error creating payment session:', err);
      return res.status(500).json({ error: 'Unable to initialize payment session.' });
    }
  });

  // 3. Get payment session status (polls external YouPI-PG if external mode)
  router.get('/payments/:paymentId', async (req: Request, res: Response) => {
    const paymentId = sanitizeText(req.params.paymentId, 128);
    const session = ledger.getSession(paymentId);
    if (!session) {
      return res.status(404).json({ error: 'Payment session not found.' });
    }

    const token = extractSessionToken(req);
    if (!verifyTokenHash(token, session.sessionTokenHash)) {
      return res.status(403).json({ error: 'Invalid session capability token.' });
    }

    // If external YouPI-PG is active and session is not final, sync status from upstream
    if (session.mode === 'external' && session.externalPaymentId && !isTerminalStatus(session.status)) {
      const ext = getExternalGatewayConfig();
      if (ext.enabled) {
        try {
          const headers: Record<string, string> = {};
          if (ext.apiKey) headers['X-Merchant-Key'] = ext.apiKey;
          const upstreamRes = await fetch(`${ext.apiUrl}/api/v1/payments/${encodeURIComponent(session.externalPaymentId)}`, {
            headers,
          });
          if (upstreamRes.ok) {
            const upstream = (await upstreamRes.json()) as { status?: string; utr?: string };
            const next = String(upstream.status || '').toUpperCase() as YoupiSessionStatus;
            const normalizedNext: YoupiSessionStatus =
              next === 'SUCCESS' && session.method !== 'COD' ? 'OBSERVED_SUCCESS' : next;
            if (normalizedNext && normalizedNext !== session.status && isValidTransition(session.status, normalizedNext)) {
              session.status = normalizedNext;
              session.settlementState = settlementStateFor(normalizedNext);
              if (typeof upstream.utr === 'string' && /^\d{12}$/.test(upstream.utr)) {
                session.utr = upstream.utr;
              }
              session.updatedAt = new Date().toISOString();
              session.auditLog.push({
                at: session.updatedAt,
                actor: 'SYSTEM',
                action: `UPSTREAM_SYNC_${normalizedNext}`,
              });
              ledger.saveSession(session);
            }
          }
        } catch {
          // Keep local status if upstream poll transiently fails
        }
      }
    }

    return res.json(toPublicSessionView(session));
  });

  // 4. Customer submits 12-digit UPI UTR / Reference Number (moves session to MANUAL_REVIEW)
  router.post('/checkout/:paymentId/utr', (req: Request, res: Response) => {
    const paymentId = sanitizeText(req.params.paymentId, 128);
    const session = ledger.getSession(paymentId);
    if (!session) {
      return res.status(404).json({ error: 'Payment session not found.' });
    }

    const token = extractSessionToken(req);
    if (!verifyTokenHash(token, session.sessionTokenHash)) {
      return res.status(403).json({ error: 'Invalid session capability token.' });
    }

    const rawUtr = sanitizeText(req.body?.utr, 32).replace(/\s+/g, '');
    const payerApp = sanitizeText(req.body?.payerApp, 60);

    if (!/^\d{12}$/.test(rawUtr)) {
      return res.status(400).json({
        error: 'Please enter a valid 12-digit UPI UTR / Reference Number.',
      });
    }

    if (session.status === PaymentStatus.RECONCILED) {
      return res.status(200).json(toPublicSessionView(session));
    }

    if (
      session.status === PaymentStatus.CANCELLED ||
      session.status === PaymentStatus.FAILED
    ) {
      return res.status(409).json({
        error: `This payment session is ${session.status}. Please start a new payment attempt.`,
      });
    }

    // Reject duplicate UTR already linked to a different payment session
    const duplicate = ledger.findByUtr(rawUtr);
    if (duplicate && duplicate.paymentId !== session.paymentId) {
      return res.status(409).json({
        error: 'This 12-digit UTR number has already been submitted for another order.',
      });
    }

    // Allow UTR submission even right after timer expiry if customer just returned from UPI app
    const canTransition =
      isValidTransition(session.status, PaymentStatus.MANUAL_REVIEW) ||
      session.status === PaymentStatus.MANUAL_REVIEW ||
      session.status === PaymentStatus.EXPIRED;

    if (!canTransition) {
      return res.status(409).json({
        error: `Cannot submit UTR while session is in ${session.status} state.`,
      });
    }

    session.status = PaymentStatus.MANUAL_REVIEW;
    session.settlementState = settlementStateFor(PaymentStatus.MANUAL_REVIEW);
    session.method = PaymentMethod.MANUAL_UPI;
    session.utr = rawUtr;
    if (payerApp) session.payerApp = payerApp;
    session.updatedAt = new Date().toISOString();
    session.auditLog.push({
      at: session.updatedAt,
      actor: 'CUSTOMER',
      action: 'UTR_SUBMITTED',
      details: `12-digit UTR ending ${rawUtr.slice(-4)} submitted via ${payerApp || 'UPI'}`,
    });

    ledger.saveSession(session);
    return res.status(200).json(toPublicSessionView(session));
  });

  // 5. Customer selects Cash on Delivery for this order
  router.post('/checkout/:paymentId/cod', (req: Request, res: Response) => {
    const paymentId = sanitizeText(req.params.paymentId, 128);
    const session = ledger.getSession(paymentId);
    if (!session) {
      return res.status(404).json({ error: 'Payment session not found.' });
    }

    const token = extractSessionToken(req);
    if (!verifyTokenHash(token, session.sessionTokenHash)) {
      return res.status(403).json({ error: 'Invalid session capability token.' });
    }

    if (session.status === PaymentStatus.RECONCILED) {
      return res.status(409).json({ error: 'Payment is already reconciled via UPI.' });
    }

    if (
      !isValidTransition(session.status, PaymentStatus.SUCCESS) &&
      session.status !== PaymentStatus.EXPIRED
    ) {
      return res.status(409).json({ error: `Cannot switch to COD from state ${session.status}.` });
    }

    // Optional COD amount override if COD total differs from prepaid discounted total
    if (req.body?.codAmount !== undefined) {
      try {
        const codPaise = toPaise(req.body.codAmount);
        session.amountPaise = codPaise.toString();
        session.amount = toRupeesString(codPaise);
      } catch {
        return res.status(400).json({ error: 'Invalid COD amount.' });
      }
    }

    session.method = PaymentMethod.COD;
    session.status = PaymentStatus.SUCCESS;
    session.settlementState = 'NOT_BANK_SETTLEMENT';
    session.updatedAt = new Date().toISOString();
    session.completedAt = session.updatedAt;
    session.auditLog.push({
      at: session.updatedAt,
      actor: 'CUSTOMER',
      action: 'COD_CONFIRMED',
      details: `Cash on Delivery confirmed for ₹${session.amount}`,
    });

    ledger.saveSession(session);
    return res.status(200).json(toPublicSessionView(session));
  });

  // 6. Cancel an active payment session
  router.post('/checkout/:paymentId/cancel', (req: Request, res: Response) => {
    const paymentId = sanitizeText(req.params.paymentId, 128);
    const session = ledger.getSession(paymentId);
    if (!session) {
      return res.status(404).json({ error: 'Payment session not found.' });
    }

    const token = extractSessionToken(req);
    if (!verifyTokenHash(token, session.sessionTokenHash)) {
      return res.status(403).json({ error: 'Invalid session capability token.' });
    }

    if (isValidTransition(session.status, PaymentStatus.CANCELLED)) {
      session.status = PaymentStatus.CANCELLED;
      session.settlementState = 'NOT_APPLICABLE';
      session.updatedAt = new Date().toISOString();
      session.auditLog.push({
        at: session.updatedAt,
        actor: 'CUSTOMER',
        action: 'SESSION_CANCELLED',
      });
      ledger.saveSession(session);
    }

    return res.json({ success: true, status: session.status });
  });

  // =========================================================================
  // ADMIN AUTH & RECONCILIATION ENDPOINTS (Server-Verified Passcode + Bearer)
  // =========================================================================

  router.get('/admin/auth/status', (_req: Request, res: Response) => {
    const envConfigured = Boolean((process.env.YOUPI_ADMIN_PASSCODE || '').trim());
    const claimed = Boolean(ledger.getAdminCredential());
    res.json({
      envConfigured,
      claimed,
      needsBootstrap: !envConfigured && !claimed,
    });
  });

  router.post('/admin/auth/bootstrap', (req: Request, res: Response) => {
    const envPasscode = (process.env.YOUPI_ADMIN_PASSCODE || '').trim();
    if (envPasscode) {
      return res.status(403).json({
        error: 'Admin passcode is already managed via server environment configuration.',
      });
    }
    if (ledger.getAdminCredential()) {
      return res.status(409).json({ error: 'Admin passcode has already been claimed.' });
    }

    const passcode = typeof req.body?.passcode === 'string' ? req.body.passcode.trim() : '';
    if (passcode.length < 8) {
      return res.status(400).json({ error: 'Passcode must be at least 8 characters.' });
    }

    const ok = ledger.claimAdminCredentialOnce(passcode);
    if (!ok) {
      return res.status(409).json({ error: 'Admin passcode has already been claimed.' });
    }

    const { token, expiresAt } = issueAdminBearerToken();
    return res.status(201).json({ success: true, token, expiresAt });
  });

  router.post('/admin/auth/login', (req: Request, res: Response) => {
    const passcode = typeof req.body?.passcode === 'string' ? req.body.passcode.trim() : '';
    if (!passcode) {
      return res.status(400).json({ error: 'Passcode is required.' });
    }

    const envPasscode = (process.env.YOUPI_ADMIN_PASSCODE || '').trim();
    if (envPasscode) {
      if (!safeCompareStrings(passcode, envPasscode)) {
        return res.status(401).json({ error: 'Invalid admin passcode.' });
      }
      const { token, expiresAt } = issueAdminBearerToken();
      return res.json({ success: true, token, expiresAt });
    }

    const stored = ledger.getAdminCredential();
    if (!stored) {
      return res.status(412).json({
        error: 'Admin passcode not initialized yet. Please complete first-run setup.',
      });
    }

    if (!verifyPasscodeScrypt(passcode, stored.passcodeHash)) {
      return res.status(401).json({ error: 'Invalid admin passcode.' });
    }

    const { token, expiresAt } = issueAdminBearerToken();
    return res.json({ success: true, token, expiresAt });
  });

  // List all payment sessions (Admin only)
  router.get('/admin/payments', requireAdminAuth, (_req: Request, res: Response) => {
    const sessions = ledger.listSessions().map(toAdminSessionView);
    const ext = getExternalGatewayConfig();
    const payee = getPayeeConfig();
    res.json({
      mode: ext.enabled ? 'external' : 'embedded',
      payeeVpa: payee.payeeVpa,
      payeeName: payee.payeeName,
      sessions,
    });
  });

  // Update receiving merchant UPI ID & Payee Name in-app (no environment variables required)
  router.patch('/admin/settings', requireAdminAuth, (req: Request, res: Response) => {
    const rawVpa = sanitizeText(req.body?.payeeVpa, 100);
    const rawName = sanitizeText(req.body?.payeeName, 60);

    if (!rawVpa || !isValidVpa(rawVpa)) {
      return res.status(400).json({
        error: 'Please enter a valid UPI ID (for example: yourname@ybl or store@okhdfcbank).',
      });
    }
    if (rawName.length < 2) {
      return res.status(400).json({
        error: 'Merchant display name must be at least 2 characters.',
      });
    }

    const updated = ledger.updateMerchantConfig(rawVpa, rawName);
    return res.json({
      success: true,
      payeeVpa: updated.payeeVpa,
      payeeName: updated.payeeName,
      updatedAt: updated.updatedAt,
    });
  });

  // Admin bank verification: verify (RECONCILED) or reject (FAILED) a payment
  router.post('/admin/payments/:paymentId/review', requireAdminAuth, (req: Request, res: Response) => {
    const paymentId = sanitizeText(req.params.paymentId, 128);
    const session = ledger.getSession(paymentId);
    if (!session) {
      return res.status(404).json({ error: 'Payment session not found.' });
    }

    const decision = sanitizeText(req.body?.decision, 32).toLowerCase();
    const reason = sanitizeText(req.body?.reason, 240);
    const verifiedUtr = sanitizeText(req.body?.utr, 32).replace(/\s+/g, '');

    if (decision !== 'verify' && decision !== 'reject') {
      return res.status(400).json({ error: 'Decision must be "verify" or "reject".' });
    }

    if (session.status === PaymentStatus.RECONCILED) {
      return res.status(409).json({ error: 'Payment is already reconciled.' });
    }

    if (decision === 'reject') {
      if (!reason) {
        return res.status(400).json({ error: 'A rejection reason is required.' });
      }
      session.status = PaymentStatus.FAILED;
      session.settlementState = 'NOT_APPLICABLE';
      session.rejectionReason = reason;
      session.updatedAt = new Date().toISOString();
      session.auditLog.push({
        at: session.updatedAt,
        actor: 'ADMIN',
        action: 'PAYMENT_REJECTED',
        details: reason,
      });
      ledger.saveSession(session);
      return res.json(toAdminSessionView(session));
    }

    // Verify -> RECONCILED
    if (verifiedUtr && /^\d{12}$/.test(verifiedUtr)) {
      session.utr = verifiedUtr;
    }
    session.status = PaymentStatus.RECONCILED;
    session.settlementState = 'RECONCILED';
    session.rejectionReason = null;
    session.updatedAt = new Date().toISOString();
    session.completedAt = session.updatedAt;
    session.auditLog.push({
      at: session.updatedAt,
      actor: 'ADMIN',
      action: 'BANK_RECONCILED',
      details: reason || (session.utr ? `Verified bank credit for UTR ${session.utr}` : 'Verified by store admin'),
    });
    ledger.saveSession(session);
    return res.json(toAdminSessionView(session));
  });

  // Admin bank statement CSV import using YouPI-PG's cloned StatementParser
  router.post('/admin/statements/import', requireAdminAuth, (req: Request, res: Response) => {
    const csvText = typeof req.body?.csv === 'string' ? req.body.csv : '';
    if (!csvText.trim()) {
      return res.status(400).json({ error: 'Bank statement CSV text is required.' });
    }
    if (csvText.length > 1024 * 1024) {
      return res.status(413).json({ error: 'CSV payload exceeds 1 MB limit.' });
    }

    const parsed = parseStatementCsv(csvText);
    if (parsed.error) {
      return res.status(400).json({
        error: parsed.error,
        message: 'Could not detect Date, Narration/Description, and Credit/Deposit columns in CSV.',
      });
    }

    const allSessions = ledger.listSessions();
    const reconcilable = allSessions.filter(
      (s) =>
        s.method !== PaymentMethod.COD &&
        (s.status === PaymentStatus.MANUAL_REVIEW ||
          s.status === PaymentStatus.OBSERVED_SUCCESS ||
          s.status === PaymentStatus.ACTIVE)
    );

    let reconciledCount = 0;
    let unmatchedCount = 0;
    const matchedOrders: Array<{ orderId: string; paymentId: string; utr: string; amount: string }> = [];

    for (const line of parsed.lines) {
      if (line.direction !== 'CREDIT' || !line.utr) {
        continue;
      }

      const match = reconcilable.find(
        (s) =>
          s.status !== PaymentStatus.RECONCILED &&
          s.utr === line.utr &&
          BigInt(s.amountPaise) === BigInt(line.amountPaise)
      );

      if (match) {
        match.status = PaymentStatus.RECONCILED;
        match.settlementState = 'RECONCILED';
        match.updatedAt = new Date().toISOString();
        match.completedAt = match.updatedAt;
        match.auditLog.push({
          at: match.updatedAt,
          actor: 'ADMIN',
          action: 'STATEMENT_CSV_RECONCILED',
          details: `Matched bank CSV credit on ${line.bookedOn} for UTR ${line.utr}`,
        });
        ledger.saveSession(match);
        reconciledCount += 1;
        matchedOrders.push({
          orderId: match.orderId,
          paymentId: match.paymentId,
          utr: line.utr,
          amount: match.amount,
        });
      } else {
        unmatchedCount += 1;
      }
    }

    return res.json({
      totalLinesParsed: parsed.lines.length,
      reconciledCount,
      unmatchedCreditLines: unmatchedCount,
      matchedOrders,
    });
  });

  return router;
}
