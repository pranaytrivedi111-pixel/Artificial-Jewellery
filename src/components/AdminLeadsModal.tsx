import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  FileSpreadsheet,
  Download,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Phone,
  MapPin,
  Clock,
  Lock,
  Upload,
  LogOut,
  XCircle,
  Settings,
  Loader2,
} from 'lucide-react';
import {
  getAllOrders,
  getGoogleSheetsWebhookUrl,
  setGoogleSheetsWebhookUrl,
  exportOrdersToCSV,
  GOOGLE_APPS_SCRIPT_CODE,
  CustomerLead,
} from '../services/leadService';
import {
  getYoupiAdminAuthStatus,
  bootstrapYoupiAdminPasscode,
  loginYoupiAdmin,
  fetchYoupiAdminPayments,
  reviewYoupiAdminPayment,
  importYoupiBankStatementCsv,
  updateYoupiAdminSettings,
  YoupiAdminPaymentSession,
} from '../services/youpiPaymentService';

interface AdminLeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLeadsModal: React.FC<AdminLeadsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [orders, setOrders] = useState<CustomerLead[]>([]);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');
  const [filterType, setFilterType] = useState<'all' | 'upi' | 'cod'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [activeTab, setActiveTab] = useState<'youpi' | 'leads' | 'sheets'>('youpi');

  // YouPI-PG Admin Auth State (Bearer token held strictly in React state memory, never localStorage)
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<{
    envConfigured: boolean;
    claimed: boolean;
    needsBootstrap: boolean;
  } | null>(null);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [confirmPasscodeInput, setConfirmPasscodeInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // YouPI-PG Gateway Data & Actions
  const [youpiMode, setYoupiMode] = useState<'embedded' | 'external'>('embedded');
  const [payeeVpa, setPayeeVpa] = useState('');
  const [payeeName, setPayeeName] = useState('');
  const [editVpa, setEditVpa] = useState('');
  const [editPayeeName, setEditPayeeName] = useState('');
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const [youpiSessions, setYoupiSessions] = useState<YoupiAdminPaymentSession[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [youpiError, setYoupiError] = useState('');
  const [youpiStatusFilter, setYoupiStatusFilter] = useState<'all' | 'review' | 'reconciled' | 'cod'>('all');
  const [reviewingPaymentId, setReviewingPaymentId] = useState<string | null>(null);
  const [rejectingPaymentId, setRejectingPaymentId] = useState<string | null>(null);
  const [rejectReasonInput, setRejectReasonInput] = useState('');

  // Bank Statement CSV Reconciliation
  const [showCsvPanel, setShowCsvPanel] = useState(false);
  const [csvText, setCsvText] = useState('');
  const [isImportingCsv, setIsImportingCsv] = useState(false);
  const [csvResult, setCsvResult] = useState<{
    totalLinesParsed: number;
    reconciledCount: number;
    unmatchedCreditLines: number;
    matchedOrders: Array<{ orderId: string; paymentId: string; utr: string; amount: string }>;
  } | null>(null);
  const [csvError, setCsvError] = useState('');

  const loadYoupiSessions = useCallback(async (token: string) => {
    setIsLoadingSessions(true);
    setYoupiError('');
    try {
      const data = await fetchYoupiAdminPayments(token);
      setYoupiMode(data.mode);
      setPayeeVpa(data.payeeVpa);
      setPayeeName(data.payeeName);
      setEditVpa(data.payeeVpa);
      setEditPayeeName(data.payeeName);
      setYoupiSessions(data.sessions);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to load YouPI-PG payments.';
      setYoupiError(msg);
      if (msg.toLowerCase().includes('unauthorized') || msg.toLowerCase().includes('expired')) {
        setAdminToken(null);
      }
    } finally {
      setIsLoadingSessions(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setOrders(getAllOrders());
      setWebhookUrl(getGoogleSheetsWebhookUrl());
      getYoupiAdminAuthStatus()
        .then((status) => setAuthStatus(status))
        .catch(() => setAuthStatus({ envConfigured: false, claimed: false, needsBootstrap: true }));
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && adminToken && activeTab === 'youpi') {
      loadYoupiSessions(adminToken);
    }
  }, [isOpen, adminToken, activeTab, loadYoupiSessions]);

  if (!isOpen) return null;

  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    setGoogleSheetsWebhookUrl(webhookUrl);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2500);
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleAdminAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const trimmed = passcodeInput.trim();
    if (!trimmed) {
      setAuthError('Please enter your merchant passcode.');
      return;
    }

    if (authStatus?.needsBootstrap) {
      if (trimmed.length < 8) {
        setAuthError('Passcode must be at least 8 characters.');
        return;
      }
      if (trimmed !== confirmPasscodeInput.trim()) {
        setAuthError('Passcodes do not match.');
        return;
      }
    }

    setIsAuthLoading(true);
    try {
      const res = authStatus?.needsBootstrap
        ? await bootstrapYoupiAdminPasscode(trimmed)
        : await loginYoupiAdmin(trimmed);

      setAdminToken(res.token);
      setPasscodeInput('');
      setConfirmPasscodeInput('');
      setAuthStatus({ envConfigured: false, claimed: true, needsBootstrap: false });
      await loadYoupiSessions(res.token);
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'Authentication failed.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSavePayeeSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) return;
    setSettingsMessage(null);
    setIsSavingSettings(true);
    try {
      const res = await updateYoupiAdminSettings(adminToken, editVpa.trim(), editPayeeName.trim());
      setPayeeVpa(res.payeeVpa);
      setPayeeName(res.payeeName);
      setSettingsMessage({
        type: 'ok',
        text: `Updated active UPI receiving handle to ${res.payeeVpa} (${res.payeeName}). New checkouts will use this immediately.`,
      });
    } catch (err: unknown) {
      setSettingsMessage({
        type: 'err',
        text: err instanceof Error ? err.message : 'Could not update UPI settings.',
      });
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleVerifyPayment = async (paymentId: string) => {
    if (!adminToken) return;
    setReviewingPaymentId(paymentId);
    setYoupiError('');
    try {
      await reviewYoupiAdminPayment(adminToken, paymentId, 'verify');
      await loadYoupiSessions(adminToken);
    } catch (err: unknown) {
      setYoupiError(err instanceof Error ? err.message : 'Could not reconcile payment.');
    } finally {
      setReviewingPaymentId(null);
    }
  };

  const handleRejectPayment = async (paymentId: string) => {
    if (!adminToken) return;
    const reason = rejectReasonInput.trim();
    if (!reason) {
      setYoupiError('Please enter a brief rejection reason (e.g. UTR not found in bank statement).');
      return;
    }
    setReviewingPaymentId(paymentId);
    setYoupiError('');
    try {
      await reviewYoupiAdminPayment(adminToken, paymentId, 'reject', reason);
      setRejectingPaymentId(null);
      setRejectReasonInput('');
      await loadYoupiSessions(adminToken);
    } catch (err: unknown) {
      setYoupiError(err instanceof Error ? err.message : 'Could not reject payment.');
    } finally {
      setReviewingPaymentId(null);
    }
  };

  const handleCsvFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCsvText(reader.result);
        setCsvError('');
        setCsvResult(null);
      }
    };
    reader.readAsText(file);
  };

  const handleImportCsv = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) return;
    if (!csvText.trim()) {
      setCsvError('Please upload a bank statement CSV file or paste CSV rows below.');
      return;
    }
    setIsImportingCsv(true);
    setCsvError('');
    setCsvResult(null);
    try {
      const result = await importYoupiBankStatementCsv(adminToken, csvText);
      setCsvResult(result);
      await loadYoupiSessions(adminToken);
    } catch (err: unknown) {
      setCsvError(err instanceof Error ? err.message : 'Failed to parse bank statement CSV.');
    } finally {
      setIsImportingCsv(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      filterType === 'all'
        ? true
        : filterType === 'upi'
        ? order.paymentType === 'Prepaid UPI'
        : order.paymentType === 'COD';

    const matchesSearch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm) ||
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.city.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const filteredYoupiSessions = youpiSessions.filter((session) => {
    if (youpiStatusFilter === 'review') {
      return session.status === 'MANUAL_REVIEW' || session.status === 'OBSERVED_SUCCESS';
    }
    if (youpiStatusFilter === 'reconciled') {
      return session.status === 'RECONCILED';
    }
    if (youpiStatusFilter === 'cod') {
      return session.method === 'COD';
    }
    return true;
  });

  const pendingReviewCount = youpiSessions.filter(
    (s) => s.status === 'MANUAL_REVIEW' || s.status === 'OBSERVED_SUCCESS'
  ).length;
  const reconciledCount = youpiSessions.filter((s) => s.status === 'RECONCILED').length;
  const gatewayCodCount = youpiSessions.filter((s) => s.method === 'COD').length;

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const upiCount = orders.filter((o) => o.paymentType === 'Prepaid UPI').length;
  const codCount = orders.filter((o) => o.paymentType === 'COD').length;

  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case 'RECONCILED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'MANUAL_REVIEW':
        return 'bg-amber-100 text-amber-900 border-amber-200';
      case 'OBSERVED_SUCCESS':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'SUCCESS':
        return 'bg-stone-100 text-stone-800 border-stone-200';
      case 'FAILED':
      case 'CANCELLED':
      case 'EXPIRED':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4 animate-fadeIn">
      <div
        className="bg-white rounded-2xl max-w-5xl w-full border border-gray-200 shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#0F172A] text-white flex items-center justify-between border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  QAVELLE Merchant Portal &amp; YouPI-PG Gateway
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ● YouPI-PG Active ({youpiMode === 'external' ? 'External Server' : 'Built-in Zero-Config'})
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                Verify customer UPI UTRs, reconcile bank statement CSVs, configure your UPI ID, and manage orders
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher & Quick Stats Bar */}
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('youpi')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'youpi'
                  ? 'bg-black text-[#FFD600] shadow-xs'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>YouPI-PG Payments</span>
              {pendingReviewCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-white font-black">
                  {pendingReviewCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('leads')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'leads'
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Captured Leads ({orders.length})
            </button>

            <button
              onClick={() => setActiveTab('sheets')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'sheets'
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              Google Sheets Setup
              {webhookUrl && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              )}
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 text-xs font-semibold text-gray-600">
            <span>
              Orders:{' '}
              <strong className="text-gray-900 font-bold">₹{totalRevenue.toLocaleString('en-IN')}</strong>
            </span>
            <button
              onClick={() => exportOrdersToCSV()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto flex-1">
          {activeTab === 'youpi' ? (
            !adminToken ? (
              <div className="max-w-md mx-auto py-6">
                <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center shrink-0">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-gray-950">
                        {authStatus?.needsBootstrap
                          ? 'Create Your Merchant Passcode (One-Time Setup)'
                          : 'Merchant Portal Sign In'}
                      </h4>
                      <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                        {authStatus?.needsBootstrap
                          ? 'No environment variables needed. Set an 8+ character passcode below to unlock YouPI-PG payment verification, bank CSV reconciliation, and UPI ID settings.'
                          : 'Enter your merchant passcode to review UPI payments and reconcile bank statements.'}
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleAdminAuthSubmit} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        {authStatus?.needsBootstrap ? 'New Merchant Passcode (min 8 chars)' : 'Merchant Passcode'}
                      </label>
                      <input
                        type="password"
                        value={passcodeInput}
                        onChange={(e) => {
                          setPasscodeInput(e.target.value);
                          if (authError) setAuthError('');
                        }}
                        placeholder="Enter passcode..."
                        autoComplete={authStatus?.needsBootstrap ? 'new-password' : 'current-password'}
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-black bg-gray-50 focus:bg-white"
                      />
                    </div>

                    {authStatus?.needsBootstrap && (
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                          Confirm Passcode
                        </label>
                        <input
                          type="password"
                          value={confirmPasscodeInput}
                          onChange={(e) => {
                            setConfirmPasscodeInput(e.target.value);
                            if (authError) setAuthError('');
                          }}
                          placeholder="Re-enter passcode..."
                          autoComplete="new-password"
                          className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-black bg-gray-50 focus:bg-white"
                        />
                      </div>
                    )}

                    {authError && (
                      <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{authError}</span>
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isAuthLoading}
                      className="w-full py-2.5 px-4 rounded-xl bg-black hover:bg-neutral-800 disabled:bg-gray-400 text-[#FFD600] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      {isAuthLoading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Unlocking...</span>
                        </>
                      ) : (
                        <span>
                          {authStatus?.needsBootstrap ? 'Save Passcode & Open Portal' : 'Unlock YouPI-PG Portal'}
                        </span>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Active Gateway Config & Actions Strip */}
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500 block">
                        Receiving UPI ID
                      </span>
                      <span className="font-mono font-bold text-gray-950">
                        {payeeVpa} <span className="font-sans font-normal text-gray-500">({payeeName})</span>
                      </span>
                    </div>
                    <span className="hidden sm:inline text-gray-300">|</span>
                    <div className="flex items-center gap-3 text-[11px]">
                      <span>
                        Pending Review: <strong className="text-amber-800">{pendingReviewCount}</strong>
                      </span>
                      <span>
                        Bank Reconciled: <strong className="text-emerald-700">{reconciledCount}</strong>
                      </span>
                      <span>
                        COD: <strong className="text-gray-800">{gatewayCodCount}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        setShowSettingsPanel((prev) => !prev);
                        setSettingsMessage(null);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-white border border-gray-300 hover:border-black text-gray-800 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      <span>UPI Settings</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowCsvPanel((prev) => !prev)}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Import Bank CSV</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => loadYoupiSessions(adminToken)}
                      disabled={isLoadingSessions}
                      className="px-2.5 py-1.5 rounded-lg bg-white border border-gray-300 hover:border-black text-gray-800 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingSessions ? 'animate-spin' : ''}`} />
                      <span>Refresh</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAdminToken(null);
                        setYoupiSessions([]);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Lock</span>
                    </button>
                  </div>
                </div>

                {/* In-App Merchant UPI Settings (Zero Env Vars Required) */}
                {showSettingsPanel && (
                  <form
                    onSubmit={handleSavePayeeSettings}
                    className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-3 animate-fadeIn"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-extrabold text-amber-950">
                          Merchant UPI Receiving Account (No Environment Variables Needed)
                        </h4>
                        <p className="text-[11px] text-amber-900/80">
                          All new UPI QR codes and 1-tap UPI app payment requests will route directly to this UPI ID.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowSettingsPanel(false)}
                        className="text-xs text-amber-900 underline font-semibold cursor-pointer"
                      >
                        Close
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                          Merchant UPI ID (VPA)
                        </label>
                        <input
                          type="text"
                          value={editVpa}
                          onChange={(e) => setEditVpa(e.target.value)}
                          placeholder="yourbusiness@ybl"
                          className="w-full px-3 py-2 text-xs font-mono border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-black"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                          Payee Display Name
                        </label>
                        <input
                          type="text"
                          value={editPayeeName}
                          onChange={(e) => setEditPayeeName(e.target.value)}
                          placeholder="Qavelle"
                          className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>

                    {settingsMessage && (
                      <p
                        className={`text-[11px] font-semibold flex items-center gap-1.5 ${
                          settingsMessage.type === 'ok' ? 'text-emerald-700' : 'text-rose-600'
                        }`}
                      >
                        {settingsMessage.type === 'ok' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        )}
                        <span>{settingsMessage.text}</span>
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isSavingSettings}
                      className="px-4 py-2 rounded-lg bg-black hover:bg-neutral-800 text-[#FFD600] font-bold text-xs cursor-pointer"
                    >
                      {isSavingSettings ? 'Saving...' : 'Save Receiving UPI ID'}
                    </button>
                  </form>
                )}

                {/* Bank Statement CSV Reconciliation Panel */}
                {showCsvPanel && (
                  <form
                    onSubmit={handleImportCsv}
                    className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-3 animate-fadeIn"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <h4 className="text-xs font-extrabold text-emerald-950">
                          YouPI-PG Bank Statement CSV Reconciliation
                        </h4>
                        <p className="text-[11px] text-emerald-900/80">
                          Upload your Indian bank statement CSV (Date, Narration/Description, Credit). Matches exact amount + 12-digit UTR automatically.
                        </p>
                      </div>
                      <label className="px-3 py-1.5 rounded-lg bg-white border border-emerald-300 hover:border-emerald-600 text-emerald-900 font-bold text-[11px] cursor-pointer flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Choose .CSV File</span>
                        <input
                          type="file"
                          accept=".csv,text/csv"
                          onChange={handleCsvFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <textarea
                      rows={4}
                      value={csvText}
                      onChange={(e) => setCsvText(e.target.value)}
                      placeholder="Date,Narration,Credit&#10;25/11/2026,UPI/428910543981/Customer,874.00"
                      className="w-full p-2.5 text-[11px] font-mono border border-emerald-300 rounded-lg bg-white focus:outline-none focus:border-emerald-700"
                    />

                    {csvError && (
                      <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{csvError}</span>
                      </p>
                    )}

                    {csvResult && (
                      <div className="p-2.5 rounded-lg bg-white border border-emerald-200 text-xs text-emerald-900 space-y-1">
                        <p className="font-bold">
                          Parsed {csvResult.totalLinesParsed} lines &bull; Reconciled {csvResult.reconciledCount} order(s) &bull; Unmatched credits: {csvResult.unmatchedCreditLines}
                        </p>
                        {csvResult.matchedOrders.length > 0 && (
                          <ul className="text-[11px] font-mono text-gray-700 space-y-0.5">
                            {csvResult.matchedOrders.map((m) => (
                              <li key={m.paymentId}>
                                ✓ {m.orderId} — ₹{m.amount} (UTR {m.utr})
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        type="submit"
                        disabled={isImportingCsv}
                        className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5"
                      >
                        {isImportingCsv && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        <span>{isImportingCsv ? 'Reconciling...' : 'Reconcile Statement CSV'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCsvPanel(false)}
                        className="px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 font-semibold text-xs cursor-pointer"
                      >
                        Close
                      </button>
                    </div>
                  </form>
                )}

                {youpiError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{youpiError}</span>
                  </div>
                )}

                {/* Status Filter Pills */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(
                    [
                      { id: 'all', label: `All Sessions (${youpiSessions.length})` },
                      { id: 'review', label: `Pending Review (${pendingReviewCount})` },
                      { id: 'reconciled', label: `Bank Reconciled (${reconciledCount})` },
                      { id: 'cod', label: `COD (${gatewayCodCount})` },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setYoupiStatusFilter(tab.id)}
                      className={`px-2.5 py-1 text-xs rounded-md font-semibold cursor-pointer ${
                        youpiStatusFilter === tab.id
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* YouPI-PG Sessions Table */}
                <div className="border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-gray-700">
                      <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="py-2.5 px-3">Order &amp; Payment ID</th>
                          <th className="py-2.5 px-3">Customer</th>
                          <th className="py-2.5 px-3">Amount</th>
                          <th className="py-2.5 px-3">Status &amp; UTR</th>
                          <th className="py-2.5 px-3">Bank Verification</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {filteredYoupiSessions.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-gray-500 text-xs">
                              {isLoadingSessions
                                ? 'Loading YouPI-PG payment sessions...'
                                : 'No payment sessions recorded yet. New checkout payments will appear here automatically.'}
                            </td>
                          </tr>
                        ) : (
                          filteredYoupiSessions.map((session) => {
                            const canReview =
                              session.method !== 'COD' &&
                              session.status !== 'RECONCILED' &&
                              session.status !== 'CANCELLED';
                            const isBusy = reviewingPaymentId === session.paymentId;

                            return (
                              <tr key={session.paymentId} className="hover:bg-gray-50/80 transition-colors">
                                <td className="py-3 px-3 align-top whitespace-nowrap">
                                  <span className="font-bold text-gray-950 font-mono text-[11px] block">
                                    {session.orderId}
                                  </span>
                                  <span className="text-[10px] font-mono text-gray-400 block">
                                    {session.paymentId.slice(0, 12)}...
                                  </span>
                                  <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                                    <Clock className="w-2.5 h-2.5" />
                                    {new Date(session.createdAt).toLocaleString('en-IN', {
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </span>
                                </td>

                                <td className="py-3 px-3 align-top">
                                  <span className="font-bold text-gray-900 block">
                                    {session.customer.name}
                                  </span>
                                  {session.customer.phone && (
                                    <span className="font-mono text-[11px] text-gray-600 block">
                                      {session.customer.phone}
                                    </span>
                                  )}
                                  <span className="text-[10px] text-gray-400 block truncate max-w-[180px]" title={session.itemsSummary}>
                                    {session.itemsSummary}
                                  </span>
                                </td>

                                <td className="py-3 px-3 align-top whitespace-nowrap">
                                  <span className="font-black text-gray-950 font-mono text-xs block">
                                    ₹{session.amount}
                                  </span>
                                  <span className="text-[10px] text-gray-500 font-semibold">
                                    {session.method}
                                  </span>
                                </td>

                                <td className="py-3 px-3 align-top whitespace-nowrap">
                                  <span
                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeClasses(
                                      session.status
                                    )}`}
                                  >
                                    {session.status}
                                  </span>
                                  {session.utr && (
                                    <span className="font-mono text-[11px] font-bold text-gray-900 block mt-1">
                                      UTR: {session.utr}
                                    </span>
                                  )}
                                  {session.rejectionReason && (
                                    <span className="text-[10px] text-rose-600 block mt-0.5 max-w-[180px] whitespace-normal">
                                      Reason: {session.rejectionReason}
                                    </span>
                                  )}
                                </td>

                                <td className="py-3 px-3 align-top whitespace-nowrap">
                                  {session.status === 'RECONCILED' ? (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      Bank Verified
                                    </span>
                                  ) : session.method === 'COD' ? (
                                    <span className="text-[11px] text-gray-500 font-medium">
                                      Collect at Doorstep
                                    </span>
                                  ) : canReview ? (
                                    <div className="flex flex-col gap-1.5">
                                      <div className="flex items-center gap-1.5">
                                        <button
                                          type="button"
                                          disabled={isBusy}
                                          onClick={() => handleVerifyPayment(session.paymentId)}
                                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white text-[11px] font-bold cursor-pointer flex items-center gap-1"
                                        >
                                          <CheckCircle2 className="w-3 h-3" />
                                          <span>Verify</span>
                                        </button>
                                        <button
                                          type="button"
                                          disabled={isBusy}
                                          onClick={() => {
                                            setRejectingPaymentId(
                                              rejectingPaymentId === session.paymentId ? null : session.paymentId
                                            );
                                            setRejectReasonInput('');
                                          }}
                                          className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-[11px] font-bold cursor-pointer flex items-center gap-1"
                                        >
                                          <XCircle className="w-3 h-3" />
                                          <span>Reject</span>
                                        </button>
                                      </div>

                                      {rejectingPaymentId === session.paymentId && (
                                        <div className="flex items-center gap-1 mt-1">
                                          <input
                                            type="text"
                                            value={rejectReasonInput}
                                            onChange={(e) => setRejectReasonInput(e.target.value)}
                                            placeholder="Reason (e.g. UTR not received)"
                                            className="px-2 py-1 text-[11px] border border-rose-300 rounded-md w-44 focus:outline-none focus:border-rose-600"
                                          />
                                          <button
                                            type="button"
                                            disabled={isBusy}
                                            onClick={() => handleRejectPayment(session.paymentId)}
                                            className="px-2 py-1 rounded-md bg-rose-600 text-white text-[10px] font-bold cursor-pointer"
                                          >
                                            Confirm
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-[11px] text-gray-400">—</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )
          ) : activeTab === 'sheets' ? (
            <div className="space-y-4 max-w-2xl mx-auto py-2">
              {/* Google Sheets Configuration Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-black">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">
                      Google Sheets Webhook URL
                    </h4>
                    <p className="text-xs text-gray-500">
                      Every checkout lead and payment type will be sent to this endpoint instantly.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSaveWebhook} className="space-y-3 mt-3">
                  <div>
                    <input
                      type="url"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      placeholder="https://script.google.com/macros/s/.../exec"
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent font-mono bg-gray-50"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-gray-500">
                      {webhookUrl ? (
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Webhook configured
                        </span>
                      ) : (
                        'No webhook configured yet (leads are stored locally in the meantime)'
                      )}
                    </span>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-bold rounded-lg transition-all cursor-pointer"
                    >
                      {saveStatus === 'saved' ? 'Saved Successfully!' : 'Save Webhook URL'}
                    </button>
                  </div>
                </form>
              </div>

              {/* 60-Second Setup Guide */}
              <div className="bg-amber-50/70 rounded-xl border border-amber-200/80 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-700" />
                    <h5 className="font-bold text-xs text-amber-950 uppercase tracking-wide">
                      How to set up your Google Sheet in 60 Seconds
                    </h5>
                  </div>
                  <button
                    onClick={() => setShowSetupGuide(!showSetupGuide)}
                    className="text-xs font-bold text-amber-800 underline cursor-pointer"
                  >
                    {showSetupGuide ? 'Hide Instructions' : 'Show Step-by-Step Guide'}
                  </button>
                </div>

                {showSetupGuide && (
                  <div className="mt-3 text-xs text-gray-700 space-y-2.5 pt-2 border-t border-amber-200/60">
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center shrink-0 text-[11px]">
                        1
                      </span>
                      <span>
                        Open <a href="https://sheets.new" target="_blank" rel="noreferrer" className="font-bold text-amber-900 underline inline-flex items-center gap-0.5">sheets.new <ExternalLink className="w-3 h-3" /></a> to create a new spreadsheet named <strong>&quot;Qavelle Leads &amp; Orders&quot;</strong>.
                      </span>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center shrink-0 text-[11px]">
                        2
                      </span>
                      <span>
                        In the top menu, click <strong>Extensions</strong> → <strong>Apps Script</strong>.
                      </span>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center shrink-0 text-[11px]">
                        3
                      </span>
                      <div className="flex-1">
                        <span>Delete existing code in the editor and paste this code:</span>
                        <div className="mt-1 relative bg-gray-900 text-gray-100 p-2.5 rounded-lg font-mono text-[10px] overflow-x-auto">
                          <pre>{GOOGLE_APPS_SCRIPT_CODE}</pre>
                          <button
                            onClick={handleCopyScript}
                            className="absolute top-2 right-2 px-2 py-1 bg-white/20 hover:bg-white/30 text-white rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                          >
                            {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            {isCopied ? 'Copied' : 'Copy Script'}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center shrink-0 text-[11px]">
                        4
                      </span>
                      <span>
                        Click <strong>Deploy</strong> → <strong>New Deployment</strong>. Select <strong>Web app</strong>. Set <em>&quot;Who has access&quot;</em> to <strong>Anyone</strong>, then click <strong>Deploy</strong>.
                      </span>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center shrink-0 text-[11px]">
                        5
                      </span>
                      <span>
                        Copy the <strong>Web App URL</strong> provided by Google and paste it into the box above.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Search & Filter Controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by customer name, phone, city, or Order ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-black focus:border-black"
                  />
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-2.5 py-1 text-xs rounded-md font-semibold cursor-pointer ${
                      filterType === 'all'
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    All ({orders.length})
                  </button>
                  <button
                    onClick={() => setFilterType('upi')}
                    className={`px-2.5 py-1 text-xs rounded-md font-semibold cursor-pointer ${
                      filterType === 'upi'
                        ? 'bg-emerald-700 text-white'
                        : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    }`}
                  >
                    Prepaid UPI ({upiCount})
                  </button>
                  <button
                    onClick={() => setFilterType('cod')}
                    className={`px-2.5 py-1 text-xs rounded-md font-semibold cursor-pointer ${
                      filterType === 'cod'
                        ? 'bg-amber-800 text-white'
                        : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
                    }`}
                  >
                    COD ({codCount})
                  </button>
                </div>
              </div>

              {/* Leads Table */}
              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-700">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3">Order &amp; Date</th>
                        <th className="py-2.5 px-3">Customer &amp; Contact</th>
                        <th className="py-2.5 px-3">Payment &amp; Status</th>
                        <th className="py-2.5 px-3">Amount</th>
                        <th className="py-2.5 px-3">Items</th>
                        <th className="py-2.5 px-3">Delivery Destination</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-gray-500 text-xs">
                            No matching leads found.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((order) => (
                          <tr key={order.orderId} className="hover:bg-gray-50/80 transition-colors">
                            <td className="py-3 px-3 align-top whitespace-nowrap">
                              <span className="font-bold text-gray-950 font-mono text-[11px] block">
                                {order.orderId}
                              </span>
                              <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                                <Clock className="w-2.5 h-2.5" />
                                {new Date(order.timestamp).toLocaleDateString('en-IN', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </td>

                            <td className="py-3 px-3 align-top">
                              <span className="font-bold text-gray-900 block">
                                {order.customerName}
                              </span>
                              <a
                                href={`tel:${order.phone}`}
                                className="text-emerald-700 hover:underline font-mono text-[11px] flex items-center gap-1 mt-0.5"
                              >
                                <Phone className="w-2.5 h-2.5" />
                                {order.phone}
                              </a>
                            </td>

                            <td className="py-3 px-3 align-top whitespace-nowrap">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  order.paymentType === 'Prepaid UPI'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-900'
                                }`}
                              >
                                {order.paymentType}
                              </span>
                              <span className="text-[10px] text-gray-500 block mt-0.5">
                                {order.paymentStatus}
                              </span>
                              {order.utr && (
                                <span className="text-[10px] font-mono text-gray-700 block mt-0.5">
                                  UTR: {order.utr}
                                </span>
                              )}
                            </td>

                            <td className="py-3 px-3 align-top whitespace-nowrap">
                              <span className="font-black text-gray-950 font-mono">
                                ₹{order.totalAmount}
                              </span>
                            </td>

                            <td className="py-3 px-3 align-top text-[11px] text-gray-600 max-w-[200px] truncate" title={order.items}>
                              {order.items}
                            </td>

                            <td className="py-3 px-3 align-top text-[11px] text-gray-600 max-w-[220px]">
                              <div className="flex items-start gap-1">
                                <MapPin className="w-3 h-3 text-gray-400 shrink-0 mt-0.5" />
                                <div>
                                  <p className="truncate">{order.address}</p>
                                  <p className="text-gray-400 text-[10px]">
                                    {order.city}, {order.state} - {order.pincode}
                                  </p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex items-center justify-between shrink-0">
          <span className="text-[11px]">
            YouPI-PG payment sessions &amp; reconciliations are persisted server-side with zero external config required.
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-xs font-bold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
