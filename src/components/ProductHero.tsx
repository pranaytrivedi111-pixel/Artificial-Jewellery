import React, { useState, useEffect, useRef } from 'react';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Gift,
  X,
  Zap,
  ChevronLeft,
  ChevronRight,
  Flame,
  Eye,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { BundleOption, ProductDetails, ProductId } from '../types';
import {
  PRODUCT_GALLERY,
  BUNDLE_OPTIONS,
  AVAILABLE_COUPONS,
  REVIEWS_LIST,
  ASSET_IMAGES,
  PRODUCT_DETAILS,
  PRODUCT_HIGHLIGHTS,
  ADDITIONAL_DETAILS,
  CHOKER_PRODUCT_DETAILS,
  CHOKER_PRODUCT_GALLERY,
  CHOKER_PRODUCT_HIGHLIGHTS,
  CHOKER_ADDITIONAL_DETAILS,
  CHOKER_BUNDLE_OPTIONS,
  CHOKER_REVIEWS_LIST,
  COMBO5_PRODUCT_DETAILS,
  COMBO5_PRODUCT_GALLERY,
  COMBO5_PRODUCT_HIGHLIGHTS,
  COMBO5_ADDITIONAL_DETAILS,
  COMBO5_BUNDLE_OPTIONS,
  COMBO5_REVIEWS_LIST,
  SHIMMERING_PRODUCT_DETAILS,
  SHIMMERING_PRODUCT_GALLERY,
  SHIMMERING_PRODUCT_HIGHLIGHTS,
  SHIMMERING_ADDITIONAL_DETAILS,
  SHIMMERING_BUNDLE_OPTIONS,
  SHIMMERING_REVIEWS_LIST,
  ELEGANT_EVERYDAY_PRODUCT_DETAILS,
  ELEGANT_EVERYDAY_PRODUCT_GALLERY,
  ELEGANT_EVERYDAY_PRODUCT_HIGHLIGHTS,
  ELEGANT_EVERYDAY_ADDITIONAL_DETAILS,
  ELEGANT_EVERYDAY_BUNDLE_OPTIONS,
  ELEGANT_EVERYDAY_REVIEWS_LIST,
  RADHIKA_GREEN_AD_PRODUCT_DETAILS,
  RADHIKA_GREEN_AD_PRODUCT_GALLERY,
  RADHIKA_GREEN_AD_PRODUCT_HIGHLIGHTS,
  RADHIKA_GREEN_AD_ADDITIONAL_DETAILS,
  RADHIKA_GREEN_AD_BUNDLE_OPTIONS,
  RADHIKA_GREEN_AD_REVIEWS_LIST,
  ALLURE_GOLD_SET_PRODUCT_DETAILS,
  ALLURE_GOLD_SET_PRODUCT_GALLERY,
  ALLURE_GOLD_SET_PRODUCT_HIGHLIGHTS,
  ALLURE_GOLD_SET_ADDITIONAL_DETAILS,
  ALLURE_GOLD_SET_BUNDLE_OPTIONS,
  ALLURE_GOLD_SET_REVIEWS_LIST,
  TRENDY_ALLOY_SET_PRODUCT_DETAILS,
  TRENDY_ALLOY_SET_PRODUCT_GALLERY,
  TRENDY_ALLOY_SET_PRODUCT_HIGHLIGHTS,
  TRENDY_ALLOY_SET_ADDITIONAL_DETAILS,
  TRENDY_ALLOY_SET_BUNDLE_OPTIONS,
  TRENDY_ALLOY_SET_REVIEWS_LIST,
} from '../data/productData';
import {
  GPayLogo,
  PhonePeLogo,
  PaytmLogo,
} from './PaymentLogos';

interface ProductHeroProps {
  selectedBundle: BundleOption;
  onSelectBundle: (bundle: BundleOption) => void;
  onAddToCart?: (bundle: BundleOption) => void;
  onBuyNow: (bundle: BundleOption) => void;
  activeProductId?: ProductId;
  onSwitchProduct?: (productId: ProductId) => void;
  onNavigateHome?: () => void;
  children?: React.ReactNode;
}

export const ProductHero: React.FC<ProductHeroProps> = ({
  selectedBundle,
  onSelectBundle,
  onAddToCart,
  onBuyNow,
  activeProductId = 'jhumka',
  onSwitchProduct,
  onNavigateHome,
  children,
}) => {
  const isChoker = activeProductId === 'choker';
  const isShimmering = activeProductId === 'necklace-combo-5';
  const isElegantEveryday = activeProductId === 'elegant-everyday-5';
  const isCombo5 = isShimmering || isElegantEveryday;
  const isRadhikaGreen = activeProductId === 'radhika-green-ad';
  const isAllureGold = activeProductId === 'allure-gold-set';
  const isTrendyAlloy = activeProductId === 'trendy-alloy-set';

  const currentProduct: ProductDetails = isTrendyAlloy
    ? TRENDY_ALLOY_SET_PRODUCT_DETAILS
    : isAllureGold
    ? ALLURE_GOLD_SET_PRODUCT_DETAILS
    : isRadhikaGreen
    ? RADHIKA_GREEN_AD_PRODUCT_DETAILS
    : isElegantEveryday
    ? ELEGANT_EVERYDAY_PRODUCT_DETAILS
    : isShimmering
    ? SHIMMERING_PRODUCT_DETAILS
    : isChoker
    ? CHOKER_PRODUCT_DETAILS
    : PRODUCT_DETAILS;

  const currentGallery = isTrendyAlloy
    ? TRENDY_ALLOY_SET_PRODUCT_GALLERY
    : isAllureGold
    ? ALLURE_GOLD_SET_PRODUCT_GALLERY
    : isRadhikaGreen
    ? RADHIKA_GREEN_AD_PRODUCT_GALLERY
    : isElegantEveryday
    ? ELEGANT_EVERYDAY_PRODUCT_GALLERY
    : isShimmering
    ? SHIMMERING_PRODUCT_GALLERY
    : isChoker
    ? CHOKER_PRODUCT_GALLERY
    : PRODUCT_GALLERY;

  const currentHighlights = isTrendyAlloy
    ? TRENDY_ALLOY_SET_PRODUCT_HIGHLIGHTS
    : isAllureGold
    ? ALLURE_GOLD_SET_PRODUCT_HIGHLIGHTS
    : isRadhikaGreen
    ? RADHIKA_GREEN_AD_PRODUCT_HIGHLIGHTS
    : isElegantEveryday
    ? ELEGANT_EVERYDAY_PRODUCT_HIGHLIGHTS
    : isShimmering
    ? SHIMMERING_PRODUCT_HIGHLIGHTS
    : isChoker
    ? CHOKER_PRODUCT_HIGHLIGHTS
    : PRODUCT_HIGHLIGHTS;

  const currentAdditionalDetails = isTrendyAlloy
    ? TRENDY_ALLOY_SET_ADDITIONAL_DETAILS
    : isAllureGold
    ? ALLURE_GOLD_SET_ADDITIONAL_DETAILS
    : isRadhikaGreen
    ? RADHIKA_GREEN_AD_ADDITIONAL_DETAILS
    : isElegantEveryday
    ? ELEGANT_EVERYDAY_ADDITIONAL_DETAILS
    : isShimmering
    ? SHIMMERING_ADDITIONAL_DETAILS
    : isChoker
    ? CHOKER_ADDITIONAL_DETAILS
    : ADDITIONAL_DETAILS;

  const currentBundleOptions = isTrendyAlloy
    ? TRENDY_ALLOY_SET_BUNDLE_OPTIONS
    : isAllureGold
    ? ALLURE_GOLD_SET_BUNDLE_OPTIONS
    : isRadhikaGreen
    ? RADHIKA_GREEN_AD_BUNDLE_OPTIONS
    : isElegantEveryday
    ? ELEGANT_EVERYDAY_BUNDLE_OPTIONS
    : isShimmering
    ? SHIMMERING_BUNDLE_OPTIONS
    : isChoker
    ? CHOKER_BUNDLE_OPTIONS
    : BUNDLE_OPTIONS;

  const currentReviewsList = isTrendyAlloy
    ? TRENDY_ALLOY_SET_REVIEWS_LIST
    : isAllureGold
    ? ALLURE_GOLD_SET_REVIEWS_LIST
    : isRadhikaGreen
    ? RADHIKA_GREEN_AD_REVIEWS_LIST
    : isElegantEveryday
    ? ELEGANT_EVERYDAY_REVIEWS_LIST
    : isShimmering
    ? SHIMMERING_REVIEWS_LIST
    : isChoker
    ? CHOKER_REVIEWS_LIST
    : REVIEWS_LIST;

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Reset active image when product switches
  useEffect(() => {
    setActiveImageIndex(0);
  }, [activeProductId, isChoker, isCombo5, isRadhikaGreen, isAllureGold, isTrendyAlloy]);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [isOfferExpanded, setIsOfferExpanded] = useState(true);
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [pincode, setPincode] = useState('');

  const [pincodeStatus, setPincodeStatus] = useState<{
    checked: boolean;
    valid?: boolean;
    city?: string;
    date?: string;
  }>({ checked: false });
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  // Live real-time offer countdown timer (01 hr : 42 min : 00 sec)
  const [timeLeft, setTimeLeft] = useState({
    hours: 1,
    minutes: 42,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 1, minutes: 42, seconds: 0 }; // Reset
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Touch swipe support for mobile carousel
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const activeImage = currentGallery[activeImageIndex] || currentGallery[0];

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setActiveImageIndex((prev) => (prev + 1) % currentGallery.length);
    } else if (isRightSwipe) {
      setActiveImageIndex((prev) => (prev === 0 ? currentGallery.length - 1 : prev - 1));
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.length < 6) return;

    const metroPincodes: Record<string, string> = {
      '11': 'Delhi NCR',
      '40': 'Mumbai, Maharashtra',
      '56': 'Bengaluru, Karnataka',
      '50': 'Hyderabad, Telangana',
      '60': 'Chennai, Tamil Nadu',
      '70': 'Kolkata, West Bengal',
      '30': 'Jaipur, Rajasthan',
      '41': 'Pune, Maharashtra',
      '38': 'Ahmedabad, Gujarat',
      '22': 'Lucknow, Uttar Pradesh',
    };

    const prefix = pincode.substring(0, 2);
    const city = metroPincodes[prefix] || 'Your Location (Express Delivery)';

    const estDate = new Date();
    estDate.setDate(estDate.getDate() + 3);
    const dateStr = estDate.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    setPincodeStatus({
      checked: true,
      valid: true,
      city,
      date: dateStr,
    });
  };

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2500);
  };

  const format2Digits = (n: number) => n.toString().padStart(2, '0');

  return (
    <section id="product-hero" className="pt-1 sm:pt-1.5 pb-3 sm:pb-4 lg:pb-5 bg-white">
      <div className="max-w-3xl lg:max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        {/* Top Short Breadcrumb: Qavelle / Product name in short */}
        <div className="mb-2 flex items-center justify-between gap-2 flex-wrap text-xs text-gray-500 pb-1.5 border-b border-gray-100">
          <div className="flex items-center gap-1.5 font-medium">
            <button
              type="button"
              onClick={() => (onNavigateHome ? onNavigateHome() : onSwitchProduct && onSwitchProduct('jhumka'))}
              className="hover:text-black cursor-pointer transition-colors bg-transparent border-none p-0 text-gray-600 font-semibold"
            >
              Qavelle
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-black font-bold truncate max-w-[280px] sm:max-w-md">
              {currentProduct.shortTitle || (isChoker ? 'Austrian Diamond Choker Set' : 'Gold Plated Jhumka Set')}
            </span>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8 xl:gap-10 lg:items-start">
          {/* LEFT COLUMN: Gallery with Hero Image on Top and Collection Grid Below (Fixed/Sticky on Desktop) */}
          <div className="lg:col-span-6 xl:col-span-6 lg:sticky lg:top-20 self-start w-full mx-auto lg:mx-0">
            <div className="flex flex-col gap-3">
              {/* Main Hero Media Frame - 100% Raw, No Borders, Curvy Rounded Edges */}
              <div className="w-full relative flex justify-center">
                <div
                  className="relative aspect-square w-full max-w-[440px] sm:max-w-[460px] lg:max-w-[480px] xl:max-w-[500px] rounded-2xl sm:rounded-3xl overflow-hidden flex items-center justify-center select-none mx-auto"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  {/* Product Active Image - Raw & Curvy Edges */}
                  <img
                    key={`${activeProductId}-${activeImageIndex}`}
                    src={activeImage.src}
                    alt={activeImage.alt}
                    referrerPolicy="no-referrer"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    className="w-full h-full object-contain rounded-2xl sm:rounded-3xl p-1 select-none cursor-pointer"
                    onClick={() => setIsZoomModalOpen(true)}
                  />
                </div>
              </div>

              {/* Image Collection Thumbnails - Same Corner Curvy Design (rounded-2xl sm:rounded-3xl) */}
              <div className="w-full max-w-[440px] sm:max-w-[460px] lg:max-w-[480px] xl:max-w-[500px] mx-auto">
                <div className="flex items-center justify-center gap-2.5 sm:gap-3 px-0.5 py-1 w-full overflow-x-auto no-scrollbar">
                  {currentGallery.map((item, idx) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      onMouseEnter={() => setActiveImageIndex(idx)}
                      className={`relative w-14 h-14 sm:w-16 sm:h-16 lg:w-[72px] lg:h-[72px] rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer shrink-0 flex items-center justify-center p-0.5 transition-all duration-200 ${
                        activeImageIndex === idx
                          ? 'ring-2 ring-[#b3874b] shadow-xs'
                          : 'opacity-85 hover:opacity-100 hover:ring-1 hover:ring-gray-300'
                      }`}
                      aria-label={`View photo ${idx + 1}`}
                      title={item.title || item.alt}
                    >
                      <img
                        src={item.thumbSrc || item.src}
                        alt={item.alt}
                        referrerPolicy="no-referrer"
                        loading="eager"
                        decoding="async"
                        className="w-full h-full object-contain rounded-2xl sm:rounded-3xl"
                      />
                      {activeImageIndex === idx && (
                        <span className="absolute bottom-1 inset-x-3 h-0.5 bg-[#b3874b] rounded-full" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (Product Details, Pricing, CTAs & Offers - Scrolling on Desktop) */}
          <div className="lg:col-span-6 xl:col-span-6 mt-4 lg:mt-0 space-y-3 sm:space-y-3.5">
            {/* Product Title, Rating */}
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-[26px] xl:text-[28px] font-black text-black tracking-tight leading-tight">
                {currentProduct.title}
              </h1>
              
              <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1 leading-relaxed">
                {currentProduct.fullDescription}
              </p>

              {/* Rating Row */}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <div className="flex items-center gap-2 text-xs font-medium text-black">
                  <div className="flex items-center gap-1 bg-[#1E8E3E] text-white text-xs font-black px-2 py-0.5 rounded-md">
                    <span>{currentProduct.rating}</span>
                    <Star className="w-3 h-3 fill-white text-white" />
                  </div>
                  <span className="font-bold text-gray-900">
                    {currentProduct.ratingsCount.toLocaleString('en-IN')} Ratings
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-600 font-medium">
                    {currentProduct.reviewsCount.toLocaleString('en-IN')} Reviews
                  </span>
                </div>
              </div>
            </div>

            {/* Price & Offer Box */}
            <div className="rounded-xl border border-gray-200 p-3.5 bg-white shadow-2xs">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-2xl sm:text-3xl font-black text-black tracking-tight leading-none">
                  ₹{selectedBundle.price}
                </span>
                <span className="text-sm sm:text-base text-gray-500 font-normal">
                  MRP <span className="line-through text-gray-400">₹{selectedBundle.originalPrice}</span>
                </span>
                <span className="bg-black text-white text-xs font-extrabold px-2.5 py-0.5 rounded uppercase tracking-wide">
                  {selectedBundle.discountPercent}% OFF • SPECIAL COMBO
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 flex-wrap text-xs text-gray-500 mt-1">
                <span>(Inclusive of all taxes)</span>
                <span className="font-bold text-gray-800 bg-[#FAF9F5] border border-stone-200/90 px-2 py-0.5 rounded-md text-[11px] inline-flex items-center gap-1.5 shadow-2xs">
                  <span className="text-amber-700">🎁</span> Includes Free Velvet Keepsake Box
                </span>
              </div>

              {/* Green Offer Countdown Alert Bar */}
              <div className="mt-2.5 py-1.5 sm:py-2 px-1.5 sm:px-3 rounded-lg bg-[#EBF7EE] text-[#1E8E3E] font-bold text-[10.5px] min-[360px]:text-[11.5px] sm:text-xs md:text-sm text-center tracking-tight sm:tracking-normal whitespace-nowrap overflow-hidden text-ellipsis flex items-center justify-center">
                <span>⚡ Special Festive Offer ends in {format2Digits(timeLeft.hours)} hr : {format2Digits(timeLeft.minutes)} min : {format2Digits(timeLeft.seconds)} sec</span>
              </div>

              {/* Auto-applied QVL100 Coupon Banner */}
              <div className="mt-2.5 flex items-center justify-between gap-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center font-black text-[10px] shrink-0">
                    %
                  </span>
                  <div className="leading-tight">
                    <span className="font-extrabold text-emerald-950">
                      Coupon <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-emerald-300 text-emerald-900 font-bold">QVL100</span> Auto-Applied
                    </span>
                    <p className="text-[10px] text-emerald-700 font-medium mt-0.5">
                      Flat ₹100 instant discount automatically applied at checkout
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-black bg-emerald-700 text-white px-2 py-0.5 rounded shrink-0">
                  ₹100 OFF
                </span>
              </div>
            </div>

            {/* Dual CTA Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => onAddToCart?.(selectedBundle)}
                id="hero-add-to-cart-btn"
                className="flex-1 py-3 sm:py-3.5 px-4 bg-[#FFD600] hover:bg-[#ebd000] active:scale-[0.98] text-black font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <span>ADD TO CART</span>
              </button>
              <button
                type="button"
                onClick={() => onBuyNow(selectedBundle)}
                id="hero-buy-now-btn"
                className="flex-1 sm:flex-[1.4] py-3 sm:py-3.5 px-4 bg-black hover:bg-neutral-900 active:scale-[0.98] text-[#FFD600] font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <span>BUY NOW • ₹{selectedBundle.price}</span>
              </button>
            </div>

            {/* Monsoon Special Sale Offer Box (Exact Match to Reference Screenshot) */}
            <div className="mt-2.5 rounded-xl border border-[#F6E27A] bg-[#FFFEEA] p-2.5 sm:p-3 shadow-2xs">
              {/* Header Row */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center font-black text-[11px] shrink-0">
                    %
                  </div>
                  <span className="font-bold text-black text-xs sm:text-sm">
                    Monsoon Special Sale Offer
                  </span>
                </div>

                <span className="bg-[#2E7D32] text-white text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0">
                  Save ₹500
                </span>
              </div>

              {/* Yellow Toggle Button */}
              <button
                onClick={() => setIsOfferExpanded((prev) => !prev)}
                className="w-full mt-2 py-1.5 px-3 bg-[#F6D04B] hover:bg-[#ebd355] active:scale-[0.99] text-black font-extrabold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <span>{isOfferExpanded ? 'Hide Offer ▲' : 'View Offer ▼'}</span>
              </button>

              {/* Expandable Offer Details Ticket */}
              {isOfferExpanded && (
                <div className="relative mt-2 p-2.5 sm:p-3 bg-white rounded-lg border border-[#A8DFB5] overflow-hidden">
                  {/* Title with Checkmark */}
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-[#1E8E3E] font-bold text-xs sm:text-sm leading-snug">
                      Flat ₹500 Cashback on all prepaid orders
                    </h4>
                    <CheckCircle2 className="w-4 h-4 text-[#1E8E3E] shrink-0 fill-[#1E8E3E] text-white" />
                  </div>

                  {/* Description */}
                  <p className="text-[11px] text-gray-700 mt-1 leading-relaxed font-normal">
                    Flat ₹500 Cashback on all prepaid orders of this product in your store wallet.
                  </p>

                  {/* Terms Link */}
                  <button
                    onClick={() => setShowTermsModal(true)}
                    className="text-[11px] text-gray-700 underline font-medium mt-1.5 hover:text-black block text-left cursor-pointer"
                  >
                    View Terms & Conditions
                  </button>

                  <div className="border-t border-gray-100 my-1.5" />

                  {/* Official Indian Payment Apps */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    <span className="text-[10px] font-semibold text-gray-500 mr-1">Accepted:</span>
                    <GPayLogo size="sm" />
                    <PhonePeLogo size="sm" />
                    <PaytmLogo size="sm" />
                  </div>
                </div>
              )}
            </div>

            {/* Customer Review, Benefits, Specifications & Media inside Moving Right Side */}
            <div className="mt-4 pt-4 sm:mt-5 sm:pt-5 border-t border-gray-200/80 w-full space-y-3.5 sm:space-y-4">
          {/* Customer Review Carousel Card */}
          <div className="relative rounded-2xl border border-[#CFEAD5] bg-[#F1F9F3] p-3.5 sm:p-4 shadow-2xs">
              {/* User Profile Row */}
              <div className="flex items-center gap-3">
                <img
                  src={currentReviewsList[activeReviewIdx]?.userImage || ASSET_IMAGES.ankit}
                  alt={currentReviewsList[activeReviewIdx]?.author || 'Customer'}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover border border-white shadow-2xs"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-black text-sm sm:text-base">
                      {currentReviewsList[activeReviewIdx]?.author || 'Kavya Singhania'}
                    </span>
                    <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                      Verified
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5 text-[#FFC107] text-sm mt-0.5">
                    {'★'.repeat(currentReviewsList[activeReviewIdx]?.rating || 5)}
                  </div>
                </div>
              </div>

              {/* Quote & Navigation Row */}
              <div className="relative mt-2.5 flex items-center justify-between gap-2">
                <button
                  onClick={() =>
                    setActiveReviewIdx((prev) =>
                      prev === 0 ? currentReviewsList.length - 1 : prev - 1
                    )
                  }
                  className="p-1 text-gray-500 hover:text-black active:scale-95 transition-transform cursor-pointer"
                  aria-label="Previous Review"
                >
                  <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                </button>

                <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-normal flex-1 px-1">
                  "{currentReviewsList[activeReviewIdx]?.comment ||
                    (isCombo5
                      ? 'All 5 necklaces are sleek & subtle! Incredible value for ₹349. Beautiful design and doesn’t tarnish.'
                      : isChoker
                      ? 'Wore this set for my sister wedding reception. Everyone thought it was real polki diamond jewelry! Heavy royal look without hurting neckline.'
                      : 'Meri wife ke liye gift liya tha, pack of 6 combo is fantastic value. Har ek jhumka ka finish aur design royal lagta hai. Light weight hone ki wajah se all-day function me pehenne me comfortable hai.')}"
                </p>

                <button
                  onClick={() =>
                    setActiveReviewIdx((prev) => (prev + 1) % currentReviewsList.length)
                  }
                  className="p-1 text-gray-500 hover:text-black active:scale-95 transition-transform cursor-pointer"
                  aria-label="Next Review"
                >
                  <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>
          </div>

            {/* Cashback & Free Shipping Banner + Variant Carousel (Exact Match to Reference Screenshot) */}
            <div className="mt-3 space-y-2.5 sm:space-y-3">
              {/* Top Yellowish Benefit Box */}
              <div className="rounded-2xl bg-[#FFFDF0] border border-[#F6E8BE] p-3 sm:p-4 shadow-2xs">
                <div className="grid grid-cols-2 divide-x divide-[#EEDEB4]">
                  {/* Left: ₹500 Cashback */}
                  <div className="flex items-center gap-3 pr-2 sm:pr-4">
                    <div className="w-10 h-10 shrink-0 flex items-center justify-center text-black">
                      <Gift className="w-7 h-7 stroke-[1.75] text-black" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-black leading-tight">
                        ₹500 Cashback
                      </h4>
                      <p className="text-[10.5px] sm:text-xs text-gray-600 mt-0.5 leading-tight">
                        on all prepaid orders <button onClick={() => setShowTermsModal(true)} className="underline text-gray-700 hover:text-black cursor-pointer">(TnC)</button>
                      </p>
                    </div>
                  </div>

                  {/* Right: FREE Shipping */}
                  <div className="flex items-center gap-3 pl-3 sm:pl-4">
                    <div className="w-10 h-10 shrink-0 flex items-center justify-center text-black">
                      <Truck className="w-7 h-7 stroke-[1.75] text-black" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-black leading-tight">
                        FREE Shipping
                      </h4>
                      <p className="text-[10.5px] sm:text-xs text-gray-600 mt-0.5 leading-tight">
                        on all orders
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Exact Product Description & Specifications Grid */}
            <div className="mt-4 sm:mt-5 space-y-3 sm:space-y-4 text-black font-sans leading-relaxed">
              {/* Product Highlights Card */}
              <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-2xs">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h3 className="text-[15px] sm:text-base font-bold text-black flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    Product Highlights
                  </h3>
                  <span className="text-[11px] font-bold uppercase bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md">
                    {isRadhikaGreen
                      ? 'Celebrity Bridal AD Set'
                      : isCombo5
                      ? 'Combo of 5'
                      : isChoker
                      ? 'Complete Bridal Set'
                      : 'Pack of 6'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3.5">
                  {currentHighlights.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-gray-50/80 border border-gray-100">
                      <span className="text-[11px] font-semibold text-gray-500 block uppercase tracking-wider">
                        {item.label}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5 block break-words">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Details Specifications Grid */}
              <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-2xs">
                <div className="pb-3 border-b border-gray-100">
                  <h3 className="text-[15px] sm:text-base font-bold text-black">
                    Additional Details & Specifications
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5 pt-3.5">
                  {currentAdditionalDetails.map((detail, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 sm:p-3 rounded-xl bg-[#FAFAFA] border border-gray-100 flex flex-col justify-start min-h-[64px]"
                    >
                      <span className="text-[10px] sm:text-[11px] font-semibold text-gray-500 uppercase tracking-wider leading-tight">
                        {detail.label}
                      </span>
                      <span className="text-[12px] sm:text-[13px] font-bold text-gray-900 mt-1 leading-snug break-words">
                        {detail.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Craftsmanship Points */}
              <div className="p-4 rounded-2xl bg-[#FFFDF6] border border-[#F4EEDC]">
                <h3 className="text-[14px] sm:text-[15px] font-bold text-black mb-2">
                  Key Craftsmanship & Heritage:
                </h3>
                {isRadhikaGreen ? (
                  <ul className="space-y-1 text-[13px] sm:text-[14px] text-gray-900">
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-700 font-bold">&bull;</span>
                      <span><strong className="font-bold text-black">Radhika Ambani Inspired Emerald AD Design</strong> - Colombian emerald green gemstone centerpieces framed with sparkling Austrian American diamonds</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-700 font-bold">&bull;</span>
                      <span><strong className="font-bold text-black">Mirror-Shine Rhodium Silver Plating</strong> - Multi-micron anti-tarnish protective coating that resists discoloration</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-700 font-bold">&bull;</span>
                      <span><strong className="font-bold text-black">Complete Set with Matching Earrings</strong> - Includes statement choker necklace and pair of matching chandelier drop earrings</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-700 font-bold">&bull;</span>
                      <span><strong className="font-bold text-black">Adjustable Silk Dori & Extender</strong> - Fits all neck sizes comfortably; 100% skin-safe, lead-free and nickel-free</span>
                    </li>
                  </ul>
                ) : isCombo5 ? (
                  <ul className="space-y-1 text-[13px] sm:text-[14px] text-gray-900">
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">&bull;</span>
                      <span><strong className="font-bold text-black">Combo of 5 Everyday Necklaces</strong> - 5 sleek, subtle, and stylish pendant chains designed for effortless daily wear & office wear</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">&bull;</span>
                      <span><strong className="font-bold text-black">Brass Base Metal & Gold Plating</strong> - High-grade skin-friendly brass with lustrous anti-tarnish gold finish</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">&bull;</span>
                      <span><strong className="font-bold text-black">Cubic Zirconia / AD Stones</strong> - Sparkling multi-faceted American Diamond accents adding subtle luxury</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">&bull;</span>
                      <span><strong className="font-bold text-black">Free Size Adjustable Extender</strong> - 18" chain with 2" extender fitted with durable lobster claw clasps for solo or layered styling</span>
                    </li>
                  </ul>
                ) : isChoker ? (
                  <ul className="space-y-1 text-[13px] sm:text-[14px] text-gray-900">
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">&bull;</span>
                      <span><strong className="font-bold text-black">Mirror-Shine Rhodium Plating</strong> - High-durability silver polish with anti-tarnish coating</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">&bull;</span>
                      <span><strong className="font-bold text-black">AAA+ Austrian Cubic Zirconia</strong> - Multi-faceted brilliant cut sparkle replicating real diamonds</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">&bull;</span>
                      <span><strong className="font-bold text-black">Adjustable Silk Dori Cord</strong> - Customizable fit for all neck sizes with secure knotting</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">&bull;</span>
                      <span><strong className="font-bold text-black">Complete 3-Piece Bridal Set</strong> - Includes Statement Choker, Chandelier Jhumka Earrings & Matching Maang Tikka</span>
                    </li>
                  </ul>
                ) : (
                  <ul className="space-y-1 text-[13px] sm:text-[14px] text-gray-900">
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">&bull;</span>
                      <span><strong className="font-bold text-black">Oxidised Gold Plating</strong> - Royal antique temple look with smooth finish</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">&bull;</span>
                      <span><strong className="font-bold text-black">Lakshmi Devi & Temple Motif Trend</strong> - Auspicious heritage detailing</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">&bull;</span>
                      <span><strong className="font-bold text-black">Ultra-Lightweight Comfort</strong> - Daily wear and festive comfort without pulling earlobes</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">&bull;</span>
                      <span><strong className="font-bold text-black">6 Distinct Handcrafted Designs</strong> - Mayur Peacock, Lakshmi Devi, and Traditional Bell Jhumkas</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">&bull;</span>
                      <span><strong className="font-bold text-black">Includes Free Velvet Keepsake Box</strong> - Safely nestled in a plush velvet keepsake jewelry box with individual slots for royal presentation & dust-free care</span>
                    </li>
                  </ul>
                )}

                <p className="text-[12.5px] sm:text-[13.5px] text-gray-700 leading-normal pt-2.5 border-t border-amber-100/60 mt-2.5">
                  <strong className="font-bold text-black">Care Note:</strong> {isRadhikaGreen ? 'Skin-safe brass alloy with rhodium silver polish and faceted emerald green cubic zirconia. Wipe gently with a soft dry cloth after use. Store in presentation pouch away from water, perfumes, and sprays.' : isCombo5 ? 'Skin-safe brass base with gold plating and cubic zirconia / AD accents. Wipe gently with a soft dry cloth after use. Store in individual pouches away from perfumes and direct water.' : isChoker ? 'High-grade alloy base with rhodium polish & cubic zirconia. Wipe gently with a soft dry cloth after use. Store in presentation pouch away from water, perfumes, and sprays.' : 'High-grade alloy base with oxidised gold plating. Wipe gently with a soft dry cloth after use. Keep away from water, perfumes, and sprays.'}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Sections Scrolling on the Right Side (Accordion & Customer Reviews) */}
          {children}
        </div>
      </div>
    </div>

      {/* Terms & Conditions Modal */}
      {showTermsModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowTermsModal(false)}
        >
          <div
            className="relative max-w-md w-full bg-white rounded-2xl p-5 shadow-2xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-2.5">
              <h3 className="font-bold text-base text-gray-900">
                Prepaid Order Offer Terms & Conditions
              </h3>
              <button
                onClick={() => setShowTermsModal(false)}
                className="p-1 text-gray-400 hover:text-black rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-gray-700 leading-relaxed max-h-60 overflow-y-auto">
              <p>
                <strong>1. ₹500 Wallet Cashback:</strong> Valid only on all prepaid orders (UPI / Debit / Credit Cards / NetBanking). Credited automatically to your QAVELLE store wallet within 24 hours of successful prepaid order delivery. Cash on Delivery orders do not qualify for cashback.
              </p>
              <p>
                <strong>2. Validity:</strong> Limited-time promotional offer. Cannot be exchanged for cash.
              </p>
            </div>

            <button
              onClick={() => setShowTermsModal(false)}
              className="w-full py-2.5 bg-black text-[#FFD600] text-xs font-bold rounded-lg uppercase tracking-wider"
            >
              I Understand
            </button>
          </div>
        </div>
      )}

      {/* Lightbox Zoom Modal */}
      {isZoomModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn"
          onClick={() => setIsZoomModalOpen(false)}
        >
          <div className="relative max-w-2xl w-full max-h-[95vh] flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsZoomModalOpen(false)}
              className="absolute -top-11 right-0 text-white/90 hover:text-[#FFD600] p-2 bg-black/50 rounded-full"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Main Zoomed Image Container */}
            <div className="relative w-full flex items-center justify-center">
              <img
                src={activeImage.src}
                alt={activeImage.alt}
                referrerPolicy="no-referrer"
                className="max-h-[68vh] w-auto object-contain rounded-2xl sm:rounded-3xl shadow-2xl"
              />

              {/* Prev / Next Buttons */}
              <button
                onClick={() =>
                  setActiveImageIndex((prev) =>
                    prev === 0 ? currentGallery.length - 1 : prev - 1
                  )
                }
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() =>
                  setActiveImageIndex((prev) => (prev + 1) % currentGallery.length)
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <p className="text-white text-center mt-2 text-xs font-semibold">
              {activeImage.title} <span className="text-gray-400 font-normal">({activeImageIndex + 1} of {currentGallery.length})</span>
            </p>

            {/* Modal Collection Strip - Raw */}
            <div className="flex gap-2.5 mt-3 overflow-x-auto max-w-full px-2 py-1 no-scrollbar justify-center">
              {currentGallery.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setActiveImageIndex(idx)}
                  className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 cursor-pointer p-0.5"
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-xl"
                  />
                  {activeImageIndex === idx && (
                    <span className="absolute bottom-0 inset-x-1.5 h-0.5 bg-[#FFD600] rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
