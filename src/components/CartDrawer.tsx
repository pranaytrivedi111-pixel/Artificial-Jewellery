import React, { useState } from 'react';
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  Tag,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles
} from 'lucide-react';
import { CartItem, CouponCode } from '../types';
import { ASSET_IMAGES } from '../data/productData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onToggleGiftWrap?: (id: string) => void;
  appliedCoupon: CouponCode | null;
  onApplyCoupon: (code: string) => boolean;
  onRemoveCoupon: () => void;
  onProceedToCheckout: () => void;
  onAddUpsell: (name: string, price: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  onProceedToCheckout,
  onAddUpsell,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.bundle.price * item.quantity,
    0
  );

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
    } else {
      discountAmount = appliedCoupon.discountValue;
    }
  }

  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const success = onApplyCoupon(couponInput);
    if (!success) {
      setCouponError('Invalid coupon. Try QVL100 or QVL10');
    } else {
      setCouponError('');
      setCouponInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-[70] overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-xs" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white border-l border-gray-200 shadow-2xl flex flex-col justify-between h-full relative z-10">
          {/* Cart Header */}
          <div className="px-4 py-3 bg-[#0B0F19] text-white flex items-center justify-between border-b border-gray-800">
            <div className="flex items-center gap-2.5">
              <div className="h-8 px-2.5 py-0.5 rounded-lg bg-white border border-amber-400/40 shadow-xs flex items-center justify-center shrink-0">
                <img
                  src={ASSET_IMAGES.brandLogo}
                  alt="QAVELLE – Crafted For The Queen In You"
                  className="h-5 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-sans text-xs tracking-normal text-gray-300 font-medium">
                Shopping Bag ({cartItems.reduce((s, i) => s + i.quantity, 0)})
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Alert */}
          <div className="p-2.5 bg-amber-50 border-b border-amber-200 text-xs flex items-center gap-2 text-amber-900 font-semibold">
            <Truck className="w-4 h-4 text-amber-700 shrink-0" />
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Unlocked: <strong>FREE Express Delivery Pan-India</strong>!</span>
            </span>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 flex flex-col items-center gap-3">
                <div className="h-10 px-3 py-1 rounded-xl bg-white border border-amber-200 shadow-xs flex items-center justify-center mb-1">
                  <img
                    src={ASSET_IMAGES.brandLogo}
                    alt="QAVELLE"
                    className="h-6 w-auto object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-gray-900">Your shopping bag is empty</h4>
                <p className="text-xs text-gray-500 max-w-xs">Explore our royal collection of handcrafted gold-plated jhumkas and traditional accessories.</p>
                <button
                  onClick={onClose}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-black text-[#FFD600] text-xs font-bold hover:bg-zinc-800 transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              <>
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 shadow-2xs flex flex-col gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-white shrink-0 border border-gray-200">
                        <img
                          src={
                            item.bundle.id.includes('choker') || item.bundle.title.toLowerCase().includes('choker')
                              ? '/White_Diamond_Kundan_Choker_Set_1.png'
                              : ASSET_IMAGES.hero
                          }
                          alt={item.bundle.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-bold text-xs sm:text-[13px] text-gray-900 leading-snug">
                            {item.bundle.title}
                          </h4>
                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.id)}
                            className="text-gray-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="font-black text-sm text-gray-950">
                            ₹{item.bundle.price}
                          </span>
                          <span className="text-[11px] text-gray-400 line-through">
                            ₹{item.bundle.originalPrice}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Controls Row: Remove on Left, Quantity Stepper on Right */}
                    <div className="flex items-center justify-between pt-2.5 border-t border-gray-200 text-xs gap-2">
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        className="text-[11px] sm:text-xs text-gray-500 hover:text-red-600 font-medium flex items-center gap-1.5 cursor-pointer transition-colors py-1 px-1.5 -ml-1.5 rounded-md hover:bg-red-50/70"
                        title="Remove item from cart"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>

                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-gray-300 rounded-lg bg-white shadow-2xs overflow-hidden">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="p-1 px-2 text-gray-600 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-gray-900 min-w-[20px] text-center select-none">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1 px-2 text-gray-600 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Coupon Box */}
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-xs text-emerald-900">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                          <Tag className="w-3.5 h-3.5 text-emerald-700" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold leading-tight text-xs sm:text-[13px]">
                            Coupon <strong className="text-emerald-950 font-black">{appliedCoupon.code}</strong> applied on Prepaid (-₹{discountAmount})
                          </div>
                          <span className="block text-[10.5px] text-emerald-700 font-semibold mt-0.5">
                            ✓ Applied automatically on all prepaid orders
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={onRemoveCoupon}
                        className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline px-2 py-1 rounded transition-colors cursor-pointer shrink-0 ml-2"
                        title="Remove coupon"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApply} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Coupon code (e.g. QVL100)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        className="flex-1 px-3 py-2 rounded-lg bg-white border border-gray-300 text-xs uppercase font-mono focus:outline-none focus:border-black"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-black text-[#FFC107] text-xs font-bold rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </form>
                  )}
                  {couponError && (
                    <p className="text-[11px] text-red-600 mt-1.5 font-medium">{couponError}</p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Cart Footer / Proceed to Checkout */}
          {cartItems.length > 0 && (
            <div className="p-4 pb-6 sm:pb-6 bg-white border-t border-gray-200 shadow-xl flex flex-col gap-2.5 shrink-0 relative z-20">
              <div className="flex flex-col gap-1 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-gray-900">₹{subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount ({appliedCoupon?.code}):</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Delivery:</span>
                  <span className="text-emerald-700 font-bold uppercase">FREE</span>
                </div>
                <div className="flex justify-between text-sm font-black text-gray-950 pt-2 border-t border-gray-100">
                  <span>Total Payable:</span>
                  <span className="text-base text-black">₹{finalTotal}</span>
                </div>
              </div>

              <button
                onClick={onProceedToCheckout}
                id="cart-proceed-checkout-btn"
                className="w-full py-3.5 sm:py-4 px-4 rounded-xl bg-[#FFD600] hover:bg-[#ebd000] active:scale-[0.98] text-black font-black text-xs sm:text-sm uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>BUY NOW • PROCEED TO CHECKOUT (₹{finalTotal})</span>
                <ArrowRight className="w-4 h-4 text-black stroke-[2.5]" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10.5px] text-gray-500 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cash on Delivery Available &bull; 100% Safe & Secure</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
