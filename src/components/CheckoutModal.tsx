import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Truck,
  ArrowRight,
  ArrowLeft,
  Copy,
  User,
  Phone,
  Mail,
  MapPin,
  Building,
  Home,
  Check,
  AlertCircle,
  Sparkles,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  Gift,
  Lock,
  RotateCcw,
  Clock,
  Tag,
  Package,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, CouponCode } from '../types';
import { ASSET_IMAGES } from '../data/productData';
import { ModernPaymentSection } from './ModernPaymentSection';
import { recordLead } from '../services/leadService';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  appliedCoupon: CouponCode | null;
  onClearCart: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  appliedCoupon,
  onClearCart,
}) => {
  const [step, setStep] = useState<'address' | 'payment' | 'success'>('address');

  // Address form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [pincode, setPincode] = useState('');
  const [houseNo, setHouseNo] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [landmark, setLandmark] = useState('');
  const [addressType, setAddressType] = useState<'home' | 'work' | 'other'>('home');
  const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPinValidating, setIsPinValidating] = useState(false);

  // Payment - COD or Prepaid
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi'>('upi');
  const [utrNumber, setUtrNumber] = useState('');

  // Success state details - generated upfront for dynamic UPI barcode tracking
  const [orderId, setOrderId] = useState(() => `QVL-${Math.floor(100000 + Math.random() * 900000)}`);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<{
    orderId: string;
    totalAmount: number;
    paymentMethod: 'cod' | 'upi';
    utrNumber?: string;
    discountAmount: number;
    deliveryDate: string;
    itemsSummary: string;
    customerName: string;
    address: string;
    city: string;
    pincode: string;
  } | null>(null);

  const [copiedOrderId, setCopiedOrderId] = useState(false);
  const [showEmailField, setShowEmailField] = useState(false);

  // Dedicated scroll container reference to guarantee top view on all screen transitions
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
    const elem = document.getElementById('checkout-scroll-container');
    if (elem) {
      elem.scrollTop = 0;
    }
    // Also reset window/viewport scroll to prevent mobile Safari zoomed/scrolled offsets
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
      const el = document.getElementById('checkout-scroll-container');
      if (el) el.scrollTop = 0;
    });
  };

  // Lock body scroll while modal is open to prevent underlying page rubber-banding on mobile
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // When modal is reopened fresh, reset to address step
  useEffect(() => {
    if (isOpen && step === 'success') {
      setStep('address');
      setConfirmedOrder(null);
      setOrderId(`QVL-${Math.floor(100000 + Math.random() * 900000)}`);
    }
  }, [isOpen]);

  // When step changes or modal opens, immediately ensure top view (no center/below page section appears)
  useEffect(() => {
    if (isOpen) {
      scrollToTop();
    }
  }, [step, isOpen]);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.bundle.price * item.quantity,
    0
  );

  // Coupon is automatically applied ONLY on prepaid orders!
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
    } else {
      discountAmount = appliedCoupon.discountValue;
    }
  }

  // 100 coupon is for prepaid orders, 25 is UPI discount -> 100 + 25 saving (₹125 total)
  const couponDiscount = discountAmount > 0 ? discountAmount : 100;
  const upiDiscount = 25; // ₹25 instant UPI discount
  const totalPrepaidSavings = couponDiscount + upiDiscount; // ₹100 + ₹25 = ₹125

  // Active coupon & UPI discount based on payment method
  const activeCouponDiscount = paymentMethod === 'cod' ? 0 : couponDiscount;
  const activeUpiDiscount = paymentMethod === 'cod' ? 0 : upiDiscount;
  const activeTotalSavings = activeCouponDiscount + activeUpiDiscount;

  const finalTotal = paymentMethod === 'cod'
    ? subtotal
    : Math.max(0, subtotal - activeTotalSavings);
  const totalItemsCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  const fullAddress = [
    houseNo,
    street,
    landmark ? `Near ${landmark}` : '',
    city,
    state ? `${state} - ${pincode}` : pincode,
  ]
    .filter(Boolean)
    .join(', ');

  const handlePincodeAutoFill = (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 6);
    setPincode(clean);
    if (errors.pincode) setErrors((prev) => ({ ...prev, pincode: '' }));

    if (clean.length === 6) {
      setIsPinValidating(true);
      const pinMap: Record<string, { city: string; state: string }> = {
        '11': { city: 'New Delhi', state: 'Delhi' },
        '12': { city: 'Gurugram / Faridabad', state: 'Haryana' },
        '13': { city: 'Karnal / Ambala', state: 'Haryana' },
        '14': { city: 'Ludhiana / Jalandhar', state: 'Punjab' },
        '15': { city: 'Bathinda / Firozpur', state: 'Punjab' },
        '16': { city: 'Chandigarh', state: 'Punjab' },
        '17': { city: 'Shimla', state: 'Himachal Pradesh' },
        '18': { city: 'Jammu', state: 'Jammu & Kashmir' },
        '19': { city: 'Srinagar', state: 'Jammu & Kashmir' },
        '20': { city: 'Noida / Ghaziabad', state: 'Uttar Pradesh' },
        '21': { city: 'Prayagraj / Kanpur', state: 'Uttar Pradesh' },
        '22': { city: 'Lucknow', state: 'Uttar Pradesh' },
        '23': { city: 'Varanasi', state: 'Uttar Pradesh' },
        '24': { city: 'Dehradun / Haridwar', state: 'Uttarakhand' },
        '25': { city: 'Bareilly / Meerut', state: 'Uttar Pradesh' },
        '26': { city: 'Agra / Jhansi', state: 'Uttar Pradesh' },
        '27': { city: 'Gorakhpur', state: 'Uttar Pradesh' },
        '28': { city: 'Mathura / Aligarh', state: 'Uttar Pradesh' },
        '30': { city: 'Jaipur', state: 'Rajasthan' },
        '31': { city: 'Udaipur', state: 'Rajasthan' },
        '32': { city: 'Kota / Ajmer', state: 'Rajasthan' },
        '33': { city: 'Bikaner', state: 'Rajasthan' },
        '34': { city: 'Jodhpur', state: 'Rajasthan' },
        '36': { city: 'Rajkot', state: 'Gujarat' },
        '37': { city: 'Bhavnagar', state: 'Gujarat' },
        '38': { city: 'Ahmedabad', state: 'Gujarat' },
        '39': { city: 'Surat / Vadodara', state: 'Gujarat' },
        '40': { city: 'Mumbai', state: 'Maharashtra' },
        '41': { city: 'Pune', state: 'Maharashtra' },
        '42': { city: 'Nashik / Thane', state: 'Maharashtra' },
        '43': { city: 'Chhatrapati Sambhajinagar', state: 'Maharashtra' },
        '44': { city: 'Nagpur', state: 'Maharashtra' },
        '45': { city: 'Indore', state: 'Madhya Pradesh' },
        '46': { city: 'Bhopal', state: 'Madhya Pradesh' },
        '47': { city: 'Gwalior', state: 'Madhya Pradesh' },
        '48': { city: 'Jabalpur', state: 'Madhya Pradesh' },
        '49': { city: 'Raipur', state: 'Chhattisgarh' },
        '50': { city: 'Hyderabad', state: 'Telangana' },
        '51': { city: 'Tirupati', state: 'Andhra Pradesh' },
        '52': { city: 'Vijayawada / Guntur', state: 'Andhra Pradesh' },
        '53': { city: 'Visakhapatnam', state: 'Andhra Pradesh' },
        '56': { city: 'Bengaluru', state: 'Karnataka' },
        '57': { city: 'Mysuru / Mangaluru', state: 'Karnataka' },
        '58': { city: 'Hubballi', state: 'Karnataka' },
        '60': { city: 'Chennai', state: 'Tamil Nadu' },
        '61': { city: 'Thanjavur', state: 'Tamil Nadu' },
        '62': { city: 'Madurai', state: 'Tamil Nadu' },
        '63': { city: 'Salem / Erode', state: 'Tamil Nadu' },
        '64': { city: 'Coimbatore', state: 'Tamil Nadu' },
        '67': { city: 'Kozhikode', state: 'Kerala' },
        '68': { city: 'Kochi / Ernakulam', state: 'Kerala' },
        '69': { city: 'Thiruvananthapuram', state: 'Kerala' },
        '70': { city: 'Kolkata', state: 'West Bengal' },
        '71': { city: 'Durgapur / Asansol', state: 'West Bengal' },
        '72': { city: 'Siliguri', state: 'West Bengal' },
        '75': { city: 'Bhubaneswar / Cuttack', state: 'Odisha' },
        '78': { city: 'Guwahati', state: 'Assam' },
        '79': { city: 'Shillong', state: 'Meghalaya' },
        '80': { city: 'Patna', state: 'Bihar' },
        '81': { city: 'Bhagalpur', state: 'Bihar' },
        '82': { city: 'Muzaffarpur', state: 'Bihar' },
        '83': { city: 'Ranchi / Jamshedpur', state: 'Jharkhand' },
        '84': { city: 'Dhanbad', state: 'Jharkhand' },
      };

      const prefix = clean.substring(0, 2);
      if (pinMap[prefix]) {
        setCity(pinMap[prefix].city);
        setState(pinMap[prefix].state);
      }
      setTimeout(() => setIsPinValidating(false), 200);
    }
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Please enter your full name';
    if (!phone.trim()) {
      newErrors.phone = 'Please enter your 10-digit mobile number';
    } else if (phone.replace(/\D/g, '').length !== 10) {
      newErrors.phone = 'Mobile number must be exactly 10 digits';
    }
    if (!pincode.trim() || pincode.length !== 6) {
      newErrors.pincode = 'Please enter a valid 6-digit PIN code';
    }
    if (!houseNo.trim()) newErrors.houseNo = 'House / Flat number is required';
    if (!street.trim()) newErrors.street = 'Street or area name is required';
    if (!city.trim()) newErrors.city = 'City is required';
    if (!state.trim()) newErrors.state = 'State is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Focus on first error element
      const firstKey = Object.keys(newErrors)[0];
      const element = document.getElementById(`field-${firstKey}`);
      if (element) {
        element.focus();
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setErrors({});
    setStep('payment');
    scrollToTop();

    // Record early lead: Customer entered phone and delivery address
    const itemsSummary = cartItems
      .map((item) => `${item.bundle?.title || 'Jewelry'} x ${item.quantity}`)
      .join(', ');

    recordLead({
      orderId: orderId,
      timestamp: new Date().toISOString(),
      customerName: name,
      phone,
      email,
      address: fullAddress,
      city,
      state,
      pincode,
      items: itemsSummary || 'Jewelry Item',
      totalAmount: Math.round(finalTotal),
      paymentType: paymentMethod === 'upi' ? 'Prepaid UPI' : 'COD',
      paymentStatus: 'Awaiting Payment',
      utr: '',
      leadStage: 'Address Submitted',
    }).catch((err) => console.warn('Early lead capture warning:', err));
  };

  const handlePlaceOrder = (submittedUtr?: string, explicitPaymentMethod?: 'cod' | 'upi') => {
    const finalPaymentMethod = explicitPaymentMethod || paymentMethod;
    const finalId = orderId || `QVL-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(finalId);
    if (submittedUtr) {
      setUtrNumber(submittedUtr);
    }

    const estDate = new Date();
    estDate.setDate(estDate.getDate() + 3);
    const calculatedDeliveryDate = estDate.toLocaleDateString('en-IN', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
    setDeliveryDate(calculatedDeliveryDate);

    // Record confirmed order lead and stream to Google Sheets
    const itemsSummary = cartItems
      .map((item) => `${item.bundle?.title || 'Jewelry'} x ${item.quantity}`)
      .join(', ');

    // Calculate exact final total payable
    const payableAmount = Math.round(
      finalPaymentMethod === 'cod' ? subtotal : finalTotal
    );

    // Save snapshot of order before cart is cleared
    setConfirmedOrder({
      orderId: finalId,
      totalAmount: payableAmount,
      paymentMethod: finalPaymentMethod,
      utrNumber: submittedUtr || utrNumber || '',
      discountAmount: finalPaymentMethod === 'cod' ? 0 : discountAmount,
      deliveryDate: calculatedDeliveryDate,
      itemsSummary: itemsSummary || 'Jewelry Item',
      customerName: name || 'Customer',
      address: fullAddress,
      city,
      pincode,
    });

    try {
      recordLead({
        orderId: finalId,
        timestamp: new Date().toISOString(),
        customerName: name,
        phone,
        email,
        address: fullAddress,
        city,
        state,
        pincode,
        items: itemsSummary || 'Jewelry Item',
        totalAmount: payableAmount,
        paymentType: finalPaymentMethod === 'upi' ? 'Prepaid UPI' : 'COD',
        paymentStatus:
          finalPaymentMethod === 'upi'
            ? 'Payment Verified (UPI)'
            : 'Confirmed (Cash on Delivery)',
        utr: submittedUtr || utrNumber || '',
        leadStage: 'Completed Order',
      }).catch((err) => {
        console.warn('Webhook sync background note:', err);
      });
    } catch (e) {
      console.error('Error invoking recordLead:', e);
    }

    // Immediately advance to success view
    setStep('success');
    scrollToTop();

    // Confetti celebration
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FFC107', '#EAB308', '#000000', '#10B981', '#FFFFFF'],
      });
    } catch (e) {
      console.warn('Confetti effect ignored:', e);
    }

    onClearCart();
  };

  const handleCopyOrderId = () => {
    const idToCopy = confirmedOrder?.orderId || orderId;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(idToCopy).then(() => {
        setCopiedOrderId(true);
        setTimeout(() => setCopiedOrderId(false), 2000);
      }).catch(() => {});
    }
  };

  return (
    <div className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-xs flex flex-col sm:items-center sm:justify-center sm:p-4 md:p-6 animate-fadeIn overflow-hidden">
      <div
        className="bg-white w-full h-[100dvh] sm:h-auto sm:max-h-[92vh] max-w-2xl sm:rounded-3xl border-0 sm:border border-gray-200 shadow-2xl flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Luxury Header with SSL Badge & Official Brand Identity */}
        <div className="px-3.5 py-3 sm:px-6 sm:py-4 bg-[#0B0F19] text-white flex items-center justify-between border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="h-9 sm:h-11 px-2.5 sm:px-3 py-1 rounded-xl bg-white border border-amber-400/50 shadow-xs flex items-center justify-center shrink-0">
              <img
                src={ASSET_IMAGES.brandLogo}
                alt="QAVELLE – Crafted For The Queen In You"
                className="h-6 sm:h-8 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs sm:text-sm tracking-wide text-white">
                  EXPRESS CHECKOUT
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                  <Lock className="w-2.5 h-2.5" /> 256-Bit SSL Secured
                </span>
              </div>
              <p className="text-[10px] sm:text-[10.5px] text-gray-400 flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                <span>Official Direct Store &bull; Free Express Delivery</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Interactive Multi-Step Stepper Bar (Shopify / D2C Luxury Standard) */}
        {step !== 'success' && (
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 sm:px-6 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 sm:gap-3 w-full">
              {/* Step 1 Pill */}
              <button
                type="button"
                onClick={() => {
                  setStep('address');
                  scrollToTop();
                }}
                className={`flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
                  step === 'address'
                    ? 'text-gray-950'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10.5px] font-bold shrink-0 ${
                    step === 'address'
                      ? 'bg-black text-[#FFD600]'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {step === 'payment' ? <Check className="w-3 h-3" /> : '1'}
                </div>
                <span className="text-[11.5px] sm:text-xs whitespace-nowrap">
                  {step === 'payment' ? '1. Address (Edit)' : '1. Delivery Address'}
                </span>
              </button>

              <div className="flex-1 h-px bg-gray-300 max-w-[40px] sm:max-w-[60px]" />

              {/* Step 2 Pill */}
              <div
                className={`flex items-center gap-1.5 font-bold transition-all ${
                  step === 'payment'
                    ? 'text-gray-950'
                    : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10.5px] font-bold ${
                    step === 'payment'
                      ? 'bg-black text-[#FFD600]'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  2
                </div>
                <span className="text-[11.5px] sm:text-xs">2. Payment</span>
              </div>
            </div>

            {/* Reassurance pill */}
            <div className="hidden sm:flex items-center gap-1 text-[11px] text-emerald-800 font-bold bg-emerald-100/70 px-2 py-0.5 rounded-md shrink-0">
              <RotateCcw className="w-3 h-3 text-emerald-700" />
              <span>7-Day Replacement</span>
            </div>
          </div>
        )}

        {/* Collapsible Order Summary Drawer (Lets shopper review their jewelry items at all times) */}
        {step !== 'success' && (
          <div className="border-b border-gray-200/90 bg-white">
            <button
              type="button"
              id="toggle-checkout-order-summary"
              onClick={() => setIsOrderSummaryOpen(!isOrderSummaryOpen)}
              className="w-full px-4 py-2.5 sm:px-6 flex items-center justify-between hover:bg-gray-50/80 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-900 flex items-center justify-center">
                  <ShoppingBag className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                  <span>Order Items ({totalItemsCount})</span>
                  <span className="text-gray-400 font-medium text-[11px]">
                    {isOrderSummaryOpen ? 'Hide' : 'View'}
                  </span>
                  {isOrderSummaryOpen ? (
                    <ChevronUp className="w-3.5 h-3.5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {paymentMethod !== 'cod' ? (
                  <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                    SAVE ₹{totalPrepaidSavings}
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                    COD
                  </span>
                )}
                <span className="text-xs sm:text-sm font-black text-gray-950 font-mono">
                  ₹{finalTotal}
                </span>
              </div>
            </button>

            {isOrderSummaryOpen && (
              <div className="px-4 py-3 sm:px-6 bg-[#FAF8F5] border-t border-gray-100 space-y-2.5 animate-fadeIn">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-11 h-11 rounded-lg border border-gray-200 overflow-hidden bg-white shrink-0 relative">
                        <img
                          src={ASSET_IMAGES.hero}
                          alt={item.bundle.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <span className="absolute bottom-0 right-0 bg-black text-[#FFD600] text-[9px] font-bold px-1 rounded-tl">
                          x{item.quantity}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-gray-900 block truncate">
                          {item.bundle.title}
                        </span>
                        <span className="text-[10.5px] text-gray-500 block truncate">
                          {item.bundle.subtitle || 'Handcrafted & Sanctified with Ganga Jal'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-bold text-gray-900 block font-mono">
                        ₹{item.bundle.price * item.quantity}
                      </span>
                      {item.bundle.originalPrice && (
                        <span className="text-[10px] text-gray-400 line-through block font-mono">
                          ₹{item.bundle.originalPrice * item.quantity}
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {/* Pricing Summary */}
                <div className="pt-2 border-t border-gray-200/80 space-y-1 text-[11px]">
                  <div className="flex justify-between text-gray-600">
                    <span>Item Subtotal:</span>
                    <span className="font-semibold text-gray-900 font-mono">₹{subtotal}</span>
                  </div>
                  {paymentMethod !== 'cod' && (
                    <div className="flex justify-between text-emerald-800 font-bold bg-emerald-50/80 px-1.5 py-0.5 rounded border border-emerald-200/70">
                      <span>Total Savings:</span>
                      <span className="font-mono">-₹{totalPrepaidSavings}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Express Delivery:</span>
                    <span className="font-bold text-emerald-600 uppercase text-[10px]">FREE</span>
                  </div>
                  <div className="flex justify-between text-gray-950 font-black pt-1 border-t border-gray-200 text-xs">
                    <span>Total Payable:</span>
                    <span className="font-mono text-black">₹{finalTotal}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal Body */}
        <div
          ref={scrollContainerRef}
          id="checkout-scroll-container"
          className="flex-1 overflow-y-auto p-2.5 sm:p-5 bg-[#FCFBF9] overscroll-contain scroll-auto pb-4 sm:pb-6"
        >
          {/* STEP 1: ADDRESS */}
          {step === 'address' && (
            <form onSubmit={handleProceedToPayment} noValidate className="flex flex-col gap-2 sm:gap-2.5 text-xs">
              
              {/* CARD 1: Contact Details */}
              <div className="bg-white rounded-xl border border-gray-200/90 shadow-2xs p-2.5 sm:p-3.5 flex flex-col gap-2">
                <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
                  <div className="flex items-center gap-1.5 font-bold text-gray-950 text-xs sm:text-sm">
                    <User className="w-3.5 h-3.5 text-amber-900" />
                    <span>Contact Details</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowEmailField((prev) => !prev)}
                    className="text-[10.5px] text-blue-600 font-semibold hover:underline cursor-pointer"
                  >
                    {showEmailField ? 'Hide Email' : '+ Add Email (Optional)'}
                  </button>
                </div>

                {/* Name & Mobile Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                  {/* Full Name */}
                  <div>
                    <label className="flex items-center justify-between font-bold text-gray-700 text-[11px] mb-0.5">
                      <span>Full Name <span className="text-rose-500">*</span></span>
                      {name.trim() && (
                        <span className="text-emerald-600 text-[9.5px] font-semibold flex items-center gap-0.5">
                          <Check className="w-2.5 h-2.5" /> Valid
                        </span>
                      )}
                    </label>
                    <input
                      id="field-name"
                      type="text"
                      autoComplete="name"
                      autoCapitalize="words"
                      enterKeyHint="next"
                      placeholder="e.g. Rahul Sharma"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors((p) => ({ ...p, name: '' }));
                      }}
                      className={`w-full px-3 py-2 sm:py-2 rounded-lg border bg-gray-50/50 text-gray-900 text-[16px] sm:text-xs focus:bg-white focus:outline-none transition-all ${
                        errors.name
                          ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 ring-1 ring-rose-200'
                          : 'border-gray-200 focus:border-black focus:ring-1 focus:ring-black/10'
                      }`}
                    />
                    {errors.name && (
                      <p className="text-[10px] text-rose-600 font-semibold mt-0.5 flex items-center gap-1">
                        <AlertCircle className="w-2.5 h-2.5 shrink-0" />
                        <span>{errors.name}</span>
                      </p>
                    )}
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="flex items-center justify-between font-bold text-gray-700 text-[11px] mb-0.5">
                      <span>Mobile Number <span className="text-rose-500">*</span></span>
                      {phone.length === 10 && (
                        <span className="text-emerald-600 text-[9.5px] font-semibold flex items-center gap-0.5">
                          <Check className="w-2.5 h-2.5" /> 10 Digits
                        </span>
                      )}
                    </label>
                    <div className="flex rounded-lg overflow-hidden border border-gray-200 focus-within:border-black focus-within:ring-1 focus-within:ring-black/10 transition-all">
                      <span className="inline-flex items-center px-2 bg-gray-100 border-r border-gray-200 font-bold text-gray-700 text-xs gap-1 shrink-0">
                        <svg className="w-3.5 h-2.5 shrink-0 rounded-2xs" viewBox="0 0 640 480" aria-label="India flag">
                          <path fill="#FF9933" d="M0 0h640v160H0z" />
                          <path fill="#FFFFFF" d="M0 160h640v160H0z" />
                          <path fill="#128807" d="M0 320h640v160H0z" />
                          <circle cx="320" cy="240" r="28" fill="#000088" />
                          <circle cx="320" cy="240" r="23" fill="#FFFFFF" />
                          <circle cx="320" cy="240" r="6" fill="#000088" />
                        </svg>
                        <span className="text-[11px]">+91</span>
                      </span>
                      <input
                        id="field-phone"
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={10}
                        autoComplete="tel-national"
                        enterKeyHint="next"
                        placeholder="9876543210"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value.replace(/\D/g, ''));
                          if (errors.phone) setErrors((p) => ({ ...p, phone: '' }));
                        }}
                        className={`w-full px-2.5 py-2 sm:py-2 bg-gray-50/50 text-gray-900 text-[16px] sm:text-xs font-mono focus:bg-white focus:outline-none ${
                          errors.phone ? 'border-rose-400 bg-rose-50/30' : ''
                        }`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-[10px] text-rose-600 font-semibold mt-0.5 flex items-center gap-1">
                        <AlertCircle className="w-2.5 h-2.5 shrink-0" />
                        <span>{errors.phone}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Optional Email Address */}
                {(showEmailField || email) && (
                  <div className="pt-1 animate-fadeIn">
                    <label className="flex items-center justify-between font-bold text-gray-700 text-[11px] mb-0.5">
                      <span>Email Address <span className="text-gray-400 font-normal">(For Tax Invoice)</span></span>
                      <span className="text-gray-400 text-[9.5px]">Optional</span>
                    </label>
                    <input
                      id="field-email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      autoCapitalize="none"
                      enterKeyHint="next"
                      placeholder="rahul@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-1.5 sm:py-2 rounded-lg border border-gray-200 bg-gray-50/50 text-gray-900 text-[16px] sm:text-xs focus:bg-white focus:outline-none focus:border-black transition-all"
                    />
                  </div>
                )}
              </div>

              {/* CARD 2: Delivery Address */}
              <div className="bg-white rounded-xl border border-gray-200/90 shadow-2xs p-2.5 sm:p-3.5 flex flex-col gap-2">
                <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
                  <div className="flex items-center gap-1.5 font-bold text-gray-950 text-xs sm:text-sm">
                    <MapPin className="w-3.5 h-3.5 text-amber-900" />
                    <span>Delivery Address</span>
                  </div>
                  {/* Compact Address Type Pills */}
                  <div className="flex items-center gap-1">
                    {(['home', 'work', 'other'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setAddressType(type)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize transition-all cursor-pointer ${
                          addressType === type
                            ? 'bg-black text-[#FFD600]'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pincode & City (2-Column Grid on all viewports) */}
                <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                  {/* Pincode */}
                  <div>
                    <label className="flex items-center justify-between font-bold text-gray-700 text-[11px] mb-0.5">
                      <span>Pincode <span className="text-rose-500">*</span></span>
                      {pincode.length === 6 && (
                        <span className="text-emerald-600 text-[9.5px] font-semibold">✓</span>
                      )}
                    </label>
                    <input
                      id="field-pincode"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      autoComplete="postal-code"
                      enterKeyHint="next"
                      placeholder="6-digit PIN"
                      value={pincode}
                      onChange={(e) => handlePincodeAutoFill(e.target.value)}
                      className={`w-full px-2.5 py-2 sm:py-2 rounded-lg border font-mono font-bold bg-gray-50/50 text-gray-900 text-[16px] sm:text-xs focus:bg-white focus:outline-none transition-all ${
                        errors.pincode
                          ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                          : 'border-gray-200 focus:border-black'
                      }`}
                    />
                    {errors.pincode && (
                      <p className="text-[9.5px] text-rose-600 font-semibold mt-0.5">
                        {errors.pincode}
                      </p>
                    )}
                  </div>

                  {/* City */}
                  <div>
                    <label className="flex items-center justify-between font-bold text-gray-700 text-[11px] mb-0.5">
                      <span>City / Town <span className="text-rose-500">*</span></span>
                      {city && (
                        <span className="text-gray-400 text-[9.5px]">Auto</span>
                      )}
                    </label>
                    <input
                      id="field-city"
                      type="text"
                      autoComplete="address-level2"
                      enterKeyHint="next"
                      placeholder="e.g. New Delhi"
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        if (errors.city) setErrors((p) => ({ ...p, city: '' }));
                      }}
                      className={`w-full px-2.5 py-2 sm:py-2 rounded-lg border bg-gray-50/50 text-gray-900 text-[16px] sm:text-xs focus:bg-white focus:outline-none transition-all ${
                        errors.city
                          ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                          : 'border-gray-200 focus:border-black'
                      }`}
                    />
                    {errors.city && (
                      <p className="text-[9.5px] text-rose-600 font-semibold mt-0.5">
                        {errors.city}
                      </p>
                    )}
                  </div>
                </div>

                {/* Flat/House No & Street/Area */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                  <div>
                    <label className="block font-bold text-gray-700 text-[11px] mb-0.5">
                      Flat / House No., Building <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="field-houseNo"
                      type="text"
                      autoComplete="address-line1"
                      enterKeyHint="next"
                      placeholder="e.g. Flat 402, Surya Tower"
                      value={houseNo}
                      onChange={(e) => {
                        setHouseNo(e.target.value);
                        if (errors.houseNo) setErrors((p) => ({ ...p, houseNo: '' }));
                      }}
                      className={`w-full px-2.5 py-2 sm:py-2 rounded-lg border bg-gray-50/50 text-gray-900 text-[16px] sm:text-xs focus:bg-white focus:outline-none transition-all ${
                        errors.houseNo
                          ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                          : 'border-gray-200 focus:border-black'
                      }`}
                    />
                    {errors.houseNo && (
                      <p className="text-[9.5px] text-rose-600 font-semibold mt-0.5">
                        {errors.houseNo}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 text-[11px] mb-0.5">
                      Street / Area / Locality <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="field-street"
                      type="text"
                      autoComplete="address-line2"
                      enterKeyHint="next"
                      placeholder="e.g. Sector 62, Near IT Park"
                      value={street}
                      onChange={(e) => {
                        setStreet(e.target.value);
                        if (errors.street) setErrors((p) => ({ ...p, street: '' }));
                      }}
                      className={`w-full px-2.5 py-2 sm:py-2 rounded-lg border bg-gray-50/50 text-gray-900 text-[16px] sm:text-xs focus:bg-white focus:outline-none transition-all ${
                        errors.street
                          ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                          : 'border-gray-200 focus:border-black'
                      }`}
                    />
                    {errors.street && (
                      <p className="text-[9.5px] text-rose-600 font-semibold mt-0.5">
                        {errors.street}
                      </p>
                    )}
                  </div>
                </div>

                {/* State & Landmark */}
                <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                  <div>
                    <label className="flex items-center justify-between font-bold text-gray-700 text-[11px] mb-0.5">
                      <span>State <span className="text-rose-500">*</span></span>
                      {state && (
                        <span className="text-gray-400 text-[9.5px]">Auto</span>
                      )}
                    </label>
                    <input
                      id="field-state"
                      type="text"
                      autoComplete="address-level1"
                      enterKeyHint="next"
                      placeholder="e.g. Delhi"
                      value={state}
                      onChange={(e) => {
                        setState(e.target.value);
                        if (errors.state) setErrors((p) => ({ ...p, state: '' }));
                      }}
                      className={`w-full px-2.5 py-2 sm:py-2 rounded-lg border bg-gray-50/50 text-gray-900 text-[16px] sm:text-xs focus:bg-white focus:outline-none transition-all ${
                        errors.state
                          ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                          : 'border-gray-200 focus:border-black'
                      }`}
                    />
                    {errors.state && (
                      <p className="text-[9.5px] text-rose-600 font-semibold mt-0.5">
                        {errors.state}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center justify-between font-bold text-gray-700 text-[11px] mb-0.5">
                      <span>Landmark</span>
                      <span className="text-gray-400 text-[9.5px]">Optional</span>
                    </label>
                    <input
                      id="field-landmark"
                      type="text"
                      enterKeyHint="done"
                      placeholder="e.g. Near Shiv Mandir"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      className="w-full px-2.5 py-2 sm:py-2 rounded-lg border border-gray-200 bg-gray-50/50 text-gray-900 text-[16px] sm:text-xs focus:bg-white focus:outline-none focus:border-black transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Precise Trust Line (Free Velvet Box and 100% Authentic removed) */}
              <div className="flex items-center justify-center gap-3 py-0.5 text-[10.5px] text-gray-600 font-medium">
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <Truck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  Free Express Delivery
                </span>
                <span className="text-gray-300">&bull;</span>
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <RotateCcw className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  7-Day Replacement
                </span>
              </div>

              {/* Order Summary & Proceed to Pay CTA (In-flow, NOT fixed or sticky) */}
              <div className="p-2.5 sm:p-3.5 rounded-xl bg-gradient-to-r from-amber-50/90 via-[#FFFDF8] to-amber-50/70 border border-amber-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 mt-0.5">
                <div className="flex items-center justify-between sm:justify-start gap-2 flex-wrap">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[11px] text-gray-500 font-medium">To Pay:</span>
                    <span className="font-black text-gray-950 text-base font-mono">
                      ₹{subtotal - totalPrepaidSavings}
                    </span>
                  </div>
                  <span className="text-[9.5px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded shadow-2xs">
                    SAVE ₹{totalPrepaidSavings}
                  </span>
                  <span className="text-[10px] text-gray-500 hidden xs:inline">
                    &bull; Free Express Delivery
                  </span>
                </div>

                <button
                  type="submit"
                  id="checkout-proceed-to-pay-btn"
                  className="w-full sm:w-auto py-2.5 px-6 bg-black hover:bg-neutral-800 active:scale-[0.99] text-[#FFD600] font-black text-xs sm:text-sm tracking-wide uppercase rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer shrink-0 transition-all whitespace-nowrap min-h-[44px]"
                >
                  <span>Proceed to Pay</span>
                  <ArrowRight className="w-4 h-4 text-[#FFD600]" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: PAYMENT METHOD */}
          {step === 'payment' && (
            <ModernPaymentSection
              subtotal={subtotal}
              discountAmount={discountAmount}
              appliedCouponCode={appliedCoupon?.code}
              orderId={orderId}
              customerName={name}
              customerPhone={phone}
              deliveryAddress={fullAddress}
              paymentMethod={paymentMethod}
              onPaymentMethodChange={(m) => setPaymentMethod(m)}
              onBackToAddress={() => {
                setStep('address');
                scrollToTop();
              }}
              onPaymentComplete={(method, txnDetails) => {
                const finalMethod = method === 'cod' ? 'cod' : 'upi';
                setPaymentMethod(finalMethod);
                if (txnDetails?.utr) setUtrNumber(txnDetails.utr);
                handlePlaceOrder(txnDetails?.utr, finalMethod);
              }}
            />
          )}

          {/* STEP 3: SUCCESS CONFIRMATION */}
          {step === 'success' && (
            <div className="text-center flex flex-col items-center gap-3.5 py-2 animate-fadeIn text-xs">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-700 flex items-center justify-center shadow-lg animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <img
                  src={ASSET_IMAGES.brandLogo}
                  alt="QAVELLE – Crafted For The Queen In You"
                  className="h-9 sm:h-11 mx-auto object-contain mb-2"
                  referrerPolicy="no-referrer"
                />
                <span className="inline-block px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[11px] uppercase tracking-wider mb-1">
                  Handcrafted Order Confirmed
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-gray-950">
                  Thank You, {confirmedOrder?.customerName || name || 'Customer'}!
                </h3>
                <p className="text-xs text-gray-600 mt-1 max-w-md mx-auto">
                  Your QAVELLE handcrafted jewelry is being carefully prepared for express dispatch.
                </p>
              </div>

              {/* Order Visual Tracking Milestone Tracker */}
              <div className="w-full p-3.5 rounded-2xl bg-white border border-gray-200 shadow-2xs text-left">
                <span className="text-[11px] font-bold text-gray-700 block mb-2.5">
                  Order Dispatch Roadmap
                </span>
                <div className="grid grid-cols-4 gap-1 text-center relative">
                  {/* Step 1 */}
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold mb-1">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-900 leading-tight">Confirmed</span>
                    <span className="text-[9px] text-emerald-700 font-medium">Today</span>
                  </div>

                  {/* Step 2 */}
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-900 leading-tight">Sanctifying</span>
                    <span className="text-[9px] text-gray-500 font-medium">In Progress</span>
                  </div>

                  {/* Step 3 */}
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-[10px] font-bold mb-1">
                      <Truck className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-700 leading-tight">Express Air</span>
                    <span className="text-[9px] text-gray-500 font-medium">Tomorrow</span>
                  </div>

                  {/* Step 4 */}
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-amber-400 text-black flex items-center justify-center text-[10px] font-bold mb-1">
                      <Package className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-900 leading-tight">Delivery</span>
                    <span className="text-[9px] text-amber-800 font-bold">{confirmedOrder?.deliveryDate || deliveryDate}</span>
                  </div>
                </div>
              </div>

              {/* Order Details Card */}
              <div className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 text-left flex flex-col gap-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <div>
                    <span className="text-gray-500 block text-[10px]">Order Tracking ID:</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <strong className="text-sm sm:text-base text-gray-950 font-mono font-bold tracking-wide">
                        {confirmedOrder?.orderId || orderId}
                      </strong>
                      <button
                        type="button"
                        onClick={handleCopyOrderId}
                        className="inline-flex items-center gap-1 text-[10.5px] font-bold text-gray-700 hover:text-black bg-white hover:bg-gray-100 border border-gray-300 px-2 py-0.5 rounded-lg cursor-pointer transition-colors shadow-2xs"
                        title="Copy Order ID"
                      >
                        {copiedOrderId ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-gray-500" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
                    {(confirmedOrder?.paymentMethod || paymentMethod) === 'cod' ? 'COD Confirmed' : 'Paid via UPI (Prepaid)'}
                  </span>
                </div>

                {(confirmedOrder?.paymentMethod || paymentMethod) === 'upi' ? (
                  <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 flex flex-col gap-1.5 text-[11.5px]">
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-900 font-semibold">Payment Mode:</span>
                      <strong className="text-emerald-950 font-bold">UPI Instant Payment (Prepaid)</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-900 font-semibold">Prepaid Savings:</span>
                      <span className="font-bold font-mono text-emerald-800">✓ ₹{totalPrepaidSavings} Saved</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-900 font-semibold">Payment Status:</span>
                      <span className="font-bold text-emerald-700">Verified &amp; Approved</span>
                    </div>
                    {(confirmedOrder?.utrNumber || utrNumber) && (
                      <div className="flex items-center justify-between">
                        <span className="text-emerald-900 font-semibold">Verified UTR / Ref No:</span>
                        <span className="font-mono text-emerald-950 font-bold">UTR #{confirmedOrder?.utrNumber || utrNumber}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-amber-50/90 border border-amber-200 flex flex-col gap-1.5 text-[11.5px]">
                    <div className="flex items-center justify-between">
                      <span className="text-amber-900 font-semibold">Payment Mode:</span>
                      <strong className="text-amber-950 font-bold">Cash on Delivery (Pay at Doorstep)</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-amber-900 font-semibold">Cash to Pay:</span>
                      <strong className="text-amber-950 font-bold font-mono">₹{confirmedOrder?.totalAmount ?? finalTotal}</strong>
                    </div>
                    <p className="text-[10px] text-amber-800 mt-0.5">
                      Please keep exact cash ready upon delivery.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-gray-500 block text-[10px]">Estimated Delivery:</span>
                    <strong className="text-xs text-gray-900 flex items-center gap-1 mt-0.5">
                      <Truck className="w-3.5 h-3.5 text-amber-700" />
                      {confirmedOrder?.deliveryDate || deliveryDate}
                    </strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">Delivering To:</span>
                    <p className="text-gray-900 font-medium truncate mt-0.5">
                      {confirmedOrder?.address || fullAddress}
                    </p>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-gray-200 flex items-center justify-between text-gray-800">
                  <span className="font-semibold">Total Amount:</span>
                  <span className="text-base font-black text-black font-mono">₹{confirmedOrder?.totalAmount ?? finalTotal}</span>
                </div>
              </div>

              {/* WhatsApp Notification Card */}
              <div className="w-full p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-left flex items-start gap-2.5 text-xs text-emerald-950">
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                  ✓
                </div>
                <div>
                  <strong className="block text-emerald-950 text-xs font-bold">Order Confirmation Dispatched</strong>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    Delivery updates &amp; live courier tracking will be sent to your WhatsApp: <strong>+91 {phone || 'registered number'}</strong>.
                  </p>
                </div>
              </div>

              {/* Action Button: Mobile-First Single Prominent CTA */}
              <div className="w-full pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full min-h-[48px] py-3.5 px-6 rounded-xl bg-black hover:bg-neutral-800 active:scale-[0.99] text-[#FFD600] font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  <span>Continue Shopping</span>
                  <ArrowRight className="w-4 h-4 text-[#FFD600]" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
