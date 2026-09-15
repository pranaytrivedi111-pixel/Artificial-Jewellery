/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { ProductHero } from './components/ProductHero';
import { ProductDetailsAccordion } from './components/ProductDetailsAccordion';
import { ReviewsSection } from './components/ReviewsSection';
import { YouMayAlsoLike } from './components/YouMayAlsoLike';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
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
  TRENDY_ALLOY_SET_PRODUCT_DETAILS,
  TRENDY_ALLOY_SET_BUNDLE_OPTIONS,
  TRENDY_ALLOY_SET_REVIEWS_LIST,
  TRENDY_ALLOY_SET_CUSTOMER_MEDIA,
  TRENDY_ALLOY_SET_SLUG,
  AESTHETIC_PENDANT_COMBO_PRODUCT_DETAILS,
  AESTHETIC_PENDANT_COMBO_BUNDLE_OPTIONS,
  AESTHETIC_PENDANT_COMBO_REVIEWS_LIST,
  AESTHETIC_PENDANT_COMBO_CUSTOMER_MEDIA,
  AESTHETIC_PENDANT_COMBO_SLUG,
  EMERALD_SNAKE_PRODUCT_DETAILS,
  EMERALD_SNAKE_BUNDLE_OPTIONS,
  EMERALD_SNAKE_REVIEWS_LIST,
  EMERALD_SNAKE_CUSTOMER_MEDIA,
  EMERALD_SNAKE_SLUG,
  WHITE_ENAMEL_HANDBAG_EARRINGS_PRODUCT_DETAILS,
  WHITE_ENAMEL_HANDBAG_EARRINGS_BUNDLE_OPTIONS,
  WHITE_ENAMEL_HANDBAG_EARRINGS_REVIEWS_LIST,
  WHITE_ENAMEL_HANDBAG_EARRINGS_CUSTOMER_MEDIA,
  WHITE_ENAMEL_HANDBAG_EARRINGS_SLUG,
  DOLPHIN_CRYSTALS_PENDANT_COMBO_PRODUCT_DETAILS,
  DOLPHIN_CRYSTALS_PENDANT_COMBO_BUNDLE_OPTIONS,
  DOLPHIN_CRYSTALS_PENDANT_COMBO_REVIEWS_LIST,
  DOLPHIN_CRYSTALS_PENDANT_COMBO_CUSTOMER_MEDIA,
  DOLPHIN_CRYSTALS_PENDANT_COMBO_SLUG,
  THIN_AS_RICE_SILVER_CHAIN_PRODUCT_DETAILS,
  THIN_AS_RICE_SILVER_CHAIN_BUNDLE_OPTIONS,
  THIN_AS_RICE_SILVER_CHAIN_REVIEWS_LIST,
  THIN_AS_RICE_SILVER_CHAIN_CUSTOMER_MEDIA,
  THIN_AS_RICE_SILVER_CHAIN_SLUG,
  RADHIKA_GREEN_AD_SLUG,
  COMBO5_SLUG,
  SHIMMERING_SLUG,
  ALLURE_GOLD_SET_SLUG,
} from './data/productData';
import { BundleOption, CartItem, CouponCode, ProductId } from './types';
import {
  trackMetaPageView,
  trackMetaViewContent,
  trackMetaAddToCart,
  trackMetaInitiateCheckout,
  trackMetaAddToWishlist,
  resolveCatalogSku,
} from './utils/metaPixel';

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
    pathname.includes('70gs5y') ||
    pathname.includes('424046230') ||
    pathname.includes('rice-chain') ||
    pathname.includes('thin-as-rice') ||
    param === 'thin-as-rice-silver-chain' ||
    param === 'rice-chain' ||
    param === '70gs5y' ||
    param === '424046230'
  ) {
    return { view: 'product', productId: 'thin-as-rice-silver-chain' };
  }

  if (
    pathname.includes('f1v4i9') ||
    pathname.includes('dolphin') ||
    pathname.includes('crystals-pendant') ||
    pathname.includes('round-charm-with-colored-stone') ||
    param === 'dolphin-crystals-pendant-combo' ||
    param === 'dolphin-combo' ||
    param === 'dolphin' ||
    param === 'f1v4i9'
  ) {
    return { view: 'product', productId: 'dolphin-crystals-pendant-combo' };
  }

  if (
    pathname.includes('63up0k') ||
    pathname.includes('369268004') ||
    pathname.includes('handbag') ||
    pathname.includes('suyug') ||
    pathname.includes('white-enemel') ||
    pathname.includes('white-enamel') ||
    pathname.includes('u-shaped') ||
    param === 'white-enamel-handbag-earrings' ||
    param === 'handbag-earrings' ||
    param === '63up0k' ||
    param === 'suyug'
  ) {
    return { view: 'product', productId: 'white-enamel-handbag-earrings' };
  }

  if (
    pathname.includes('7mhyk6') ||
    pathname.includes('emerald') ||
    pathname.includes('snake-chain') ||
    pathname.includes('flat-snake') ||
    pathname.includes('cubic-zirconia') ||
    pathname.includes('461052726') ||
    param === 'emerald-snake-pendant' ||
    param === '7mhyk6' ||
    param === 'emerald-snake' ||
    param === 'snake'
  ) {
    return { view: 'product', productId: 'emerald-snake-pendant' };
  }

  if (
    pathname.includes('combo-of-2') ||
    pathname.includes('aesthetic') ||
    pathname.includes('gse4gp') ||
    pathname.includes('panna-green') ||
    pathname.includes('pastel-pink') ||
    pathname.includes('2-aesthetic') ||
    param === 'combo-2-pendants' ||
    param === 'gse4gp' ||
    param === 'aesthetic-pendants' ||
    param === 'aesthetic'
  ) {
    return { view: 'product', productId: 'combo-2-pendants' };
  }

  if (
    pathname.includes('trendy') ||
    pathname.includes('alloy') ||
    pathname.includes('qp1c') ||
    param === 'trendy-alloy-set' ||
    param === 'trendy-alloy' ||
    param === 'alloy' ||
    param === 'qp1c'
  ) {
    return { view: 'product', productId: 'trendy-alloy-set' };
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
  'thin-as-rice-silver-chain': THIN_AS_RICE_SILVER_CHAIN_SLUG,
  'dolphin-crystals-pendant-combo': DOLPHIN_CRYSTALS_PENDANT_COMBO_SLUG,
  'white-enamel-handbag-earrings': WHITE_ENAMEL_HANDBAG_EARRINGS_SLUG,
  'emerald-snake-pendant': EMERALD_SNAKE_SLUG,
  'combo-2-pendants': AESTHETIC_PENDANT_COMBO_SLUG,
  'trendy-alloy-set': '/products/trendy-alloy-gold-plated-jewellery-set',
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
  if (productId === 'thin-as-rice-silver-chain') return THIN_AS_RICE_SILVER_CHAIN_BUNDLE_OPTIONS[0];
  if (productId === 'dolphin-crystals-pendant-combo') return DOLPHIN_CRYSTALS_PENDANT_COMBO_BUNDLE_OPTIONS[0];
  if (productId === 'white-enamel-handbag-earrings') return WHITE_ENAMEL_HANDBAG_EARRINGS_BUNDLE_OPTIONS[0];
  if (productId === 'emerald-snake-pendant') return EMERALD_SNAKE_BUNDLE_OPTIONS[0];
  if (productId === 'combo-2-pendants') return AESTHETIC_PENDANT_COMBO_BUNDLE_OPTIONS[0];
  if (productId === 'trendy-alloy-set') return TRENDY_ALLOY_SET_BUNDLE_OPTIONS[0];
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

  // Active product
  const [activeProductId, setActiveProductId] = useState<ProductId>(initialLoc.productId);

  const isRiceChain = activeProductId === 'thin-as-rice-silver-chain';
  const isDolphinCombo = activeProductId === 'dolphin-crystals-pendant-combo';
  const isHandbagEarrings = activeProductId === 'white-enamel-handbag-earrings';
  const isEmeraldSnake = activeProductId === 'emerald-snake-pendant';
  const isAestheticCombo = activeProductId === 'combo-2-pendants';
  const isTrendyAlloy = activeProductId === 'trendy-alloy-set';
  const isChoker = activeProductId === 'choker';
  const isShimmering = activeProductId === 'necklace-combo-5';
  const isElegantEveryday = activeProductId === 'elegant-everyday-5';
  const isRadhikaGreen = activeProductId === 'radhika-green-ad';
  const isAllureGold = activeProductId === 'allure-gold-set';

  const currentProductDetails = isRiceChain
    ? THIN_AS_RICE_SILVER_CHAIN_PRODUCT_DETAILS
    : isDolphinCombo
    ? DOLPHIN_CRYSTALS_PENDANT_COMBO_PRODUCT_DETAILS
    : isHandbagEarrings
    ? WHITE_ENAMEL_HANDBAG_EARRINGS_PRODUCT_DETAILS
    : isEmeraldSnake
    ? EMERALD_SNAKE_PRODUCT_DETAILS
    : isAestheticCombo
    ? AESTHETIC_PENDANT_COMBO_PRODUCT_DETAILS
    : isTrendyAlloy
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

  const currentReviews = isRiceChain
    ? THIN_AS_RICE_SILVER_CHAIN_REVIEWS_LIST
    : isDolphinCombo
    ? DOLPHIN_CRYSTALS_PENDANT_COMBO_REVIEWS_LIST
    : isHandbagEarrings
    ? WHITE_ENAMEL_HANDBAG_EARRINGS_REVIEWS_LIST
    : isEmeraldSnake
    ? EMERALD_SNAKE_REVIEWS_LIST
    : isAestheticCombo
    ? AESTHETIC_PENDANT_COMBO_REVIEWS_LIST
    : isTrendyAlloy
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

  const currentCustomerMedia = isRiceChain
    ? THIN_AS_RICE_SILVER_CHAIN_CUSTOMER_MEDIA
    : isDolphinCombo
    ? DOLPHIN_CRYSTALS_PENDANT_COMBO_CUSTOMER_MEDIA
    : isHandbagEarrings
    ? WHITE_ENAMEL_HANDBAG_EARRINGS_CUSTOMER_MEDIA
    : isEmeraldSnake
    ? EMERALD_SNAKE_CUSTOMER_MEDIA
    : isAestheticCombo
    ? AESTHETIC_PENDANT_COMBO_CUSTOMER_MEDIA
    : isTrendyAlloy
    ? TRENDY_ALLOY_SET_CUSTOMER_MEDIA
    : isAllureGold
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
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponCode | null>(AVAILABLE_COUPONS[0]); // Auto-applied QVL100
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [orderNotification, setOrderNotification] = useState<{
    id: string;
    method: 'upi' | 'cod';
  } | null>(null);

  const handleOrderPlaced = (orderId: string, method: 'upi' | 'cod') => {
    setOrderNotification({ id: orderId, method });
    setTimeout(() => {
      setOrderNotification(null);
    }, 9000);
  };

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
  const handleSwitchProduct = (productId: ProductId, customSlug?: string) => {
    const targetSlug = customSlug || getSlugForProduct(productId);
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

  // Sync document title and Meta Pixel events
  useEffect(() => {
    let pageTitle = 'QAVELLE – India’s Most Trusted Royal Handcrafted Jewellery Store';

    if (currentView === 'home') {
      pageTitle = 'QAVELLE – India’s Most Trusted Royal Handcrafted Jewellery Store';
    } else if (activeProductId === 'thin-as-rice-silver-chain') {
      pageTitle = 'Trendy Designer Thin as Rice 21" Silver Chain | QAVELLE';
    } else if (activeProductId === 'dolphin-crystals-pendant-combo') {
      pageTitle = 'Combo of 3 Dolphin Crystals Pendant Necklaces | QAVELLE';
    } else if (activeProductId === 'white-enamel-handbag-earrings') {
      pageTitle = 'High Grade U-Shaped White Enamel Handbag Drop Earrings | QAVELLE';
    } else if (activeProductId === 'emerald-snake-pendant') {
      pageTitle = 'Gold Plated Stainless Steel Emerald CZ Flat Snake Chain Necklace | QAVELLE';
    } else if (activeProductId === 'combo-2-pendants') {
      pageTitle = 'Combo of 2 Aesthetic Daily Wear Pendants – Pastel Pink & Panna Green Locket | QAVELLE';
    } else if (activeProductId === 'trendy-alloy-set') {
      pageTitle = 'Trendy Alloy Gold Plated Kundan & Pearl Jewellery Set with Matching Drop Earrings | QAVELLE';
    } else if (activeProductId === 'allure-gold-set') {
      pageTitle = 'Royal Elegant Gold Plated Jewellery Set with Matching Earrings | QAVELLE';
    } else if (activeProductId === 'radhika-green-ad') {
      pageTitle = 'Radhika Anant Ambani Inspired Green AD Necklace Set with Matching Earrings | QAVELLE';
    } else if (activeProductId === 'elegant-everyday-5') {
      pageTitle = 'Elegant Everyday Necklace Set – Combo of 5 Necklaces | QAVELLE';
    } else if (activeProductId === 'necklace-combo-5') {
      pageTitle = 'Shimmering Beautiful Pack of 5 Necklace Chain Pendant Combo | QAVELLE';
    } else if (activeProductId === 'choker') {
      pageTitle = 'Rhodium Plated White Austrian Diamond Bridal Choker Set | QAVELLE';
    } else {
      pageTitle = 'Gold Plated Fancy Jhumka Earrings for Women – Set of 6 Pairs | QAVELLE';
    }

    document.title = pageTitle;

    // Track Meta Pixel PageView
    try {
      trackMetaPageView(pageTitle, window.location.pathname);

      // Track Meta Pixel ViewContent if on product page
      if (currentView === 'product') {
        trackMetaViewContent({
          id: activeProductId,
          sku: currentProductDetails.sku,
          name: currentProductDetails.title,
          price: currentProductDetails.price,
          category: currentProductDetails.brand || 'Jewellery',
        });
      }
    } catch (err) {
      console.warn('Meta Pixel View tracking error:', err);
    }
  }, [currentView, activeProductId, currentProductDetails]);

  // Cart actions
  const handleAddToCart = (bundle: BundleOption) => {
    try {
      trackMetaAddToCart({
        id: bundle.id,
        sku: resolveCatalogSku(bundle.id || activeProductId),
        name: bundle.title,
        price: bundle.price,
        quantity: 1,
      });
    } catch (err) {
      console.warn('Meta Pixel AddToCart error:', err);
    }

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
    const targetSku = resolveCatalogSku(targetBundle.id || activeProductId);

    try {
      trackMetaAddToCart({
        id: targetBundle.id,
        sku: targetSku,
        name: targetBundle.title,
        price: targetBundle.price,
        quantity: 1,
      });
      trackMetaInitiateCheckout({
        items: [
          {
            id: targetBundle.id,
            sku: targetSku,
            name: targetBundle.title,
            price: targetBundle.price,
            quantity: 1,
          },
        ],
        totalValue: targetBundle.price,
      });
    } catch (err) {
      console.warn('Meta Pixel BuyNow tracking error:', err);
    }

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
    try {
      trackMetaAddToCart({
        id: item.title,
        sku: resolveCatalogSku(item.title),
        name: item.title,
        price: item.price,
        quantity: 1,
      });
    } catch (err) {
      console.warn('Meta Pixel AddToCart error:', err);
    }
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
        wishlistCount={isWishlisted ? 1 : 0}
        onToggleWishlist={() => {
          const nextWishlist = !isWishlisted;
          setIsWishlisted(nextWishlist);
          if (nextWishlist && currentView === 'product') {
            try {
              trackMetaAddToWishlist({
                id: activeProductId,
                sku: currentProductDetails.sku,
                name: currentProductDetails.title,
                price: currentProductDetails.price,
              });
            } catch (err) {
              console.warn('Meta Pixel Wishlist error:', err);
            }
          }
        }}
        isWishlisted={isWishlisted}
        onNavigateHome={handleNavigateHome}
        onSelectProduct={handleSwitchProduct}
        currentView={currentView}
        activeProductId={activeProductId}
      />

      {/* Main Content: Home Page OR Product Detail View */}
      <main className="flex-1">
        {currentView === 'home' ? (
          <HomePage
            onSelectProduct={handleSwitchProduct}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
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
          try {
            trackMetaInitiateCheckout({
              items: cartItems.map((item) => ({
                id: item.bundle?.id || 'jewelry',
                sku: resolveCatalogSku(item.bundle?.id || item.bundle?.title),
                name: item.bundle?.title || 'Jewelry Item',
                price: item.bundle?.price || 0,
                quantity: item.quantity,
              })),
              totalValue: cartItems.reduce(
                (sum, item) => sum + (item.bundle?.price || 0) * item.quantity,
                0
              ),
              coupon: appliedCoupon?.code,
            });
          } catch (err) {
            console.warn('Meta Pixel InitiateCheckout error:', err);
          }
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
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Mobile & Desktop Sticky Bottom Conversion Bar (Persistently visible at all times on all Product Detail Pages) */}
      {currentView === 'product' && !isCheckoutOpen && (
        <StickyBottomBar
          key={`bottom-bar-${activeProductId}`}
          bundle={selectedBundle}
          onBuyNow={() => handleBuyNow()}
          onAddToCart={() => handleAddToCart(selectedBundle)}
          activeProductId={activeProductId}
        />
      )}

      {/* Floating Order Confirmation Notification */}
      {orderNotification && (
        <div
          id="order-confirmed-toast"
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[94%] max-w-md bg-white border-2 border-emerald-500 shadow-2xl rounded-2xl p-4 flex items-start gap-3.5 animate-fadeIn"
        >
          <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="font-black text-gray-950 text-xs sm:text-sm">
                Order Received &amp; Confirmed!
              </span>
              <button
                type="button"
                onClick={() => setOrderNotification(null)}
                className="text-gray-400 hover:text-gray-700 p-1 cursor-pointer transition-colors"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[11.5px] text-gray-700 mt-1 leading-snug">
              Order <strong className="font-mono text-gray-950 font-bold">{orderNotification.id}</strong> ({orderNotification.method === 'upi' ? 'Prepaid UPI' : 'Cash On Delivery'}) has been received. Our team will share delivery tracking on your WhatsApp.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
