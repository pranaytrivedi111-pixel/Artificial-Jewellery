import React from 'react';
import { BundleOption, ProductId } from '../types';
import {
  PRODUCT_DETAILS,
  CHOKER_PRODUCT_DETAILS,
  COMBO5_PRODUCT_DETAILS,
  RADHIKA_GREEN_AD_PRODUCT_DETAILS,
  ALLURE_GOLD_SET_PRODUCT_DETAILS,
  ELEGANT_EVERYDAY_PRODUCT_DETAILS,
  SHIMMERING_PRODUCT_DETAILS,
  BUNDLE_OPTIONS,
  CHOKER_BUNDLE_OPTIONS,
  SHIMMERING_BUNDLE_OPTIONS,
  ELEGANT_EVERYDAY_BUNDLE_OPTIONS,
  RADHIKA_GREEN_AD_BUNDLE_OPTIONS,
  ALLURE_GOLD_SET_BUNDLE_OPTIONS,
  TRENDY_ALLOY_SET_PRODUCT_DETAILS,
  TRENDY_ALLOY_SET_BUNDLE_OPTIONS,
} from '../data/productData';
import { ShieldCheck, Star } from 'lucide-react';
import { sanitizeText } from '../utils/brandSanitizer';

interface StickyBottomBarProps {
  bundle?: BundleOption;
  onBuyNow: () => void;
  onAddToCart: () => void;
  activeProductId?: ProductId;
}

const getFallbackBundle = (productId: ProductId | string = 'jhumka'): BundleOption => {
  if (productId === 'trendy-alloy-set') return TRENDY_ALLOY_SET_BUNDLE_OPTIONS[0];
  if (productId === 'allure-gold-set') return ALLURE_GOLD_SET_BUNDLE_OPTIONS[0];
  if (productId === 'radhika-green-ad') return RADHIKA_GREEN_AD_BUNDLE_OPTIONS[0];
  if (productId === 'elegant-everyday-5') return ELEGANT_EVERYDAY_BUNDLE_OPTIONS[0];
  if (productId === 'necklace-combo-5') return SHIMMERING_BUNDLE_OPTIONS[0];
  if (productId === 'choker') return CHOKER_BUNDLE_OPTIONS[0];
  return BUNDLE_OPTIONS[0];
};

export const StickyBottomBar: React.FC<StickyBottomBarProps> = ({
  bundle,
  onBuyNow,
  onAddToCart,
  activeProductId = 'jhumka',
}) => {
  const isTrendyAlloy = activeProductId === 'trendy-alloy-set';
  const isChoker = activeProductId === 'choker';
  const isCombo5 = activeProductId === 'necklace-combo-5';
  const isElegantEveryday = activeProductId === 'elegant-everyday-5';
  const isRadhikaGreen = activeProductId === 'radhika-green-ad';
  const isAllureGold = activeProductId === 'allure-gold-set';

  // Guaranteed safe fallback bundle to eliminate any undefined access
  const safeBundle = bundle && bundle.price ? bundle : getFallbackBundle(activeProductId);

  const currentProduct = isTrendyAlloy
    ? TRENDY_ALLOY_SET_PRODUCT_DETAILS
    : isAllureGold
    ? ALLURE_GOLD_SET_PRODUCT_DETAILS
    : isRadhikaGreen
    ? RADHIKA_GREEN_AD_PRODUCT_DETAILS
    : isElegantEveryday
    ? ELEGANT_EVERYDAY_PRODUCT_DETAILS
    : isCombo5
    ? (SHIMMERING_PRODUCT_DETAILS || COMBO5_PRODUCT_DETAILS)
    : isChoker
    ? CHOKER_PRODUCT_DETAILS
    : PRODUCT_DETAILS;

  const currentImage = isTrendyAlloy
    ? '/b1.png'
    : isAllureGold
    ? '/aa1.webp'
    : isRadhikaGreen
    ? '/radhika_ambani_1.webp'
    : isElegantEveryday
    ? '/elegant_combo_1.webp'
    : isCombo5
    ? '/combo5_user_1.webp'
    : isChoker
    ? '/neklace_producshot.webp'
    : '/Cinematic.webp';

  const cleanProductTitle = sanitizeText(currentProduct.title);
  const cleanBundleTitle = sanitizeText(safeBundle.title);

  return (
    <div
      id="sticky-bottom-bar"
      className="fixed bottom-0 inset-x-0 z-[60] shadow-2xl bg-white border-t border-gray-200"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 60,
        backgroundColor: '#ffffff',
        transform: 'translate3d(0, 0, 0)',
        WebkitTransform: 'translate3d(0, 0, 0)',
        willChange: 'transform',
        paddingBottom: 'max(0px, env(safe-area-inset-bottom, 0px))',
      }}
    >
      {/* Green Promotional Announcement Ribbon - Mobile & Desktop */}
      <div className="bg-[#1E8E3E] text-white text-[10.5px] sm:text-xs font-bold py-1 px-2.5 sm:px-3 text-center tracking-wide flex items-center justify-center gap-1 sm:gap-2">
        <span>₹500 Cashback on prepaid orders</span>
        <span className="opacity-70">&bull;</span>
        <span>Includes Free Velvet Keepsake Box</span>
      </div>

      {/* Main Bottom Checkout Action Bar */}
      <div className="px-2 sm:px-4 lg:px-8 py-1.5 sm:py-2 max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-1.5 sm:gap-4">
          
          {/* Left info area: Product Image, Info & Micro Trust Badge (Desktop & Tablet) */}
          <div className="hidden md:flex items-center gap-3 min-w-0">
            {/* Product Thumbnail - Prominently visible and contained */}
            <div className="w-12 h-12 lg:w-13 lg:h-13 rounded-xl overflow-hidden bg-[#FAF8F5] border border-amber-400/50 shadow-xs shrink-0 flex items-center justify-center p-0.5">
              <img
                src={currentImage}
                alt={cleanProductTitle}
                referrerPolicy="no-referrer"
                loading="eager"
                decoding="async"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Title, Rating & Trust Details */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-black truncate max-w-xs xl:max-w-md">
                  {cleanProductTitle}
                </h4>
                <span className="bg-[#2E7D32] text-white text-[9.5px] font-bold px-1.5 py-0.5 rounded tracking-tight shrink-0">
                  {isCombo5 || isElegantEveryday ? 'Pack of 5' : isChoker ? 'Complete Set' : isAllureGold ? 'Full Royal Set' : isRadhikaGreen ? 'Bridal AD Set' : 'Pack of 6'}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium ml-1 shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {isCombo5 || isElegantEveryday ? 'Anti-Tarnish Coating' : isChoker ? 'Rhodium Anti-Tarnish' : 'Anti-Tarnish Plating'}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                <span className="flex items-center gap-0.5 text-black font-semibold">
                  <Star className="w-3 h-3 fill-[#FFC107] text-[#FFC107]" />
                  {currentProduct.rating}
                </span>
                <span>•</span>
                <span className="text-gray-600 truncate">{cleanBundleTitle}</span>
                <span>•</span>
                <span className="text-emerald-700 font-medium">Extra ₹500 Cashback on Prepaid</span>
              </div>
            </div>
          </div>

          {/* Pricing Info: Mobile View (Compact, never overflows) */}
          <div className="flex items-center gap-1 md:hidden shrink-0">
            <div className="flex flex-col justify-center shrink-0 pr-0.5">
              <div className="flex items-baseline gap-1">
                <span className="text-[15px] xs:text-[17px] sm:text-[18px] font-black text-black leading-none tracking-tight font-mono">
                  ₹{safeBundle.price}
                </span>
                <span className="text-[10px] sm:text-[11px] text-gray-400 line-through leading-none">
                  ₹{safeBundle.originalPrice?.toLocaleString('en-IN') || (safeBundle.price * 2)}
                </span>
              </div>
              <span className="text-[9px] xs:text-[10px] sm:text-[10.5px] font-black text-[#1E8E3E] leading-tight mt-0.5">
                {safeBundle.discountPercent || 60}% OFF
              </span>
            </div>
          </div>

          {/* Right Action Row: Pricing on Desktop + Dual Action Buttons */}
          <div className="flex items-center gap-1 sm:gap-3 flex-1 md:flex-none justify-end min-w-0">
            {/* Desktop Pricing Column */}
            <div className="hidden md:flex flex-col items-end justify-center pr-2 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-[20px] font-black text-black tracking-tight leading-none font-mono">
                  ₹{safeBundle.price}
                </span>
                <span className="text-xs text-gray-400 line-through leading-none">
                  ₹{safeBundle.originalPrice?.toLocaleString('en-IN') || (safeBundle.price * 2)}
                </span>
              </div>
              <span className="text-[11px] font-bold text-[#1E8E3E] leading-none mt-0.5">
                {safeBundle.discountPercent || 60}% OFF (Save ₹{(safeBundle.originalPrice || safeBundle.price * 2) - safeBundle.price})
              </span>
            </div>

            {/* Action Buttons: Official WhatsApp Icon -> ADD TO CART -> BUY NOW */}
            <div className="flex items-center gap-1 sm:gap-2 flex-1 sm:flex-none min-w-0 justify-end">
              {/* Clean Official WhatsApp Button */}
              <a
                href={`https://wa.me/917982438137?text=${encodeURIComponent(
                  `Hi QAVELLE, I would like to know more about the ${cleanProductTitle}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                id="sticky-whatsapp-btn"
                aria-label="Chat with QAVELLE on WhatsApp"
                title="Chat on WhatsApp (7982438137)"
                className="flex items-center justify-center w-7.5 h-7.5 xs:w-8 xs:h-8 sm:w-9 sm:h-9 rounded-full bg-[#25D366] hover:bg-[#20ba5a] active:scale-95 text-white shadow-xs hover:shadow-md transition-all shrink-0 cursor-pointer focus:outline-none"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-[18px] sm:h-[18px] fill-current"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </a>

              <button
                onClick={onAddToCart}
                id="sticky-add-to-cart-btn"
                className="flex-1 sm:flex-none sm:w-36 py-2 xs:py-2.5 sm:py-3 lg:py-2.5 px-1.5 xs:px-2 sm:px-3 rounded-lg bg-[#FFD600] hover:bg-[#ebd000] active:scale-[0.98] text-black font-extrabold text-[10px] xs:text-[11px] sm:text-[12.5px] tracking-wide uppercase shadow-2xs transition-all text-center whitespace-nowrap cursor-pointer shrink"
              >
                ADD TO CART
              </button>
              <button
                onClick={onBuyNow}
                id="sticky-buy-now-btn"
                className="flex-1 sm:flex-none sm:w-40 py-2 xs:py-2.5 sm:py-3 lg:py-2.5 px-1.5 xs:px-2 sm:px-3 rounded-lg bg-black hover:bg-neutral-900 active:scale-[0.98] text-[#FFD600] font-extrabold text-[10px] xs:text-[11px] sm:text-[12.5px] tracking-wide uppercase shadow-2xs transition-all text-center whitespace-nowrap cursor-pointer shrink"
              >
                BUY NOW
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
