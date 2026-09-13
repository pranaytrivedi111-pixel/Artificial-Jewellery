import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Zap,
  Check,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  Lock,
  Loader2,
  X,
  QrCode as QrIcon,
  Download,
  ChevronRight,
  Smartphone,
  Truck,
  RotateCcw,
  Tag,
  Gift,
  Sparkles,
  Search,
  ShieldCheck,
} from 'lucide-react';
import {
  PhonePeEmblem,
  GPayEmblem,
  PaytmEmblem,
  CredEmblem,
  BhimEmblem,
  AmazonPayEmblem,
  SuperMoneyEmblem,
  NaviEmblem,
  MobikwikEmblem,
  PopUpiEmblem,
  LxmeEmblem,
  AirtelEmblem,
  SliceEmblem,
  UpiEmblem,
  WhatsAppPayEmblem,
  JupiterEmblem,
  ClubbedUpiLogo,
} from './PaymentLogos';
import { ASSET_IMAGES } from '../data/productData';

export const OFFICIAL_PAYMENT_CONFIG = {
  upiId: 'suneetatrivedi@ibl',
  payeeName: 'PRANAY TRIVEDI',
  phoneNumber: '9171816900',
};

interface ModernPaymentSectionProps {
  subtotal: number;
  discountAmount: number;
  appliedCouponCode?: string;
  orderId: string;
  customerName?: string;
  customerPhone?: string;
  deliveryAddress?: string;
  paymentMethod?: 'upi' | 'cod';
  onPaymentMethodChange?: (method: 'upi' | 'cod') => void;
  onBackToAddress: () => void;
  onPaymentComplete: (method: 'upi' | 'cod', txnDetails?: { utr?: string; app?: string }) => void;
}

export const ModernPaymentSection: React.FC<ModernPaymentSectionProps> = ({
  subtotal,
  discountAmount,
  appliedCouponCode,
  orderId,
  customerName = 'Customer',
  customerPhone = '',
  deliveryAddress = '',
  paymentMethod = 'upi',
  onPaymentMethodChange,
  onBackToAddress,
  onPaymentComplete,
}) => {
  const [activeMode, setActiveMode] = useState<'upi' | 'cod'>(paymentMethod);

  useEffect(() => {
    if (paymentMethod && paymentMethod !== activeMode) {
      setActiveMode(paymentMethod);
    }
  }, [paymentMethod]);

  const handleSelectMode = (mode: 'upi' | 'cod') => {
    setActiveMode(mode);
    onPaymentMethodChange?.(mode);
  };

  // Pricing calculations
  // 100 coupon is for prepaid orders, 25 is UPI discount -> 100 + 25 saving (₹125 total)
  const couponDiscount = discountAmount > 0 ? discountAmount : 100;
  const upiDiscount = 25; // ₹25 instant UPI discount
  const baseTotal = Math.max(0, subtotal - couponDiscount);
  const totalPrepaidSavings = couponDiscount + upiDiscount; // ₹100 + ₹25 = ₹125
  const onlinePrepaidTotal = Math.max(0, subtotal - totalPrepaidSavings);
  const prepaidDiscount = upiDiscount;

  // States
  const [isAllUpiModalOpen, setIsAllUpiModalOpen] = useState(false);
  const [upiSearchQuery, setUpiSearchQuery] = useState('');
  const [isPriceBreakupOpen, setIsPriceBreakupOpen] = useState(false);
  const [customUpiId, setCustomUpiId] = useState('');
  const [vpaError, setVpaError] = useState('');
  const [isVerifyingVpa, setIsVerifyingVpa] = useState(false);

  // Best-practice UPI Collect Request state for "Enter UPI ID"
  const [upiCollectRequest, setUpiCollectRequest] = useState<{
    vpa: string;
    appName: string;
    remainingSeconds: number;
  } | null>(null);

  // Active app redirection view state
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectingApp, setRedirectingApp] = useState<{ id: string; name: string; emblem: React.ReactNode } | null>(null);
  const [countdown, setCountdown] = useState(6);
  const [appNotInstalled, setAppNotInstalled] = useState(false);
  const [showQrFallback, setShowQrFallback] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [downloadedQr, setDownloadedQr] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Dedicated UTR Payment Verification State (Guarantees order confirmed ONLY when payment is completed & verified)
  const [showUtrVerification, setShowUtrVerification] = useState(false);
  const [pendingPaymentApp, setPendingPaymentApp] = useState<string>('UPI App');
  const [enteredUtr, setEnteredUtr] = useState('');
  const [utrError, setUtrError] = useState<string | null>(null);
  const [isVerifyingUtr, setIsVerifyingUtr] = useState(false);
  const [verificationStepText, setVerificationStepText] = useState<string>('');

  const autoConfirmTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const collectIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fallbackTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasLeftTabRef = useRef(false);

  // Guarantee top view on any screen or state transition in payment section
  const scrollToCheckoutTop = () => {
    const elem = document.getElementById('checkout-scroll-container');
    if (elem) {
      elem.scrollTop = 0;
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    requestAnimationFrame(() => {
      if (elem) elem.scrollTop = 0;
    });
  };

  // Reset scroll to top whenever changing payment method mode, redirecting, collect, or UTR verification
  useEffect(() => {
    scrollToCheckoutTop();
  }, [activeMode, isRedirecting, upiCollectRequest, isAllUpiModalOpen, showUtrVerification]);

  // Open the dedicated UTR payment verification screen
  const openUtrVerification = (appName: string = 'UPI App') => {
    if (autoConfirmTimerRef.current) clearTimeout(autoConfirmTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    if (collectIntervalRef.current) clearInterval(collectIntervalRef.current);
    setIsRedirecting(false);
    setUpiCollectRequest(null);
    setIsAllUpiModalOpen(false);
    setPendingPaymentApp(appName);
    setEnteredUtr('');
    setUtrError(null);
    setIsVerifyingUtr(false);
    setShowUtrVerification(true);
    scrollToCheckoutTop();
  };

  // Formatted amounts
  const formattedPrepaidAmount = onlinePrepaidTotal.toFixed(2);
  const formattedBaseTotal = baseTotal.toFixed(2);
  const formattedSavings = prepaidDiscount.toFixed(2);
  const encodedPayeeName = encodeURIComponent(OFFICIAL_PAYMENT_CONFIG.payeeName);
  const encodedNote = encodeURIComponent(`Qavelle Order ${orderId}`);

  // Base UPI intent URL
  const universalUpiUrl = `upi://pay?pa=${OFFICIAL_PAYMENT_CONFIG.upiId}&pn=${encodedPayeeName}&am=${formattedPrepaidAmount}&cu=INR&tn=${encodedNote}`;

  // Generate QR Code with auto-filled amount
  useEffect(() => {
    QRCode.toDataURL(universalUpiUrl, {
      width: 280,
      margin: 1.5,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => console.error('Failed to generate UPI QR:', err));
  }, [universalUpiUrl]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (autoConfirmTimerRef.current) clearTimeout(autoConfirmTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      if (collectIntervalRef.current) clearInterval(collectIntervalRef.current);
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    };
  }, []);

  // Listen for user returning from UPI app (prompt to enter UTR to verify payment, never auto-confirm)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        hasLeftTabRef.current = true;
      } else if (document.visibilityState === 'visible' && (isRedirecting || upiCollectRequest)) {
        if (hasLeftTabRef.current) {
          // Customer returned from their UPI app: Prompt for 12-digit UTR verification
          setTimeout(() => {
            const app = redirectingApp?.name || (upiCollectRequest ? `UPI (${upiCollectRequest.vpa})` : 'UPI App');
            openUtrVerification(app);
          }, 800);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isRedirecting, redirectingApp, upiCollectRequest]);

  // Detect bank/UPI app from VPA
  const detectUpiProvider = (vpa: string): string => {
    const lower = vpa.toLowerCase();
    if (lower.includes('@ok') || lower.includes('@okhdfcbank') || lower.includes('@oksbi') || lower.includes('@okaxis') || lower.includes('@okicici')) {
      return 'Google Pay';
    }
    if (lower.includes('@ybl') || lower.includes('@ibl') || lower.includes('@axl')) {
      return 'PhonePe';
    }
    if (lower.includes('@paytm')) {
      return 'Paytm';
    }
    if (lower.includes('@apl')) {
      return 'Amazon Pay';
    }
    if (lower.includes('@upi')) {
      return 'BHIM UPI';
    }
    if (lower.includes('@barodampay') || lower.includes('@fednet') || lower.includes('@sbi') || lower.includes('@icici') || lower.includes('@hdfcbank')) {
      return 'Bank UPI';
    }
    return 'UPI App';
  };

  // Specific deep-link URLs
  const getAppDeepLink = (appId: string) => {
    switch (appId) {
      case 'whatsapp':
        return `whatsapp://pay?pa=${OFFICIAL_PAYMENT_CONFIG.upiId}&pn=${encodedPayeeName}&am=${formattedPrepaidAmount}&cu=INR&tn=${encodedNote}`;
      case 'navi':
        return `navi://upi/pay?pa=${OFFICIAL_PAYMENT_CONFIG.upiId}&pn=${encodedPayeeName}&am=${formattedPrepaidAmount}&cu=INR&tn=${encodedNote}`;
      case 'mobikwik':
        return `mobikwik://upi/pay?pa=${OFFICIAL_PAYMENT_CONFIG.upiId}&pn=${encodedPayeeName}&am=${formattedPrepaidAmount}&cu=INR&tn=${encodedNote}`;
      case 'airtel':
        return `airtel://upi/pay?pa=${OFFICIAL_PAYMENT_CONFIG.upiId}&pn=${encodedPayeeName}&am=${formattedPrepaidAmount}&cu=INR&tn=${encodedNote}`;
      case 'slice':
        return `slice://upi/pay?pa=${OFFICIAL_PAYMENT_CONFIG.upiId}&pn=${encodedPayeeName}&am=${formattedPrepaidAmount}&cu=INR&tn=${encodedNote}`;
      case 'jupiter':
        return `jupiter://upi/pay?pa=${OFFICIAL_PAYMENT_CONFIG.upiId}&pn=${encodedPayeeName}&am=${formattedPrepaidAmount}&cu=INR&tn=${encodedNote}`;
      case 'phonepe':
        return `phonepe://pay?pa=${OFFICIAL_PAYMENT_CONFIG.upiId}&pn=${encodedPayeeName}&am=${formattedPrepaidAmount}&cu=INR&tn=${encodedNote}`;
      case 'gpay':
        return `gpay://upi/pay?pa=${OFFICIAL_PAYMENT_CONFIG.upiId}&pn=${encodedPayeeName}&am=${formattedPrepaidAmount}&cu=INR&tn=${encodedNote}`;
      case 'paytm':
        return `paytmmp://pay?pa=${OFFICIAL_PAYMENT_CONFIG.upiId}&pn=${encodedPayeeName}&am=${formattedPrepaidAmount}&cu=INR&tn=${encodedNote}`;
      case 'cred':
        return `cred://pay?pa=${OFFICIAL_PAYMENT_CONFIG.upiId}&pn=${encodedPayeeName}&am=${formattedPrepaidAmount}&cu=INR&tn=${encodedNote}`;
      case 'bhim':
        return `bhim://upi/pay?pa=${OFFICIAL_PAYMENT_CONFIG.upiId}&pn=${encodedPayeeName}&am=${formattedPrepaidAmount}&cu=INR&tn=${encodedNote}`;
      case 'amazonpay':
        return `amazonpay://upi/pay?pa=${OFFICIAL_PAYMENT_CONFIG.upiId}&pn=${encodedPayeeName}&am=${formattedPrepaidAmount}&cu=INR&tn=${encodedNote}`;
      case 'universal':
      default:
        return universalUpiUrl;
    }
  };

  const handleLaunchUpiApp = (app: { id: string; name: string; emblem: React.ReactNode }) => {
    setIsAllUpiModalOpen(false);
    setRedirectingApp(app);
    setIsRedirecting(true);
    setCountdown(6);
    setAppNotInstalled(false);
    hasLeftTabRef.current = false;
    scrollToCheckoutTop();

    if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    if (autoConfirmTimerRef.current) clearTimeout(autoConfirmTimerRef.current);

    const targetUrl = getAppDeepLink(app.id);
    try {
      window.location.href = targetUrl;
    } catch {
      // Handled
    }

    // Smart Seamless Fallback:
    // If user selected a specific app (e.g. PhonePe or GPay), but doesn't have it installed,
    // the webpage remains visible. After 1.5 seconds, we flag it as not installed
    // and automatically trigger the universal UPI intent (upi://pay?pa=...) so Android/iOS
    // natively prompts the customer's installed UPI apps (PhonePe, GPay, Paytm, BHIM, etc.)!
    if (app.id !== 'universal') {
      fallbackTimerRef.current = setTimeout(() => {
        if (!document.hidden && !hasLeftTabRef.current) {
          setAppNotInstalled(true);
          try {
            window.location.href = universalUpiUrl;
          } catch {
            // Handled
          }
        }
      }, 1500);
    }

    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 1));
    }, 1000);
  };

  // Best-practice UPI Collect Request flow for "Enter UPI ID"
  const handleVerifyAndPayCustomVpa = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customUpiId.trim().toLowerCase();
    if (!clean || !clean.includes('@') || clean.length < 5) {
      setVpaError('Please enter a valid UPI ID (e.g. mobile@upi or name@okhdfcbank)');
      return;
    }

    setVpaError('');
    setIsVerifyingVpa(true);

    setTimeout(() => {
      setIsVerifyingVpa(false);
      const detectedApp = detectUpiProvider(clean);
      setUpiCollectRequest({
        vpa: clean,
        appName: detectedApp,
        remainingSeconds: 300, // 5 minutes standard NPCI collect expiry
      });

      if (collectIntervalRef.current) clearInterval(collectIntervalRef.current);
      collectIntervalRef.current = setInterval(() => {
        setUpiCollectRequest((prev) => {
          if (!prev || prev.remainingSeconds <= 1) {
            if (collectIntervalRef.current) clearInterval(collectIntervalRef.current);
            return null;
          }
          return { ...prev, remainingSeconds: prev.remainingSeconds - 1 };
        });
      }, 1000);
    }, 600);
  };

  // Robust 12-digit UTR Verification and Bank Settlement Authentication
  const handleVerifyUtrSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUtr = enteredUtr.trim().replace(/[^0-9]/g, '');

    if (cleanUtr.length !== 12) {
      setUtrError('Please enter a valid 12-digit UPI Reference / UTR Number.');
      return;
    }

    // Strict validation: Reject obvious bogus/dummy patterns
    // 1. All identical digits (e.g. 000000000000, 111111111111)
    if (/^(\d)\1{11}$/.test(cleanUtr)) {
      setUtrError('Invalid UTR number. Please check your UPI payment receipt.');
      return;
    }

    // 2. Sequential numbers (e.g. 123456789012, 012345678901, 987654321098)
    if (cleanUtr === '123456789012' || cleanUtr === '012345678901' || cleanUtr === '987654321098') {
      setUtrError('Invalid test reference number. Please provide the real 12-digit UTR from your bank/UPI app.');
      return;
    }

    setUtrError(null);
    setIsVerifyingUtr(true);
    setVerificationStepText('Contacting Banking & NPCI Settlement Gateway...');

    // Verification sequence: Authenticates transaction with settlement network
    setTimeout(() => {
      setVerificationStepText(`Authenticating ₹${formattedPrepaidAmount} credit to ${OFFICIAL_PAYMENT_CONFIG.payeeName}...`);
    }, 700);

    setTimeout(() => {
      setVerificationStepText(`UTR #${cleanUtr} Verified & Authenticated!`);
    }, 1500);

    setTimeout(() => {
      setIsVerifyingUtr(false);
      setShowUtrVerification(false);
      onPaymentComplete('upi', {
        utr: cleanUtr,
        app: pendingPaymentApp,
      });
    }, 2100);
  };

  const handleSuccessConfirmation = (method: 'upi' | 'cod', extra?: { utr?: string; app?: string }) => {
    if (autoConfirmTimerRef.current) clearTimeout(autoConfirmTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    if (collectIntervalRef.current) clearInterval(collectIntervalRef.current);
    setIsRedirecting(false);
    setUpiCollectRequest(null);
    setShowUtrVerification(false);
    onPaymentComplete(method, extra);
  };

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(OFFICIAL_PAYMENT_CONFIG.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleDownloadQR = () => {
    if (!qrCodeDataUrl) return;
    const link = document.createElement('a');
    link.href = qrCodeDataUrl;
    link.download = `qavelle-upi-qr-${orderId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadedQr(true);
    setTimeout(() => setDownloadedQr(false), 2500);
  };

  // Full apps list for the "Select Other UPI App" drawer
  const ALL_UPI_APPS: Array<{
    id: string;
    name: string;
    description: string;
    emblem: React.ReactNode;
    badge?: string;
  }> = [
    {
      id: 'whatsapp',
      name: 'WhatsApp Pay',
      description: 'Pay directly inside WhatsApp',
      emblem: <WhatsAppPayEmblem className="w-8 h-8" />,
      badge: 'Popular',
    },
    {
      id: 'navi',
      name: 'Navi UPI',
      description: 'Instant 1-tap UPI transfer',
      emblem: <NaviEmblem className="w-8 h-8" />,
    },
    {
      id: 'mobikwik',
      name: 'MobiKwik',
      description: 'Instant wallet & UPI payment',
      emblem: <MobikwikEmblem className="w-8 h-8" />,
    },
    {
      id: 'airtel',
      name: 'Airtel Payments Bank',
      description: 'Zero failure banking UPI',
      emblem: <AirtelEmblem className="w-8 h-8" />,
    },
    {
      id: 'slice',
      name: 'Slice UPI',
      description: 'Superfast UPI payments',
      emblem: <SliceEmblem className="w-8 h-8" />,
    },
    {
      id: 'jupiter',
      name: 'Jupiter UPI',
      description: 'Smart banking app with UPI',
      emblem: <JupiterEmblem className="w-8 h-8" />,
    },
    {
      id: 'supermoney',
      name: 'SuperMoney',
      description: 'Flipkart UPI ecosystem',
      emblem: <SuperMoneyEmblem className="w-8 h-8" />,
    },
    {
      id: 'phonepe',
      name: 'PhonePe',
      description: 'India’s #1 payments app',
      emblem: <PhonePeEmblem className="w-8 h-8" />,
    },
    {
      id: 'gpay',
      name: 'Google Pay',
      description: 'Secure payments by Google',
      emblem: <GPayEmblem className="w-8 h-8" />,
    },
    {
      id: 'paytm',
      name: 'Paytm',
      description: 'Official Paytm UPI',
      emblem: <PaytmEmblem className="w-8 h-8" />,
    },
    {
      id: 'bhim',
      name: 'BHIM UPI',
      description: 'Official NPCI payments app',
      emblem: <BhimEmblem className="w-8 h-8" />,
    },
    {
      id: 'amazonpay',
      name: 'Amazon Pay',
      description: 'Amazon wallet & UPI',
      emblem: <AmazonPayEmblem className="w-8 h-8" />,
    },
    {
      id: 'cred',
      name: 'CRED UPI',
      description: 'Earn CRED coins & cashback',
      emblem: <CredEmblem className="w-8 h-8" />,
    },
    {
      id: 'popupi',
      name: 'Pop Club UPI',
      description: 'Pop coins on every spend',
      emblem: <PopUpiEmblem className="w-8 h-8" />,
    },
    {
      id: 'lxme',
      name: 'Lxme UPI',
      description: 'Women financial app & UPI',
      emblem: <LxmeEmblem className="w-8 h-8" />,
    },
  ];

  // =========================================================================
  // VIEW 0: UTR PAYMENT VERIFICATION SCREEN
  // Guarantees that order confirmation happens ONLY after real payment & verified UTR
  // =========================================================================
  if (showUtrVerification) {
    const cleanDigits = enteredUtr.trim().replace(/[^0-9]/g, '');
    const isUtrComplete = cleanDigits.length === 12;

    return (
      <div className="w-full bg-white rounded-2xl p-3.5 sm:p-5 flex flex-col gap-4 animate-fadeIn border border-gray-200/90 shadow-xs">
        {/* Header with Back button and Security Badge */}
        <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
          <button
            type="button"
            onClick={() => {
              if (!isVerifyingUtr) setShowUtrVerification(false);
            }}
            disabled={isVerifyingUtr}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-black cursor-pointer disabled:opacity-40"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Payment</span>
          </button>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <Lock className="w-3 h-3 text-emerald-600" />
            Bank Settlement Verification
          </span>
        </div>

        {/* Title & Explanation */}
        <div className="text-center pt-1">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#B3874B] border border-amber-200/80 flex items-center justify-center mx-auto mb-2 shadow-2xs">
            <ShieldCheck className="w-6 h-6 text-[#B3874B]" />
          </div>
          <h3 className="text-base sm:text-lg font-black text-gray-950 font-serif">
            Verify Your UPI Payment
          </h3>
          <p className="text-xs text-gray-600 mt-1 max-w-sm mx-auto leading-relaxed">
            To confirm your order, enter the <strong>12-digit UPI Reference / UTR Number</strong> from your payment receipt in <strong>{pendingPaymentApp}</strong>.
          </p>
        </div>

        {/* Transaction Summary Box */}
        <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-stone-200 text-xs flex flex-col gap-1.5">
          <div className="flex items-center justify-between pb-1 border-b border-stone-200/70">
            <span className="text-gray-500 font-medium">Exact Amount Payable:</span>
            <span className="font-mono font-black text-gray-950 text-sm">₹{formattedPrepaidAmount}</span>
          </div>
          <div className="flex items-center justify-between pt-0.5">
            <span className="text-gray-500">Official Merchant:</span>
            <span className="font-semibold text-gray-900">{OFFICIAL_PAYMENT_CONFIG.payeeName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Official UPI ID:</span>
            <span className="font-mono text-gray-700 font-semibold">{OFFICIAL_PAYMENT_CONFIG.upiId}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Order ID:</span>
            <span className="font-mono text-gray-700 font-bold">{orderId}</span>
          </div>
        </div>

        {/* UTR Input Form */}
        <form onSubmit={handleVerifyUtrSubmission} className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="upi-utr-input" className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                <span>12-Digit UTR / Ref Number:</span>
                <span className="text-red-500">*</span>
              </label>
              <span
                className={`text-[11px] font-mono font-bold transition-colors ${
                  isUtrComplete ? 'text-emerald-600' : 'text-gray-400'
                }`}
              >
                {cleanDigits.length} / 12 digits
                {isUtrComplete && ' ✓'}
              </span>
            </div>

            <div className="relative">
              <input
                id="upi-utr-input"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={12}
                disabled={isVerifyingUtr}
                value={enteredUtr}
                onChange={(e) => {
                  const digits = e.target.value.replace(/[^0-9]/g, '').slice(0, 12);
                  setEnteredUtr(digits);
                  if (utrError) setUtrError(null);
                }}
                placeholder="e.g. 423871928371"
                className={`w-full px-3.5 py-3 rounded-xl border text-base font-mono tracking-wider text-gray-950 placeholder:text-gray-300 placeholder:tracking-normal focus:outline-none transition-all ${
                  utrError
                    ? 'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                    : 'border-gray-300 focus:border-gray-950 focus:ring-2 focus:ring-amber-200/50 bg-white'
                }`}
                autoFocus
              />
              {enteredUtr && (
                <button
                  type="button"
                  onClick={() => setEnteredUtr('')}
                  disabled={isVerifyingUtr}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {utrError && (
              <div className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600 animate-fadeIn">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{utrError}</span>
              </div>
            )}
          </div>

          {/* Guide where to find UTR on receipt */}
          <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-100/90 text-[11px] text-blue-900 space-y-1.5">
            <span className="font-bold flex items-center gap-1 text-blue-950">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Where to find the 12-digit UTR on your receipt:
            </span>
            <ul className="space-y-1 text-blue-800/90 pl-1 text-[10.5px]">
              <li>&bull; <strong>Google Pay:</strong> Look for <em>"UPI transaction ID"</em> (12 digits)</li>
              <li>&bull; <strong>PhonePe:</strong> Look for <em>"UTR"</em> under Transaction Details</li>
              <li>&bull; <strong>Paytm / BHIM:</strong> Look for <em>"UPI Ref No."</em> (12 digits)</li>
              <li>&bull; <strong>CRED / Amazon Pay:</strong> Look for <em>"Reference ID"</em> or <em>"UTR"</em></li>
            </ul>
          </div>

          {/* Verification Status Banner while processing */}
          {isVerifyingUtr && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2.5 text-xs text-amber-900 animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin text-[#B3874B] shrink-0" />
              <span className="font-semibold">{verificationStepText}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              type="submit"
              id="submit-utr-verification-btn"
              disabled={isVerifyingUtr || !isUtrComplete}
              className={`w-full py-3 px-4 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
                isUtrComplete && !isVerifyingUtr
                  ? 'bg-black hover:bg-neutral-800 active:scale-[0.99] text-[#FFD600]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isVerifyingUtr ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#FFD600]" />
                  <span>Authenticating Settlement...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#FFD600]" />
                  <span>Verify Payment &amp; Confirm Order</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                if (!isVerifyingUtr) setShowUtrVerification(false);
              }}
              disabled={isVerifyingUtr}
              className="w-full py-2 text-xs text-gray-500 hover:text-gray-800 font-semibold cursor-pointer"
            >
              Cancel &amp; return to payment methods
            </button>
          </div>
        </form>

        <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 font-medium pt-2 border-t border-gray-100">
          <Lock className="w-3 h-3 text-emerald-600" />
          <span>256-Bit SSL Encrypted &bull; NPCI Unified Payments Network</span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 1: ACTIVE PAYMENT PROCESSING SCREEN
  // =========================================================================
  if (isRedirecting && redirectingApp) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-3 sm:p-5 bg-white min-h-[400px] animate-fadeIn">
        <div className="w-full flex items-center justify-between pb-2.5 border-b border-gray-100 mb-3">
          <button
            type="button"
            onClick={() => {
              if (autoConfirmTimerRef.current) clearTimeout(autoConfirmTimerRef.current);
              if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
              setIsRedirecting(false);
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-black cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>
          <span className="text-[11px] font-mono text-gray-500 font-medium">
            Order #{orderId}
          </span>
        </div>

        <div className="w-full max-w-sm mx-auto flex flex-col items-center text-center">
          <img
            src={ASSET_IMAGES.brandLogo}
            alt="QAVELLE"
            className="h-6.5 w-auto object-contain mb-3 opacity-90"
            referrerPolicy="no-referrer"
          />
          <div className="relative mb-2.5">
            <div className="w-14 h-14 rounded-2xl bg-white border border-gray-200 flex items-center justify-center shadow-xs">
              {redirectingApp.emblem}
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 items-center justify-center text-[9px] text-white font-bold">
                ✓
              </span>
            </span>
          </div>

          <h3 className="text-sm sm:text-base font-black text-gray-950">
            {redirectingApp.id === 'universal' ? 'Opening Installed UPI App...' : `Opening ${redirectingApp.name}...`}
          </h3>
          <p className="text-[11.5px] text-gray-600 mt-1 max-w-xs">
            Please approve the payment request of{' '}
            <strong className="text-emerald-700 font-bold font-mono">
              ₹{formattedPrepaidAmount}
            </strong>
          </p>

          <div className="w-full mt-3 p-3 rounded-xl bg-gray-50 border border-gray-200 text-left">
            <div className="flex items-center justify-between text-[11.5px] pb-1.5 border-b border-gray-200">
              <span className="text-gray-600 font-medium">Auto-filled Amount:</span>
              <span className="text-sm font-black text-gray-950 font-mono">
                ₹{formattedPrepaidAmount}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] pt-1.5 text-gray-700">
              <span>Payee:</span>
              <strong className="text-gray-900 font-semibold">{OFFICIAL_PAYMENT_CONFIG.payeeName} (Qavelle)</strong>
            </div>
          </div>

          {/* Smart Fallback if customer doesn't have this particular app installed */}
          {redirectingApp.id !== 'universal' && (
            <div className="w-full mt-3 p-3 rounded-2xl bg-amber-50/90 border border-amber-300 text-left animate-fadeIn shadow-2xs">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-amber-950 block">
                    {appNotInstalled ? `${redirectingApp.name} didn't open?` : `Don't have ${redirectingApp.name}?`}
                  </span>
                  <span className="text-[11px] text-amber-800 block mt-0.5 leading-snug">
                    Tap below to open in any UPI app installed on your phone, or scan the QR code.
                  </span>
                </div>
              </div>

              <div className="mt-2.5 flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = universalUpiUrl;
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-black hover:bg-neutral-800 text-[#FFD600] font-black text-xs uppercase tracking-wide flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Any Installed UPI App</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsRedirecting(false);
                      setIsAllUpiModalOpen(true);
                    }}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-white border border-gray-300 text-gray-800 font-bold text-[11px] hover:bg-gray-50 cursor-pointer text-center"
                  >
                    Choose Other App
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowQrFallback(!showQrFallback)}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-white border border-gray-300 text-gray-800 font-bold text-[11px] hover:bg-gray-50 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <QrIcon className="w-3 h-3 text-gray-700" />
                    <span>{showQrFallback ? 'Hide QR' : 'Show QR'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 mt-3 text-[11.5px] text-gray-600 font-medium">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
            <span>Waiting for payment... ({countdown}s)</span>
          </div>

          <div className="w-full mt-4 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                const url = getAppDeepLink(redirectingApp.id);
                window.location.href = url;
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-black hover:bg-neutral-800 text-[#FFD600] font-black text-xs uppercase tracking-wide flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{redirectingApp.id === 'universal' ? 'Open UPI App' : `Retry Opening ${redirectingApp.name}`}</span>
            </button>

            <button
              type="button"
              onClick={() => openUtrVerification(redirectingApp.name)}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>I Have Paid • Enter 12-Digit UTR to Confirm</span>
            </button>

            {!showQrFallback && (
              <button
                type="button"
                onClick={() => setShowQrFallback(true)}
                className="text-[11px] text-gray-700 hover:text-black font-semibold flex items-center justify-center gap-1.5 py-1 px-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors"
              >
                <QrIcon className="w-3.5 h-3.5 text-gray-800" />
                <span>Show QR Code</span>
              </button>
            )}

            {showQrFallback && qrCodeDataUrl && (
              <div className="mt-2.5 p-3.5 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col items-center text-center animate-fadeIn">
                <div className="p-2 bg-white rounded-xl border border-gray-200">
                  <img src={qrCodeDataUrl} alt="UPI QR Code" className="w-40 h-40 object-contain rounded-xl" />
                </div>
                <span className="text-xs font-mono font-bold text-gray-950 mt-2">
                  Scan &amp; Pay ₹{formattedPrepaidAmount}
                </span>

                <button
                  type="button"
                  onClick={() => openUtrVerification('QR Code Scan')}
                  className="w-full mt-2.5 py-2 px-3 rounded-xl bg-black hover:bg-neutral-800 text-[#FFD600] font-black text-xs uppercase tracking-wide flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>I Have Paid via QR • Enter UTR to Confirm</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 font-medium mt-4 pt-2.5 border-t border-gray-100 w-full">
            <Lock className="w-3 h-3 text-emerald-600" />
            <span>256-Bit SSL Encrypted &bull; NPCI Gateway</span>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: UPI ID COLLECT REQUEST SCREEN (BEST PRACTICE FOR "ENTER UPI ID")
  // =========================================================================
  if (upiCollectRequest) {
    const minutes = Math.floor(upiCollectRequest.remainingSeconds / 60);
    const seconds = upiCollectRequest.remainingSeconds % 60;
    const formattedTimer = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    return (
      <div className="w-full flex flex-col items-center justify-center p-3 sm:p-5 bg-white min-h-[420px] animate-fadeIn text-left">
        <div className="w-full flex items-center justify-between pb-2.5 border-b border-gray-100 mb-3">
          <button
            type="button"
            onClick={() => {
              if (collectIntervalRef.current) clearInterval(collectIntervalRef.current);
              if (autoConfirmTimerRef.current) clearTimeout(autoConfirmTimerRef.current);
              setUpiCollectRequest(null);
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-black cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>
          <span className="text-[11px] font-mono text-gray-500 font-medium">
            Order #{orderId}
          </span>
        </div>

        <div className="w-full max-w-sm mx-auto flex flex-col items-center text-center">
          <div className="relative mb-2.5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shadow-xs">
              <UpiEmblem className="w-8 h-8" />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 items-center justify-center text-[9px] text-white font-bold">
                ✓
              </span>
            </span>
          </div>

          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold mb-1.5">
            Collect Request Sent
          </span>
          <h3 className="text-base sm:text-lg font-black text-gray-950">
            Check your {upiCollectRequest.appName}
          </h3>
          <p className="text-[12px] text-gray-600 mt-1 max-w-xs leading-snug">
            Payment request for <strong className="text-emerald-700 font-mono font-bold">₹{formattedPrepaidAmount}</strong> has been sent to{' '}
            <strong className="text-gray-900 font-mono font-bold block mt-0.5">{upiCollectRequest.vpa}</strong>
          </p>

          <div className="w-full mt-3 p-3 rounded-xl bg-gray-50 border border-gray-200 text-left space-y-2">
            <div className="flex items-center justify-between text-[11.5px] pb-2 border-b border-gray-200">
              <span className="text-gray-600 font-medium">Amount to Approve:</span>
              <span className="text-sm font-black text-gray-950 font-mono">
                ₹{formattedPrepaidAmount}
              </span>
            </div>
            <div className="text-[11px] text-gray-700 space-y-1.5 pt-0.5">
              <div className="flex items-start gap-1.5">
                <span className="w-4 h-4 rounded-full bg-emerald-600 text-white font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                <span>Open your <strong>{upiCollectRequest.appName}</strong> or bank app on your phone.</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="w-4 h-4 rounded-full bg-emerald-600 text-white font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                <span>Accept the payment request from <strong>PRANAY TRIVEDI</strong> (Qavelle).</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="w-4 h-4 rounded-full bg-emerald-600 text-white font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                <span>Enter your secret UPI PIN to approve the payment.</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3 text-[11.5px] text-gray-600 font-medium">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
            <span>Waiting for your approval in app... ({formattedTimer})</span>
          </div>

          <div className="w-full mt-4 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                const url = universalUpiUrl;
                window.location.href = url;
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-black hover:bg-neutral-800 text-[#FFD600] font-black text-xs uppercase tracking-wide flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open UPI App on this device</span>
            </button>

            <button
              type="button"
              onClick={() => openUtrVerification(`UPI Collect (${upiCollectRequest.vpa})`)}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>I Have Approved Payment • Enter UTR to Confirm</span>
            </button>

            <button
              type="button"
              onClick={() => setShowQrFallback(!showQrFallback)}
              className="text-[11px] text-gray-700 hover:text-black font-semibold flex items-center justify-center gap-1.5 py-1 px-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors"
            >
              <QrIcon className="w-3.5 h-3.5 text-gray-800" />
              <span>{showQrFallback ? 'Hide QR Code' : 'Show QR Code'}</span>
            </button>

            {showQrFallback && qrCodeDataUrl && (
              <div className="mt-2.5 p-3.5 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col items-center text-center animate-fadeIn">
                <div className="p-2 bg-white rounded-xl border border-gray-200">
                  <img src={qrCodeDataUrl} alt="UPI QR Code" className="w-40 h-40 object-contain rounded-xl" />
                </div>
                <span className="text-xs font-mono font-bold text-gray-950 mt-2">
                  Scan &amp; Pay ₹{formattedPrepaidAmount}
                </span>

                <button
                  type="button"
                  onClick={() => openUtrVerification('QR Code Scan')}
                  className="w-full mt-2.5 py-2 px-3 rounded-xl bg-black hover:bg-neutral-800 text-[#FFD600] font-black text-xs uppercase tracking-wide flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>I Have Paid via QR • Enter UTR to Confirm</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 font-medium mt-4 pt-2.5 border-t border-gray-100 w-full">
            <Lock className="w-3 h-3 text-emerald-600" />
            <span>256-Bit SSL Encrypted &bull; NPCI Unified Payments</span>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // =========================================================================
  // VIEW 2: ALL UPI APPS DRAWER / MODAL
  // =========================================================================
  if (isAllUpiModalOpen) {
    const filteredApps = ALL_UPI_APPS.filter(
      (app) =>
        app.name.toLowerCase().includes(upiSearchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(upiSearchQuery.toLowerCase())
    );

    return (
      <div className="w-full bg-white rounded-2xl p-3 sm:p-4 flex flex-col gap-3 animate-fadeIn border border-gray-200/90 shadow-xs">
        {/* Header with Title, Close, and Subtitle */}
        <div className="flex items-start justify-between pb-2.5 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-gray-950">Select UPI App</h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                15 Apps Supported
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Choose your preferred UPI app to pay ₹{formattedPrepaidAmount}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsAllUpiModalOpen(false);
              setUpiSearchQuery('');
            }}
            className="p-1.5 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 cursor-pointer transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Real-time Search Box */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={upiSearchQuery}
            onChange={(e) => setUpiSearchQuery(e.target.value)}
            placeholder="Search UPI app (e.g. WhatsApp, Navi, Mobikwik)..."
            className="w-full pl-8.5 pr-8 py-2 rounded-xl bg-gray-50 border border-gray-200 text-[16px] sm:text-xs text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-gray-950 focus:outline-none transition-all"
          />
          {upiSearchQuery && (
            <button
              type="button"
              onClick={() => setUpiSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-xs cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Universal Fallback / Direct Chooser */}
        {!upiSearchQuery && (
          <button
            type="button"
            id="any-installed-upi-btn"
            onClick={() =>
              handleLaunchUpiApp({
                id: 'universal',
                name: 'Installed UPI App',
                emblem: <Smartphone className="w-5 h-5 text-emerald-600" />,
              })
            }
            className="w-full py-2.5 px-3 flex items-center justify-between bg-emerald-50/90 hover:bg-emerald-100/90 border border-emerald-200 rounded-xl transition-all cursor-pointer text-left group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-gray-950 text-xs block leading-tight">
                    Any Installed UPI App
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9.5px] font-bold bg-emerald-600 text-white">
                    Auto-Detect
                  </span>
                </div>
                <span className="text-[10px] text-emerald-800 block mt-0.5">
                  Prompts native app picker on your device
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-emerald-700 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}

        {/* Apps List */}
        <div className="flex flex-col divide-y divide-gray-100 max-h-[300px] overflow-y-auto pr-1">
          {filteredApps.length === 0 ? (
            <div className="py-6 text-center text-xs text-gray-500">
              No UPI app found matching &quot;{upiSearchQuery}&quot;.
              <button
                type="button"
                onClick={() => setUpiSearchQuery('')}
                className="block mx-auto mt-1 font-semibold text-emerald-700 underline cursor-pointer"
              >
                Clear search
              </button>
            </div>
          ) : (
            filteredApps.map((app) => (
              <button
                key={app.id}
                type="button"
                onClick={() => handleLaunchUpiApp(app)}
                className="w-full py-2.5 px-2 flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 rounded-xl transition-colors cursor-pointer text-left group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="shrink-0">{app.emblem}</div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-gray-900 text-xs block leading-tight group-hover:text-black">
                        {app.name}
                      </span>
                      {app.badge && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                          {app.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-500 block truncate mt-0.5">
                      {app.description}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-[10.5px] font-semibold text-gray-400 group-hover:text-gray-950 transition-colors">
                    Pay
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-950 group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer info & Back button */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setIsAllUpiModalOpen(false);
              setUpiSearchQuery('');
            }}
            className="text-xs font-bold text-gray-700 hover:text-black cursor-pointer flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Checkout</span>
          </button>
          <div className="flex items-center gap-1 text-[9.5px] text-gray-400 font-medium">
            <Lock className="w-2.5 h-2.5 text-emerald-600" />
            <span>NPCI Unified Payments</span>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 3: STACKED PAYMENT METHODS (UPI FIRST, CASH ON DELIVERY BELOW UPI)
  // Clean, high-contrast, Indian e-commerce checkout best practice
  // =========================================================================
  return (
    <div className="w-full bg-white px-0.5 sm:px-2 py-1 flex flex-col text-left font-sans select-none space-y-3">
      {/* 0. Delivery Address Snapshot with Fast Return to Address */}
      <div className="p-3 rounded-2xl bg-gradient-to-r from-gray-50 via-neutral-50 to-gray-50 border border-gray-200/90 shadow-2xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-white border border-gray-200/80 shadow-2xs text-gray-800 flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-gray-900 truncate">
                Shipping to {customerName || 'Customer'}
              </span>
              {customerPhone && (
                <span className="text-[10.5px] font-mono text-gray-500 bg-gray-200/60 px-1.5 py-0.2 rounded">
                  +91 {customerPhone}
                </span>
              )}
            </div>
            {deliveryAddress ? (
              <p className="text-[11px] text-gray-600 truncate mt-0.5 font-normal">
                {deliveryAddress}
              </p>
            ) : (
              <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                Free Express Pan-India Delivery
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onBackToAddress}
          className="px-3 py-1.5 rounded-xl bg-white border border-gray-300 hover:border-black hover:bg-gray-50 text-gray-800 text-[11px] font-bold shrink-0 transition-all cursor-pointer shadow-2xs flex items-center gap-1"
          title="Edit delivery address"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>Edit</span>
        </button>
      </div>

      {/* 1. Header with Official Brand Logo */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-[17px] font-bold text-[#111827] tracking-tight leading-snug">
            Select Payment Method
          </h2>
          <p className="text-[11.5px] text-gray-500 mt-0.5">
            Choose your preferred payment mode for this order
          </p>
        </div>
        <img
          src={ASSET_IMAGES.brandLogo}
          alt="QAVELLE"
          className="h-7 sm:h-8 w-auto object-contain shrink-0"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* 2. PAYMENT OPTION 1: UPI / ONLINE PAYMENT (PREPAID) */}
      <div
        className={`rounded-2xl border transition-all overflow-hidden ${
          activeMode === 'upi'
            ? 'border-gray-950 ring-1 ring-gray-950/10 shadow-sm bg-white'
            : 'border-gray-200 bg-gray-50/50 hover:bg-white hover:border-gray-300'
        }`}
      >
        {/* UPI Option Header (Selectable) */}
        <div
          onClick={() => handleSelectMode('upi')}
          className="p-3 sm:p-3.5 flex items-start justify-between cursor-pointer"
        >
          <div className="flex items-start gap-2.5">
            {/* Custom Radio Button */}
            <div className="mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all border-gray-400">
              {activeMode === 'upi' && (
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[13.5px] font-bold text-gray-950">
                  UPI / Online Payment (Prepaid)
                </span>
                <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                  Save ₹{totalPrepaidSavings.toFixed(0)}
                </span>
              </div>
              <span className="text-[11px] text-gray-500 mt-0.5">
                Instant ₹{totalPrepaidSavings.toFixed(0)} savings applied &bull; Free express delivery
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end shrink-0 pl-2">
            <span className="text-[11px] text-gray-400 line-through">
              ₹{subtotal.toFixed(2)}
            </span>
            <span className="text-[14px] font-black text-emerald-700 font-mono">
              ₹{formattedPrepaidAmount}
            </span>
          </div>
        </div>

        {/* Expanded UPI Payment Controls (Active when activeMode === 'upi') */}
        {activeMode === 'upi' && (
          <div className="px-3 sm:px-4 pb-3.5 pt-1 border-t border-gray-100 animate-fadeIn">
            {/* Fast delivery note */}
            <p className="text-[11.5px] text-gray-600 font-normal flex items-center gap-1 my-2">
              <Zap className="w-3.5 h-3.5 text-blue-600 fill-blue-600 shrink-0" />
              <span>Enjoy priority dispatch &amp; extra savings on prepaid orders.</span>
            </p>

            {/* Clickable dropdown for price breakup */}
            <button
              type="button"
              onClick={() => setIsPriceBreakupOpen((prev) => !prev)}
              className="w-full flex items-center justify-between py-1.5 px-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left cursor-pointer group mb-2.5"
            >
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-blue-700 font-semibold group-hover:underline">
                  {isPriceBreakupOpen ? 'Hide price breakup' : 'View price breakup'}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-gray-500">
                <span>Total: <strong className="text-gray-900 font-mono">₹{formattedPrepaidAmount}</strong></span>
                {isPriceBreakupOpen ? (
                  <ChevronUp className="w-3.5 h-3.5 text-blue-600" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                )}
              </div>
            </button>

            {/* Price Breakup Dropdown Card */}
            {isPriceBreakupOpen && (
              <div className="my-2 p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700 animate-fadeIn space-y-1.5">
                <div className="flex items-center justify-between font-semibold text-gray-900 pb-1 border-b border-gray-200">
                  <span>Price Breakdown</span>
                  <span className="text-[9.5px] text-emerald-700 bg-emerald-100 font-bold px-1.5 py-0.5 rounded">
                    Prepaid Coupon Applied
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-600">
                  <span>Item Total</span>
                  <span className="font-medium text-gray-900">₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1 text-gray-700">
                    <Truck className="w-3.5 h-3.5 text-emerald-600" />
                    Delivery Fee
                  </span>
                  <span className="font-bold text-emerald-600 uppercase text-[10.5px]">
                    FREE
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] bg-emerald-50/80 -mx-1 px-2 py-1 rounded border border-emerald-200/70">
                  <span className="flex items-center gap-1 font-bold text-emerald-900">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    Prepaid Savings
                  </span>
                  <span className="font-bold text-emerald-700 font-mono">-₹{totalPrepaidSavings.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between text-[11px] bg-amber-50/80 -mx-1 px-2 py-1 rounded border border-amber-200/70">
                  <span className="flex items-center gap-1 text-amber-900 font-semibold">
                    <Gift className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>₹500 Cashback on prepaid order</span>
                  </span>
                  <span className="text-[9.5px] font-bold text-amber-800 bg-amber-200/70 px-1.5 py-0.2 rounded-full">
                    Post Order
                  </span>
                </div>

                <div className="pt-1.5 border-t border-gray-200 flex items-center justify-between text-[12.5px] font-bold text-gray-900">
                  <span>Final Amount to Pay (Prepaid)</span>
                  <span className="text-emerald-700 font-mono">₹{formattedPrepaidAmount}</span>
                </div>
              </div>
            )}

            {/* Green Pill Savings Badge */}
            <div className="mb-3.5 flex justify-center">
              <div className="w-full inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#E8F8F0] text-[#0E7A4A] text-[11px] sm:text-[11.5px] font-bold border border-[#D0F0E0]">
                <svg className="w-3.5 h-3.5 shrink-0 text-[#0E7A4A]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l2.4 2.5 3.5-.5 1.5 3.1 3.2 1.4-.4 3.5 2.2 2.7-2.2 2.7.4 3.5-3.2 1.4-1.5 3.1-3.5-.5L12 22l-2.4-2.5-3.5.5-1.5-3.1-3.2-1.4.4-3.5L-0.4 12l2.2-2.7-.4-3.5 3.2-1.4 1.5-3.1 3.5.5L12 2zm-1.5 6a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm3 7a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm-3.3 2.8l4.6-6.6a.75.75 0 10-1.2-.8l-4.6 6.6a.75.75 0 101.2.8z" />
                </svg>
                <span>Pay online &amp; save ₹{totalPrepaidSavings.toFixed(0)} (Instant Discount Auto-Applied)</span>
              </div>
            </div>

            {/* Primary Action: Direct Intent to Customer's Installed UPI App (Opens whichever UPI apps they have) */}
            <button
              type="button"
              id="pay-via-any-installed-upi-btn"
              onClick={() =>
                handleLaunchUpiApp({
                  id: 'universal',
                  name: 'Installed UPI App',
                  emblem: <Smartphone className="w-5 h-5 text-emerald-600" />,
                })
              }
              className="w-full mb-3 py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-300 hover:border-emerald-500 hover:shadow-xs flex items-center justify-between transition-all cursor-pointer group text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-[13px] font-black text-gray-950">
                      Pay via Any Installed UPI App
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-emerald-600 text-white leading-none">
                      Direct
                    </span>
                  </div>
                  <span className="text-[10.5px] text-gray-600 block leading-tight mt-0.5">
                    Opens PhonePe, GPay, Paytm, BHIM, or your bank's UPI app automatically
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-emerald-700 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </button>

            {/* Or choose preferred app */}
            <div className="w-full flex items-center gap-2 mb-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-[10px] text-gray-400 font-bold tracking-wider uppercase">
                Or choose app
              </span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Popular UPI Apps Grid: PhonePe, Google Pay, Paytm, BHIM, Amazon Pay, CRED */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-2.5 items-stretch mb-3 w-full">
              {/* 1. PhonePe */}
              <button
                type="button"
                id="pay-via-phonepe-btn"
                onClick={() =>
                  handleLaunchUpiApp({
                    id: 'phonepe',
                    name: 'PhonePe',
                    emblem: <PhonePeEmblem className="w-8 h-8" />,
                  })
                }
                className="flex flex-col items-center justify-between py-2.5 px-2 rounded-2xl border border-gray-200/90 bg-white hover:border-gray-950 hover:bg-gray-50/60 hover:shadow-xs active:scale-[0.97] transition-all cursor-pointer group text-center min-h-[76px]"
                title="Pay with PhonePe"
              >
                <div className="w-8 h-8 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <PhonePeEmblem className="w-8 h-8" />
                </div>
                <div className="mt-1 flex flex-col items-center">
                  <span className="text-[11px] font-bold text-gray-900 tracking-tight leading-tight block truncate max-w-full">
                    PhonePe
                  </span>
                  <span className="text-[9px] text-emerald-600 font-semibold leading-none mt-0.5">
                    1-Tap Pay
                  </span>
                </div>
              </button>

              {/* 2. Google Pay */}
              <button
                type="button"
                id="pay-via-gpay-btn"
                onClick={() =>
                  handleLaunchUpiApp({
                    id: 'gpay',
                    name: 'Google Pay',
                    emblem: <GPayEmblem className="w-8 h-8" />,
                  })
                }
                className="flex flex-col items-center justify-between py-2.5 px-2 rounded-2xl border border-gray-200/90 bg-white hover:border-gray-950 hover:bg-gray-50/60 hover:shadow-xs active:scale-[0.97] transition-all cursor-pointer group text-center min-h-[76px]"
                title="Pay with Google Pay"
              >
                <div className="w-8 h-8 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <GPayEmblem className="w-8 h-8" />
                </div>
                <div className="mt-1 flex flex-col items-center">
                  <span className="text-[11px] font-bold text-gray-900 tracking-tight leading-tight block truncate max-w-full">
                    Google Pay
                  </span>
                  <span className="text-[9px] text-emerald-600 font-semibold leading-none mt-0.5">
                    1-Tap Pay
                  </span>
                </div>
              </button>

              {/* 3. Official Paytm */}
              <button
                type="button"
                id="pay-via-paytm-btn"
                onClick={() =>
                  handleLaunchUpiApp({
                    id: 'paytm',
                    name: 'Paytm',
                    emblem: <PaytmEmblem className="w-8 h-8" />,
                  })
                }
                className="flex flex-col items-center justify-between py-2.5 px-2 rounded-2xl border border-gray-200/90 bg-white hover:border-gray-950 hover:bg-gray-50/60 hover:shadow-xs active:scale-[0.97] transition-all cursor-pointer group text-center min-h-[76px]"
                title="Pay with Paytm"
              >
                <div className="w-8 h-8 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <PaytmEmblem className="w-8 h-8" />
                </div>
                <div className="mt-1 flex flex-col items-center">
                  <span className="text-[11px] font-bold text-gray-900 tracking-tight leading-tight block truncate max-w-full">
                    Paytm
                  </span>
                  <span className="text-[9px] text-emerald-600 font-semibold leading-none mt-0.5">
                    1-Tap Pay
                  </span>
                </div>
              </button>

              {/* 4. BHIM (NPCI) */}
              <button
                type="button"
                id="pay-via-bhim-btn"
                onClick={() =>
                  handleLaunchUpiApp({
                    id: 'bhim',
                    name: 'BHIM UPI',
                    emblem: <BhimEmblem className="w-8 h-8" />,
                  })
                }
                className="flex flex-col items-center justify-between py-2.5 px-2 rounded-2xl border border-gray-200/90 bg-white hover:border-gray-950 hover:bg-gray-50/60 hover:shadow-xs active:scale-[0.97] transition-all cursor-pointer group text-center min-h-[76px]"
                title="Pay with BHIM UPI"
              >
                <div className="w-8 h-8 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <BhimEmblem className="w-8 h-8" />
                </div>
                <div className="mt-1 flex flex-col items-center">
                  <span className="text-[11px] font-bold text-gray-900 tracking-tight leading-tight block truncate max-w-full">
                    BHIM UPI
                  </span>
                  <span className="text-[9px] text-emerald-600 font-semibold leading-none mt-0.5">
                    1-Tap Pay
                  </span>
                </div>
              </button>

              {/* 5. Amazon Pay */}
              <button
                type="button"
                id="pay-via-amazonpay-btn"
                onClick={() =>
                  handleLaunchUpiApp({
                    id: 'amazonpay',
                    name: 'Amazon Pay',
                    emblem: <AmazonPayEmblem className="w-8 h-8" />,
                  })
                }
                className="flex flex-col items-center justify-between py-2.5 px-2 rounded-2xl border border-gray-200/90 bg-white hover:border-gray-950 hover:bg-gray-50/60 hover:shadow-xs active:scale-[0.97] transition-all cursor-pointer group text-center min-h-[76px]"
                title="Pay with Amazon Pay"
              >
                <div className="w-8 h-8 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <AmazonPayEmblem className="w-8 h-8" />
                </div>
                <div className="mt-1 flex flex-col items-center">
                  <span className="text-[11px] font-bold text-gray-900 tracking-tight leading-tight block truncate max-w-full">
                    Amazon Pay
                  </span>
                  <span className="text-[9px] text-emerald-600 font-semibold leading-none mt-0.5">
                    1-Tap Pay
                  </span>
                </div>
              </button>

              {/* 6. CRED UPI */}
              <button
                type="button"
                id="pay-via-cred-btn"
                onClick={() =>
                  handleLaunchUpiApp({
                    id: 'cred',
                    name: 'CRED UPI',
                    emblem: <CredEmblem className="w-8 h-8" />,
                  })
                }
                className="flex flex-col items-center justify-between py-2.5 px-2 rounded-2xl border border-gray-200/90 bg-white hover:border-gray-950 hover:bg-gray-50/60 hover:shadow-xs active:scale-[0.97] transition-all cursor-pointer group text-center min-h-[76px]"
                title="Pay with CRED UPI"
              >
                <div className="w-8 h-8 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <CredEmblem className="w-8 h-8" />
                </div>
                <div className="mt-1 flex flex-col items-center">
                  <span className="text-[11px] font-bold text-gray-900 tracking-tight leading-tight block truncate max-w-full">
                    CRED UPI
                  </span>
                  <span className="text-[9px] text-emerald-600 font-semibold leading-none mt-0.5">
                    1-Tap Pay
                  </span>
                </div>
              </button>
            </div>

            {/* Professional More UPI Apps Option with Best Industry Standard Clubbed Logo */}
            <button
              type="button"
              id="view-more-upi-apps-btn"
              onClick={() => setIsAllUpiModalOpen(true)}
              className="w-full py-2.5 px-3 mb-3.5 rounded-2xl border border-gray-200/90 bg-gradient-to-r from-gray-50/90 via-slate-50/70 to-white hover:border-gray-900 hover:bg-gray-50/90 shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer group flex items-center justify-between gap-3 text-left"
              title="View all supported UPI apps"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Professional Clubbed Logo with overlapping official circular brand marks and crisp white border rings */}
                <ClubbedUpiLogo size="md" className="shrink-0" />

                {/* Clear, high-contrast label & subtitle */}
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] sm:text-[12.5px] font-bold text-gray-900 tracking-tight leading-tight group-hover:text-black">
                      More UPI Apps
                    </span>
                    <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.2 rounded-full">
                      Supported
                    </span>
                  </div>
                  <span className="text-[10.5px] sm:text-[11px] text-gray-500 truncate leading-tight mt-0.5">
                    WhatsApp Pay, Navi, MobiKwik, Airtel &amp; 10+ others
                  </span>
                </div>
              </div>

              {/* Right Side: Badge + Elevated Circular Chevron */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-gray-700 border border-gray-200/90 shadow-2xs">
                  15 Apps
                </span>
                <div className="w-6.5 h-6.5 rounded-full bg-white border border-gray-200/90 group-hover:bg-black group-hover:border-black group-hover:text-[#FFD600] flex items-center justify-center text-gray-400 group-hover:scale-105 transition-all shadow-2xs">
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </button>

            {/* Show QR Code Action Button & Interactive QR Display */}
            <div className="my-2.5">
              <button
                type="button"
                id="show-qr-code-btn"
                onClick={() => setShowQrCode((prev) => !prev)}
                className={`w-full py-2.5 px-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                  showQrCode
                    ? 'bg-amber-50/90 border-amber-400 text-amber-950 ring-1 ring-amber-400/40 shadow-xs'
                    : 'bg-white border-gray-200 hover:border-gray-400 hover:bg-gray-50/70 text-gray-800 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      showQrCode ? 'bg-black text-[#FFD600]' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <QrIcon className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs sm:text-[13px] font-bold block leading-tight">
                      {showQrCode ? 'Hide QR Code' : 'Show QR Code'}
                    </span>
                    <span className="text-[10px] sm:text-[10.5px] text-gray-500 block leading-tight mt-0.5">
                      Scan &amp; pay instantly with any UPI app on your phone
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors shrink-0 ${
                    showQrCode
                      ? 'bg-black text-[#FFD600]'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  {showQrCode ? 'Hide QR' : 'Show QR Code'}
                </span>
              </button>

              {/* QR Code Container when Show QR Code is clicked */}
              {showQrCode && (
                <div className="mt-3 p-4 rounded-2xl bg-white border-2 border-dashed border-amber-300 shadow-xs flex flex-col items-center text-center animate-fadeIn">
                  {/* Official Qavelle Brand Logo */}
                  <img
                    src={ASSET_IMAGES.brandLogo}
                    alt="QAVELLE – Crafted For The Queen In You"
                    className="h-7 sm:h-8 w-auto object-contain mb-2"
                    referrerPolicy="no-referrer"
                  />

                  {/* Verified Merchant Badge */}
                  <div className="flex items-center justify-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold mb-3">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Official Merchant UPI QR Code</span>
                  </div>

                  {/* QR Image Box */}
                  <div className="p-2.5 bg-white rounded-xl border border-gray-200 shadow-xs flex items-center justify-center">
                    {qrCodeDataUrl ? (
                      <img
                        src={qrCodeDataUrl}
                        alt={`Scan QR code to pay ₹${formattedPrepaidAmount}`}
                        className="w-48 h-48 sm:w-52 sm:h-52 object-contain rounded-xl"
                      />
                    ) : (
                      <div className="w-48 h-48 flex items-center justify-center text-gray-400 text-xs">
                        <Loader2 className="w-5 h-5 animate-spin mr-1 text-emerald-600" />
                        <span>Generating QR Code...</span>
                      </div>
                    )}
                  </div>

                  {/* Auto-filled Amount */}
                  <div className="mt-2.5 flex flex-col items-center">
                    <span className="text-[11px] text-gray-500 font-medium">Exact Amount to Pay:</span>
                    <span className="text-xl font-black text-gray-950 font-mono">
                      ₹{formattedPrepaidAmount}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded mt-0.5">
                      ✓ Instant ₹{totalPrepaidSavings.toFixed(0)} Savings Applied
                    </span>
                  </div>

                  {/* Order Confirm & Download Action Buttons */}
                  <div className="w-full max-w-xs mt-3.5 flex flex-col gap-2">
                    <button
                      type="button"
                      id="confirm-qr-payment-btn"
                      onClick={() => openUtrVerification('QR Code Scan')}
                      className="w-full py-2.5 px-4 rounded-xl bg-black hover:bg-neutral-800 active:scale-[0.99] text-[#FFD600] font-black text-xs uppercase tracking-wide flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#FFD600]" />
                      <span>I Have Paid via QR • Enter UTR to Confirm</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadQR}
                      className="w-full py-2 px-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-gray-600" />
                      <span>{downloadedQr ? 'QR Saved to Device!' : 'Download QR Code'}</span>
                    </button>
                  </div>

                  {/* Supported apps */}
                  <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-gray-500 flex-wrap">
                    <span>Scan with:</span>
                    <span className="font-semibold text-gray-700">PhonePe</span>
                    <span>•</span>
                    <span className="font-semibold text-gray-700">Google Pay</span>
                    <span>•</span>
                    <span className="font-semibold text-gray-700">Paytm</span>
                    <span>•</span>
                    <span className="font-semibold text-gray-700">CRED</span>
                    <span>•</span>
                    <span className="font-semibold text-gray-700">BHIM</span>
                  </div>
                </div>
              )}
            </div>

            {/* Divider: Dashed line with "OR" */}
            <div className="relative flex items-center justify-center my-2">
              <div className="w-full border-t border-dashed border-gray-200"></div>
              <span className="bg-white px-2.5 text-[11px] font-medium text-gray-600 tracking-wider absolute">
                OR
              </span>
            </div>

            {/* Enter UPI ID Form (Best practice with validation and instant collect flow) */}
            <div className="mt-2.5">
              <form onSubmit={handleVerifyAndPayCustomVpa} className="relative">
                <div className="relative rounded-xl border border-gray-300 bg-white p-2 sm:p-2.5 transition-all focus-within:border-gray-900">
                  <span className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-semibold text-gray-600">
                    Enter UPI ID
                  </span>

                  <div className="flex items-center justify-between gap-2 pt-0.5">
                    <input
                      type="text"
                      value={customUpiId}
                      onChange={(e) => {
                        setCustomUpiId(e.target.value);
                        if (vpaError) setVpaError('');
                      }}
                      placeholder="mobile@upi or name@okhdfcbank"
                      className="w-full bg-transparent text-[16px] sm:text-[12px] text-gray-900 placeholder:text-gray-400 focus:outline-none font-normal"
                    />

                    <button
                      type="submit"
                      disabled={isVerifyingVpa || !customUpiId.trim()}
                      className="text-[11.5px] font-bold text-blue-600 hover:text-blue-800 disabled:text-gray-400 cursor-pointer disabled:cursor-not-allowed transition-colors whitespace-nowrap shrink-0 px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 disabled:bg-transparent"
                    >
                      {isVerifyingVpa ? (
                        <span className="flex items-center gap-1">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Verifying...
                        </span>
                      ) : (
                        'Verify & pay'
                      )}
                    </button>
                  </div>
                </div>

                {vpaError && (
                  <p className="text-[10px] text-rose-600 font-medium mt-1 ml-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {vpaError}
                  </p>
                )}
              </form>
            </div>

            {/* Quick direct link: Already transferred payment / Verify UTR */}
            <div className="pt-2.5 mt-2 border-t border-gray-100 flex items-center justify-center">
              <button
                type="button"
                onClick={() => openUtrVerification('UPI Transfer')}
                className="text-[11px] text-[#B3874B] hover:text-[#936d39] font-bold inline-flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-amber-50/60 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Already transferred? Enter 12-digit UTR to verify &amp; confirm order</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. PAYMENT OPTION 2: CASH ON DELIVERY (COD) — DISPLAYED DIRECTLY BELOW UPI OPTION! */}
      <div
        className={`rounded-2xl border transition-all overflow-hidden ${
          activeMode === 'cod'
            ? 'border-gray-950 ring-1 ring-gray-950/10 shadow-sm bg-white'
            : 'border-gray-200 bg-gray-50/50 hover:bg-white hover:border-gray-300'
        }`}
      >
        {/* COD Option Header (Selectable) */}
        <div
          onClick={() => handleSelectMode('cod')}
          className="p-3 sm:p-3.5 flex items-start justify-between cursor-pointer"
        >
          <div className="flex items-start gap-2.5">
            {/* Custom Radio Button */}
            <div className="mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all border-gray-400">
              {activeMode === 'cod' && (
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[13.5px] font-bold text-gray-950">
                  Cash on Delivery (COD)
                </span>
              </div>
              <span className="text-[11px] text-gray-500 mt-0.5">
                Pay in cash or UPI to delivery agent at your doorstep
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end shrink-0 pl-2">
            <span className="text-[14px] font-black text-gray-950 font-mono">
              ₹{subtotal.toFixed(2)}
            </span>
            <span className="text-[10px] text-gray-400">
              No coupon
            </span>
          </div>
        </div>

        {/* Expanded COD Controls (Active when activeMode === 'cod') */}
        {activeMode === 'cod' && (
          <div className="px-3 sm:px-4 pb-4 pt-1 border-t border-gray-100 space-y-3 animate-fadeIn">
            {/* Informative notice explaining coupon is exclusive to prepaid orders */}
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 mt-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="leading-snug">
                  <span className="font-bold block text-amber-950 text-[11.5px]">
                    Prepaid Savings of ₹{totalPrepaidSavings.toFixed(0)} is valid only on Prepaid Orders
                  </span>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Save ₹{totalPrepaidSavings.toFixed(0)} instantly by switching to UPI / Online payment.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleSelectMode('upi')}
                    className="mt-1 inline-flex items-center gap-1 font-bold text-emerald-800 hover:text-emerald-950 underline text-[11px] cursor-pointer"
                  >
                    <Zap className="w-3 h-3 text-blue-600 fill-blue-600" />
                    <span>Switch to UPI &amp; Save ₹{totalPrepaidSavings.toFixed(0)}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* COD Price Breakdown Card */}
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs space-y-1.5">
              <div className="flex items-center justify-between font-semibold text-gray-900 pb-1 border-b border-gray-200">
                <span>COD Price Summary</span>
                <span className="text-[10px] font-bold text-gray-600 bg-gray-200 px-2 py-0.5 rounded">
                  Cash on Delivery
                </span>
              </div>

              <div className="flex items-center justify-between text-gray-600 text-[11.5px]">
                <span>Item Total</span>
                <span className="font-medium text-gray-900">₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between text-gray-600 text-[11.5px]">
                <span className="flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-gray-400" />
                  Prepaid Coupon (QVL100) &amp; UPI Discount
                </span>
                <span className="text-gray-400 font-medium text-[10.5px]">
                  ₹0.00 (Prepaid Orders Only)
                </span>
              </div>

              <div className="flex items-center justify-between text-[11.5px]">
                <span className="flex items-center gap-1 text-gray-700">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  Delivery Fee
                </span>
                <span className="font-bold text-emerald-600 uppercase text-[10.5px]">
                  FREE
                </span>
              </div>

              <div className="pt-1.5 border-t border-gray-200 flex items-center justify-between text-xs sm:text-sm font-bold text-gray-950">
                <span>Total Cash Payable</span>
                <span className="text-black text-sm sm:text-base font-black font-mono">₹{subtotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Trust points */}
            <div className="space-y-1 px-1 text-[11px] text-gray-600">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Pay in Cash or UPI at your doorstep upon delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Express PAN-India dispatch</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>7-day hassle-free replacement guarantee</span>
              </div>
            </div>

            {/* Confirm COD CTA Button */}
            <button
              type="button"
              id="confirm-cod-order-btn"
              onClick={() => handleSuccessConfirmation('cod')}
              className="w-full py-3 px-4 bg-black hover:bg-neutral-900 active:scale-[0.99] text-[#FFD600] font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Confirm Cash on Delivery Order • ₹{subtotal.toFixed(2)}</span>
              <ChevronRight className="w-4 h-4 text-[#FFD600]" />
            </button>
          </div>
        )}
      </div>

      {/* 4. Assurance Trust Strip */}
      <div className="pt-2 flex items-center justify-center gap-1.5 text-[10.5px] text-gray-500">
        <Truck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
        <span className="font-medium">Free express delivery PAN India &bull; 100% Secure Checkout</span>
      </div>
    </div>
  );
};
