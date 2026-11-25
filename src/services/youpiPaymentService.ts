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

export async function getYoupiGatewayHealth(): Promise<YoupiGatewayHealth | null> {
  try {
    const res = await fetch('/api/youpi/v1/health');
    if (!res.ok) return null;
    return (await res.json()) as YoupiGatewayHealth;
  } catch {
    return null;
  }
}

export async function createYoupiPaymentSession(
  params: CreateYoupiPaymentParams
): Promise<YoupiPaymentSessionResponse> {
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

  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, 'Unable to initialize YouPI-PG payment session.'));
  }

  return (await res.json()) as YoupiPaymentSessionResponse;
}

export async function getYoupiPaymentStatus(
  paymentId: string,
  sessionToken: string
): Promise<YoupiPaymentSessionResponse> {
  const res = await fetch(`/api/youpi/v1/payments/${encodeURIComponent(paymentId)}`, {
    headers: {
      'X-Session-Token': sessionToken,
    },
  });

  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, 'Failed to check payment status.'));
  }

  return (await res.json()) as YoupiPaymentSessionResponse;
}

export async function submitYoupiUtr(
  paymentId: string,
  sessionToken: string,
  utr: string,
  payerApp?: string
): Promise<YoupiPaymentSessionResponse> {
  const res = await fetch(`/api/youpi/v1/checkout/${encodeURIComponent(paymentId)}/utr`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Session-Token': sessionToken,
    },
    body: JSON.stringify({ utr, payerApp }),
  });

  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, 'Failed to submit 12-digit UTR number.'));
  }

  return (await res.json()) as YoupiPaymentSessionResponse;
}

export async function confirmYoupiCod(
  paymentId: string,
  sessionToken: string,
  codAmount?: number
): Promise<YoupiPaymentSessionResponse> {
  const res = await fetch(`/api/youpi/v1/checkout/${encodeURIComponent(paymentId)}/cod`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Session-Token': sessionToken,
    },
    body: JSON.stringify({ codAmount }),
  });

  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, 'Failed to confirm Cash on Delivery.'));
  }

  return (await res.json()) as YoupiPaymentSessionResponse;
}

export async function cancelYoupiPayment(
  paymentId: string,
  sessionToken: string
): Promise<{ success: boolean; status: string }> {
  const res = await fetch(`/api/youpi/v1/checkout/${encodeURIComponent(paymentId)}/cancel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Session-Token': sessionToken,
    },
  });

  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, 'Failed to cancel payment session.'));
  }

  return (await res.json()) as { success: boolean; status: string };
}

// =========================================================================
// ADMIN API HELPERS (Bearer token stored strictly in React memory only)
// =========================================================================

export async function getYoupiAdminAuthStatus(): Promise<{
  envConfigured: boolean;
  claimed: boolean;
  needsBootstrap: boolean;
}> {
  const res = await fetch('/api/youpi/v1/admin/auth/status');
  if (!res.ok) {
    throw new Error('Could not check admin authentication status.');
  }
  return res.json();
}

export async function bootstrapYoupiAdminPasscode(
  passcode: string
): Promise<{ success: boolean; token: string; expiresAt: string }> {
  const res = await fetch('/api/youpi/v1/admin/auth/bootstrap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passcode }),
  });
  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, 'Could not initialize admin passcode.'));
  }
  return res.json();
}

export async function loginYoupiAdmin(
  passcode: string
): Promise<{ success: boolean; token: string; expiresAt: string }> {
  const res = await fetch('/api/youpi/v1/admin/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passcode }),
  });
  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, 'Invalid admin passcode.'));
  }
  return res.json();
}

export async function fetchYoupiAdminPayments(token: string): Promise<{
  mode: 'embedded' | 'external';
  payeeVpa: string;
  payeeName: string;
  sessions: YoupiAdminPaymentSession[];
}> {
  const res = await fetch('/api/youpi/v1/admin/payments', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, 'Unable to fetch YouPI-PG payments.'));
  }
  return res.json();
}

export async function reviewYoupiAdminPayment(
  token: string,
  paymentId: string,
  decision: 'verify' | 'reject',
  reason?: string,
  utr?: string
): Promise<YoupiAdminPaymentSession> {
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
  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, 'Unable to record review decision.'));
  }
  return res.json();
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
  const res = await fetch('/api/youpi/v1/admin/statements/import', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ csv }),
  });
  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, 'Bank statement CSV import failed.'));
  }
  return res.json();
}

export async function updateYoupiAdminSettings(
  token: string,
  payeeVpa: string,
  payeeName: string
): Promise<{ success: boolean; payeeVpa: string; payeeName: string; updatedAt: string }> {
  const res = await fetch('/api/youpi/v1/admin/settings', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ payeeVpa, payeeName }),
  });
  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, 'Could not update UPI merchant settings.'));
  }
  return res.json();
}

