/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { ProductHero } from './components/ProductHero';
import { ProductDetailsAccordion } from './components/ProductDetailsAccordion';
import { ReviewsSection } from './components/ReviewsSection';
import { YouMayAlsoLike } from './components/YouMayAlsoLike';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { TrackOrderModal } from './components/TrackOrderModal';
import { StickyBottomBar } from './components/StickyBottomBar';
import { Footer } from './components/Footer';
import { preloadProductAssets } from './utils/imagePreload';
import {
  BUNDLE_OPTIONS,
  CHOKER_BUNDLE_OPTIONS,
  COMBO5_BUNDLE_OPTIONS,
  SHIMMERING_BUNDLE_OPTIONS,
  ELEGANT_EVERYDAY_BUNDLE_OPTIONS,
  RADHIKA_GREEN_AD_BUNDLE_OPTIONS,
  AVAILABLE_COUPONS,
  REVIEWS_LIST,
  CHOKER_REVIEWS_LIST,
  COMBO5_REVIEWS_LIST,
  SHIMMERING_REVIEWS_LIST,
  ELEGANT_EVERYDAY_REVIEWS_LIST,
  RADHIKA_GREEN_AD_REVIEWS_LIST,
  ALLURE_GOLD_SET_REVIEWS_LIST,
  CHOKER_CUSTOMER_MEDIA,
  COMBO5_CUSTOMER_MEDIA,
  SHIMMERING_CUSTOMER_MEDIA,
  ELEGANT_EVERYDAY_CUSTOMER_MEDIA,
  RADHIKA_GREEN_AD_CUSTOMER_MEDIA,
  ALLURE_GOLD_SET_CUSTOMER_MEDIA,
  PRODUCT_DETAILS,
  CHOKER_PRODUCT_DETAILS,
  COMBO5_PRODUCT_DETAILS,
  SHIMMERING_PRODUCT_DETAILS,
  ELEGANT_EVERYDAY_PRODUCT_DETAILS,
  RADHIKA_GREEN_AD_PRODUCT_DETAILS,
  ALLURE_GOLD_SET_PRODUCT_DETAILS,
  ALLURE_GOLD_SET_BUNDLE_OPTIONS,
  RADHIKA_GREEN_AD_SLUG,
  COMBO5_SLUG,
  SHIMMERING_SLUG,
  ALLURE_GOLD_SET_SLUG,
} from './data/productData';
import { BundleOption, CartItem, CouponCode, ProductId } from './types';

// Helper to resolve view and product from URL slug or query parameter
const getViewAndProductFromLocation = (): { view: 'home' | 'product'; productId: ProductId } => {
  if (typeof window === 'undefined') return { view: 'home', productId: 'jhumka' };
  
  // Check history.state first if navigating internally
  if (window.history.state && window.history.state.view) {
    if (window.history.state.view === 'home') {
      return { view: 'home', productId: 'jhumka' };
    }
    if (window.history.state.view === 'product' && window.history.state.productId) {
      return { view: 'product', productId: window.history.state.productId };
    }
  }

  const pathname = window.location.pathname.toLowerCase();
  const searchParams = new URLSearchParams(window.location.search);
  const param = searchParams.get('product')?.toLowerCase();
  const viewParam = searchParams.get('view')?.toLowerCase();

  if (viewParam === 'home') {
    return { view: 'home', productId: 'jhumka' };
  }

  if (
    pathname.includes('royal-gold') ||
    pathname.includes('royal-elegant') ||
    pathname.includes('allure') ||
    pathname.includes('9uadf') ||
    pathname.includes('gold-plated-jewellery-set') ||
    param === 'allure-gold-set' ||
    param === 'royal-gold-set' ||
    param === 'allure'
  ) {
    return { view: 'product', productId: 'allure-gold-set' };
  }

  if (
    pathname.includes('radhika') ||
    pathname.includes('ambani') ||
    pathname.includes('green-ad') ||
    pathname.includes('neckless') ||
    param === 'radhika-green-ad' ||
    param === 'green-ad' ||
    param === 'radhika'
  ) {
    return { view: 'product', productId: 'radhika-green-ad' };
  }

  if (
    pathname.includes('elegant-everyday') ||
    param === 'elegant-everyday-5' ||
    param === 'elegant-everyday'
  ) {
    return { view: 'product', productId: 'elegant-everyday-5' };
  }

  if (
    pathname.includes('shimmering') ||
    pathname.includes('pack-of-5') ||
    pathname.includes('pendant-combo') ||
    pathname.includes('pendal-combo') ||
    pathname.includes('combo-of-5') ||
    param === 'necklace-combo-5' ||
    param === 'combo5' ||
    param === 'shimmering'
  ) {
    return { view: 'product', productId: 'necklace-combo-5' };
  }

  if (
    pathname.includes('necklace') ||
    pathname.includes('choker') ||
    param === 'necklace' ||
    param === 'choker'
  ) {
    return { view: 'product', productId: 'choker' };
  }

  if (
    pathname.includes('jhumka') ||
    param === 'jhumka'
  ) {
    return { view: 'product', productId: 'jhumka' };
  }

  // Fallback for any product route like /products/... or /product/...
  if (pathname.startsWith('/products/') || pathname.startsWith('/product/') || viewParam === 'product') {
    return { view: 'product', productId: 'jhumka' };
  }

  // Default entry root path: show Home view!
  return { view: 'home', productId: 'jhumka' };
};

export const PRODUCT_SLUGS: Record<ProductId, string> = {
  'allure-gold-set': '/products/royal-elegant-gold-plated-jewellery-set',
  'radhika-green-ad': '/products/radhika-anant-ambani-inspired-green-ad-necklace-set',
  'elegant-everyday-5': '/products/elegant-everyday-necklace-set-combo-of-5',
  'choker': '/products/rhodium-plated-austrian-diamond-choker-set',
  'necklace-combo-5': '/products/shimmering-pack-of-5-necklace-pendant-combo',
  'jhumka': '/products/gold-plated-fancy-jhumka-earrings-set-of-6',
};

const getSlugForProduct = (productId: ProductId): string => {
  return PRODUCT_SLUGS[productId] || '/';
};

const getDefaultBundle = (productId: ProductId): BundleOption => {
  if (productId === 'allure-gold-set') return ALLURE_GOLD_SET_BUNDLE_OPTIONS[0];
  if (productId === 'radhika-green-ad') return RADHIKA_GREEN_AD_BUNDLE_OPTIONS[0];
  if (productId === 'elegant-everyday-5') return ELEGANT_EVERYDAY_BUNDLE_OPTIONS[0];
  if (productId === 'necklace-combo-5') return SHIMMERING_BUNDLE_OPTIONS[0];
  if (productId === 'choker') return CHOKER_BUNDLE_OPTIONS[0];
  return BUNDLE_OPTIONS[0];
};

export default function App() {
  const initialLoc = getViewAndProductFromLocation();

  // Current view: 'home' | 'product'
  const [currentView, setCurrentView] = useState<'home' | 'product'>(initialLoc.view);

  // Active product: 'jhumka' | 'choker' | 'necklace-combo-5' | 'elegant-everyday-5' | 'radhika-green-ad' | 'allure-gold-set'
  const [activeProductId, setActiveProductId] = useState<ProductId>(initialLoc.productId);

  const isChoker = activeProductId === 'choker';
  const isShimmering = activeProductId === 'necklace-combo-5';
  const isElegantEveryday = activeProductId === 'elegant-everyday-5';
  const isRadhikaGreen = activeProductId === 'radhika-green-ad';
  const isAllureGold = activeProductId === 'allure-gold-set';

  const currentProductDetails = isAllureGold
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

  const currentReviews = isAllureGold
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

  const currentCustomerMedia = isAllureGold
    ? ALLURE_GOLD_SET_CUSTOMER_MEDIA
    : isRadhikaGreen
    ? RADHIKA_GREEN_AD_CUSTOMER_MEDIA
    : isElegantEveryday
    ? ELEGANT_EVERYDAY_CUSTOMER_MEDIA
    : isShimmering
    ? SHIMMERING_CUSTOMER_MEDIA
    : isChoker
    ? CHOKER_CUSTOMER_MEDIA
    : undefined;

  // State
  const [selectedBundle, setSelectedBundle] = useState<BundleOption>(() =>
    getDefaultBundle(initialLoc.productId)
  );
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'default-item',
      bundle: getDefaultBundle(initialLoc.productId),
      quantity: 1,
      freeVelvetBox: true,
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponCode | null>(AVAILABLE_COUPONS[0]); // Auto-applied QVL100
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Preload critical product imagery and gallery assets on initial app mount
  useEffect(() => {
    preloadProductAssets();
  }, []);

  // Always open website and any URL strictly from the top (including on refresh, load, and navigation)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const resetToTop = () => {
      try {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      } catch (e) {
        window.scrollTo(0, 0);
      }
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    };

    // Immediate & microtask reset
    resetToTop();
    requestAnimationFrame(resetToTop);

    // Staggered timers to beat asynchronous image rendering and browser layout shifts
    const t1 = setTimeout(resetToTop, 50);
    const t2 = setTimeout(resetToTop, 150);
    const t3 = setTimeout(resetToTop, 350);

    // On complete page and image load, ensure top position
    const handleWindowLoad = () => resetToTop();
    if (document.readyState === 'complete') {
      resetToTop();
    } else {
      window.addEventListener('load', handleWindowLoad, { once: true });
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener('load', handleWindowLoad);
    };
  }, []);

  // Always scroll to top when switching views or active product
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const resetToTop = () => {
      try {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      } catch (e) {
        window.scrollTo(0, 0);
      }
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    };

    resetToTop();
    requestAnimationFrame(resetToTop);
    const timer = setTimeout(resetToTop, 60);
    return () => clearTimeout(timer);
  }, [currentView, activeProductId]);

  // Navigate to Homepage
  const handleNavigateHome = () => {
    setCurrentView('home');
    if (typeof window !== 'undefined') {
      window.history.pushState({ view: 'home' }, '', '/');
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  };

  // Switch product function: switches to PDP with specific slug
  const handleSwitchProduct = (productId: ProductId) => {
    const targetSlug = getSlugForProduct(productId);
    setActiveProductId(productId);
    setCurrentView('product');
    setSelectedBundle(getDefaultBundle(productId));

    if (typeof window !== 'undefined') {
      window.history.pushState({ view: 'product', productId }, '', targetSlug);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  };

  // Browser back / forward button support
  useEffect(() => {
    const handlePopState = () => {
      const loc = getViewAndProductFromLocation();
      setCurrentView(loc.view);
      setActiveProductId(loc.productId);
      setSelectedBundle(getDefaultBundle(loc.productId));
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync document title
  useEffect(() => {
    if (currentView === 'home') {
      document.title = 'QAVELLE – India’s Most Trusted Royal Handcrafted Jewellery Store';
    } else if (activeProductId === 'allure-gold-set') {
      document.title =
        'Royal Elegant Gold Plated Jewellery Set with Matching Earrings | QAVELLE';
    } else if (activeProductId === 'radhika-green-ad') {
      document.title =
        'Radhika Anant Ambani Inspired Green AD Necklace Set with Matching Earrings | QAVELLE';
    } else if (activeProductId === 'elegant-everyday-5') {
      document.title =
        'Elegant Everyday Necklace Set – Combo of 5 Necklaces | QAVELLE';
    } else if (activeProductId === 'necklace-combo-5') {
      document.title =
        'Shimmering Beautiful Pack of 5 Necklace Chain Pendant Combo | QAVELLE';
    } else if (activeProductId === 'choker') {
      document.title = 'Rhodium Plated White Austrian Diamond Bridal Choker Set | QAVELLE';
    } else {
      document.title = 'Gold Plated Fancy Jhumka Earrings for Women – Set of 6 Pairs | QAVELLE';
    }
  }, [currentView, activeProductId]);

  // Cart actions
  const handleAddToCart = (bundle: BundleOption) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.bundle.id === bundle.id);
      if (existing) {
        return prev.map((item) =>
          item.bundle.id === bundle.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: `cart-${Date.now()}`,
          bundle,
          quantity: 1,
          freeVelvetBox: true,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const handleBuyNow = (bundle?: BundleOption) => {
    const targetBundle = bundle || selectedBundle;
    setCartItems([
      {
        id: `buynow-${Date.now()}`,
        bundle: targetBundle,
        quantity: 1,
        freeVelvetBox: true,
      },
    ]);
    setIsCheckoutOpen(true);
  };

  const handleUpdateQuantity = (id: string, newQty: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleApplyCoupon = (code: string): boolean => {
    let clean = code.trim().toUpperCase().replace(/[\s-_]/g, '');
    if (clean === 'QAVELLE100' || clean === 'QAVELLE') {
      clean = 'QVL100';
    }
    const found = AVAILABLE_COUPONS.find(
      (c) =>
        c.code.toUpperCase().replace(/[\s-_]/g, '') === clean ||
        c.code.toUpperCase() === code.trim().toUpperCase()
    );
    if (found) {
      setAppliedCoupon(found);
      return true;
    }
    return false;
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  const handleAddUpsell = (name: string, price: number) => {
    const upsellBundle: BundleOption = {
      id: `upsell-${Date.now()}`,
      title: name,
      subtitle: 'Complimentary Raw Crystal Remedy',
      unitCount: 1,
      price,
      originalPrice: price * 2.4,
      discountPercent: 58,
    };

    setCartItems((prev) => [
      ...prev,
      {
        id: `cart-upsell-${Date.now()}`,
        bundle: upsellBundle,
        quantity: 1,
        freeVelvetBox: false,
      },
    ]);
  };

  const handleAddToCartItem = (item: { title: string; price: number }) => {
    handleAddUpsell(item.title, item.price);
    setIsCartOpen(true);
  };

  const totalCartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-gray-900 font-sans">
      {/* 1. Brand Navbar with Navigation Links, Live Search, Cart */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
        wishlistCount={isWishlisted ? 1 : 0}
        onToggleWishlist={() => setIsWishlisted(!isWishlisted)}
        isWishlisted={isWishlisted}
        onNavigateHome={handleNavigateHome}
        onSelectProduct={handleSwitchProduct}
        currentView={currentView}
        activeProductId={activeProductId}
      />

      {/* Main Content: Home Page OR Product Detail View */}
      <main className={`flex-1 ${currentView === 'product' ? 'pb-24 sm:pb-28' : 'pb-0 sm:pb-2'}`}>
        {currentView === 'home' ? (
          <HomePage
            onSelectProduct={handleSwitchProduct}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
          />
        ) : (
          <>
            {/* Product Hero Section */}
            <ProductHero
              key={`hero-${activeProductId}`}
              selectedBundle={selectedBundle}
              onSelectBundle={(b) => setSelectedBundle(b)}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              activeProductId={activeProductId}
              onSwitchProduct={handleSwitchProduct}
              onNavigateHome={handleNavigateHome}
            >
              {/* Product Details Accordion & Why QAVELLE section */}
              <ProductDetailsAccordion />

              {/* Verified Customer Reviews & Photo Gallery */}
              <ReviewsSection
                key={`reviews-${activeProductId}`}
                customReviews={currentReviews}
                customCustomerMedia={currentCustomerMedia}
                productTitle={currentProductDetails.title}
                ratingScore={currentProductDetails.rating}
                totalRatingsCount={`${currentProductDetails.ratingsCount.toLocaleString('en-IN')} ratings`}
                totalReviewsCount={`${currentProductDetails.reviewsCount.toLocaleString('en-IN')} verified reviews`}
              />
            </ProductHero>

            {/* You May Also Like Section */}
            <YouMayAlsoLike
              activeProductId={activeProductId}
              onSwitchProduct={handleSwitchProduct}
              onAddToCartItem={handleAddToCartItem}
            />
          </>
        )}
      </main>

      {/* QAVELLE Footer */}
      <Footer activeProductId={activeProductId} />

      {/* Slide-out QAVELLE Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        onAddUpsell={handleAddUpsell}
      />

      {/* 2-Step Checkout Modal (COD + Instant UPI) */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        appliedCoupon={appliedCoupon}
        onClearCart={() => setCartItems([])}
      />

      {/* Live Order Tracking Modal */}
      <TrackOrderModal
        isOpen={isTrackOrderOpen}
        onClose={() => setIsTrackOrderOpen(false)}
      />

      {/* Mobile & Desktop Sticky Bottom Conversion Bar (Persistently visible at all times on all Product Detail Pages) */}
      {currentView === 'product' && !isCheckoutOpen && !isTrackOrderOpen && (
        <StickyBottomBar
          key={`bottom-bar-${activeProductId}`}
          bundle={selectedBundle}
          onBuyNow={() => handleBuyNow()}
          onAddToCart={() => handleAddToCart(selectedBundle)}
          activeProductId={activeProductId}
        />
      )}
    </div>
  );
}
