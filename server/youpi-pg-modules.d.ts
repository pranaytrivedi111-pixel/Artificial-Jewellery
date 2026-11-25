declare module '../youpi-pg/packages/common/src/money.js' {
  export function toPaise(rupees: string | number): bigint;
  export function toRupeesString(paise: bigint | number): string;
  export function formatINR(paise: bigint | number): string;
}

declare module '../youpi-pg/packages/common/src/upi.js' {
  export function isValidVpa(vpa: string): boolean;
  export function buildUpiUri(options: {
    payeeVpa: string;
    payeeName: string;
    amountPaise: bigint;
    transactionRef: string;
    transactionNote?: string;
    currency?: string;
  }): string;
  export function buildUpiIntentUri(options: {
    payeeVpa: string;
    payeeName: string;
    amountPaise: bigint;
    transactionRef?: string;
    transactionNote?: string;
    currency?: string;
    packageName: string;
  }): string;
}

declare module '../youpi-pg/packages/common/src/crypto.js' {
  export function generateHmac(data: string, secret: string): string;
  export function verifyHmac(data: string, secret: string, expectedSignature: string): boolean;
  export function generateRandomToken(bytes?: number): string;
}

declare module '../youpi-pg/packages/common/src/enums.js' {
  export const PaymentStatus: Readonly<{
    INITIATED: 'INITIATED';
    QUEUED: 'QUEUED';
    ACTIVE: 'ACTIVE';
    PROCESSING: 'PROCESSING';
    OBSERVED_SUCCESS: 'OBSERVED_SUCCESS';
    RECONCILED: 'RECONCILED';
    MANUAL_REVIEW: 'MANUAL_REVIEW';
    SUCCESS: 'SUCCESS';
    FAILED: 'FAILED';
    EXPIRED: 'EXPIRED';
    CANCELLED: 'CANCELLED';
  }>;

  export const PaymentMethod: Readonly<{
    UPI: 'UPI';
    MANUAL_UPI: 'MANUAL_UPI';
    COD: 'COD';
    CASH_COUNTER: 'CASH_COUNTER';
    CARD_COUNTER: 'CARD_COUNTER';
  }>;
}

declare module '../youpi-pg/packages/common/src/state-transitions.js' {
  export const VALID_TRANSITIONS: Readonly<Record<string, readonly string[]>>;
  export const TERMINAL_STATES: readonly string[];
  export const IMMUTABLE_STATES: readonly string[];
  export function isValidTransition(currentState: string, nextState: string): boolean;
  export function isTerminalStatus(status: string): boolean;
}

declare module '../youpi-pg/packages/common/src/upi-providers.js' {
  export interface YoupiUpiProvider {
    id: string;
    name: string;
    shortName?: string;
    packageName: string;
    brandColor?: string;
    enabled?: boolean;
  }
  export const UPI_PROVIDERS: YoupiUpiProvider[];
}

declare module '../youpi-pg/packages/core/src/statement-parser.js' {
  export interface ParsedStatementLine {
    bookedOn: string | null;
    amountPaise: number;
    direction: 'CREDIT' | 'DEBIT';
    utr: string | null;
    referenceCount: number;
    narration: string;
    ref: string;
  }
  export function parseStatementCsv(csvText: string): {
    error?: string;
    lines: ParsedStatementLine[];
  };
}
