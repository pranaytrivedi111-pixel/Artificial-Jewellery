/**
 * Meta Pixel Tracking Utility for QAVELLE (Pixel ID: 1081286841529389)
 * Official Event Spec aligned with Meta Commerce Catalog (12 Products)
 */

export const META_PIXEL_ID = '1081286841529389';

// Exact 1-to-1 SKU Mapping for QAVELLE's Catalog Products
export const PRODUCT_ID_TO_SKU: Record<string, string> = {
  'designer-metal-analog-watch': 'QVL-WATCH-6AYLP7',
  'korean-peacock-pearl-earrings': 'QVL-PEACOCK-6SQGX4',
  'thin-as-rice-silver-chain': 'QVL-RICE-70GS5Y',
  'dolphin-crystals-pendant-combo': 'QVL-DOLPHIN-F1V4I9',
  'white-enamel-handbag-earrings': 'QVL-EARRING-63UP0K',
  'emerald-snake-pendant': 'QAV-EMERALD-SNAKE-549',
  'combo-2-pendants': 'QAV-AESTHETIC-COMBO2-549',
  'trendy-alloy-set': 'QAV-TRENDY-ALLOY-849',
  'allure-gold-set': 'QAV-ROYAL-GOLD-SET-849',
  'radhika-green-ad': 'QAV-RADHIKA-AMBANI-GREEN-AD',
  'elegant-everyday-5': 'QAV-ELEGANT-COMBO5-GLD',
  'necklace-combo-5': 'QAV-NECK-COMBO-5-SLV',
  'choker': 'QAV-RHOD-AUST-CHOKER-01',
  'jhumka': 'DE-JHM-OXGLD-06',
};

// Default catalog prices & titles
export const CATALOG_PRODUCTS_INFO: Record<
  string,
  { sku: string; title: string; price: number; category: string }
> = {
  'designer-metal-analog-watch': {
    sku: 'QVL-WATCH-6AYLP7',
    title: 'New Solid Designer Metal Analog Watches For Women',
    price: 299,
    category: 'Watches & Accessories',
  },
  'korean-peacock-pearl-earrings': {
    sku: 'QVL-PEACOCK-6SQGX4',
    title: 'Korean Glorious Pearl Gold Plated Peacock Motif Earring for Women with White Moti & Cubic Zirconia Drops Danglers',
    price: 399,
    category: 'Earrings & Drops',
  },
  'thin-as-rice-silver-chain': {
    sku: 'QVL-RICE-70GS5Y',
    title: 'Trendy Designer Thin as Rice 21 inches 2.5 gram Rice chain for women and Girls Black Silver Plated Brass Metal Chain',
    price: 349,
    category: 'Chains & Necklaces',
  },
  'dolphin-crystals-pendant-combo': {
    sku: 'QVL-DOLPHIN-F1V4I9',
    title: 'Combo Of 3 Elegant Dolphin Crystals Pendant Necklace for Women Silver Plated Round Charm with Colored Stone (Pink, Purple, Sky)',
    price: 499,
    category: 'Combo Deals',
  },
  'white-enamel-handbag-earrings': {
    sku: 'QVL-EARRING-63UP0K',
    title: 'High Grade U Shaped White Enamel Handbag Drop Earrings For Women And Girls',
    price: 399,
    category: 'Earrings & Jhumkas',
  },
  'emerald-snake-pendant': {
    sku: 'QAV-EMERALD-SNAKE-549',
    title: 'Gold Plated Stainless Steel Cubic Zirconia Pendant Green Emerald Anti-Tarnish Flat Snake Chain Necklace',
    price: 549,
    category: 'Anti-Tarnish Jewellery',
  },
  'combo-2-pendants': {
    sku: 'QAV-AESTHETIC-COMBO2-549',
    title: 'Combo of 2 Aesthetic Daily Wear Pendants: Stylish Pastel Pink & Panna Green Locket with Sleek Chain',
    price: 549,
    category: 'Combo Deals',
  },
  'trendy-alloy-set': {
    sku: 'QAV-TRENDY-ALLOY-849',
    title: 'Trendy Alloy Gold Plated Kundan & Pearl Jewellery Set with Matching Drop Earrings',
    price: 849,
    category: 'Necklace Sets',
  },
  'allure-gold-set': {
    sku: 'QAV-ROYAL-GOLD-SET-849',
    title: 'Royal Elegant Gold Plated Jewellery Set with Matching Earrings',
    price: 849,
    category: 'Necklace Sets',
  },
  'radhika-green-ad': {
    sku: 'QAV-RADHIKA-AMBANI-GREEN-AD',
    title: 'Radhika Anant Ambani Inspired Green AD Necklace Set with Matching Drop Earrings',
    price: 399,
    category: 'Celebrity Inspired',
  },
  'elegant-everyday-5': {
    sku: 'QAV-ELEGANT-COMBO5-GLD',
    title: 'Elegant Everyday Necklace Set - Combo of 5 Necklaces with Cubic Zirconia Pendants',
    price: 349,
    category: 'Combo Deals',
  },
  'necklace-combo-5': {
    sku: 'QAV-NECK-COMBO-5-SLV',
    title: 'Shimmering Beautiful Pack of 5 Necklace Chain Pendant Combo for Women and Girls',
    price: 349,
    category: 'Combo Deals',
  },
  'choker': {
    sku: 'QAV-RHOD-AUST-CHOKER-01',
    title: 'Rhodium Plated Austrian Diamond Jewellery Set with Royal Kundan Pearls & Matching Earrings',
    price: 749,
    category: 'Necklace Sets',
  },
  'jhumka': {
    sku: 'DE-JHM-OXGLD-06',
    title: 'Handcrafted 18K Gold Plated Jhumka Earrings for Women - Set of 6 Pairs',
    price: 499,
    category: 'Earrings & Jhumkas',
  },
};

/**
 * Helper to resolve bundle ID, product ID, or text title to the best matching Catalog SKU
 */
export function resolveCatalogSku(identifier?: string): string {
  if (!identifier) return 'DE-JHM-OXGLD-06';

  // 1. Direct SKU match
  const directSkuValues = Object.values(PRODUCT_ID_TO_SKU);
  if (directSkuValues.includes(identifier)) {
    return identifier;
  }

  // 2. Direct ProductId match
  if (PRODUCT_ID_TO_SKU[identifier]) {
    return PRODUCT_ID_TO_SKU[identifier];
  }

  const lower = identifier.toLowerCase();

  if (lower.includes('rice') || lower.includes('grain')) return 'QVL-RICE-70GS5Y';
  if (lower.includes('dolphin')) return 'QVL-DOLPHIN-F1V4I9';
  if (lower.includes('handbag') || lower.includes('enamel')) return 'QVL-EARRING-63UP0K';
  if (lower.includes('snake') || lower.includes('emerald')) return 'QAV-EMERALD-SNAKE-549';
  if (lower.includes('aesthetic') || lower.includes('pastel pink') || lower.includes('panna')) return 'QAV-AESTHETIC-COMBO2-549';
  if (lower.includes('trendy') || lower.includes('alloy') || lower.includes('kundan')) return 'QAV-TRENDY-ALLOY-849';
  if (lower.includes('allure') || lower.includes('royal gold') || lower.includes('ruby')) return 'QAV-ROYAL-GOLD-SET-849';
  if (lower.includes('radhika') || lower.includes('ambani')) return 'QAV-RADHIKA-AMBANI-GREEN-AD';
  if (lower.includes('elegant') || lower.includes('everyday')) return 'QAV-ELEGANT-COMBO5-GLD';
  if (lower.includes('shimmering') || lower.includes('pack of 5')) return 'QAV-NECK-COMBO-5-SLV';
  if (lower.includes('choker') || lower.includes('rhodium')) return 'QAV-RHOD-AUST-CHOKER-01';
  if (lower.includes('jhumka') || lower.includes('earring')) return 'DE-JHM-OXGLD-06';

  return 'DE-JHM-OXGLD-06';
}

/**
 * Safe invocation of Meta Pixel fbq function
 */
function safeFbq(...args: any[]) {
  if (typeof window === 'undefined') return;
  try {
    if (typeof window.fbq === 'function') {
      window.fbq(...args);
      // Optional development diagnostic
      if (process.env.NODE_ENV !== 'production') {
        console.debug('[Meta Pixel]', ...args);
      }
    }
  } catch (err) {
    console.warn('[Meta Pixel Error]', err);
  }
}

/**
 * 1. Track PageView
 * Call on route change or view switch
 */
export function trackMetaPageView(pageTitle?: string, pagePath?: string) {
  safeFbq('track', 'PageView');
  if (pageTitle || pagePath) {
    safeFbq('trackCustom', 'QavellePageView', {
      page_title: pageTitle || (typeof document !== 'undefined' ? document.title : 'QAVELLE'),
      page_path: pagePath || (typeof window !== 'undefined' ? window.location.pathname : '/'),
    });
  }
}

/**
 * 2. Track ViewContent (Product Details View)
 * Matches Meta Commerce Catalog product ID
 */
export interface ViewContentParams {
  id: string; // ProductId or SKU
  sku?: string;
  name: string;
  price: number;
  category?: string;
  currency?: string;
}

export function trackMetaViewContent(params: ViewContentParams) {
  const catalogSku = params.sku || resolveCatalogSku(params.id);
  safeFbq('track', 'ViewContent', {
    content_name: params.name,
    content_ids: [catalogSku],
    content_type: 'product',
    value: Number(params.price) || 0,
    currency: params.currency || 'INR',
    content_category: params.category || 'Jewellery',
  });
}

/**
 * 3. Track AddToCart
 * Dispatched when user adds a bundle or item to cart
 */
export interface AddToCartParams {
  id: string;
  sku?: string;
  name: string;
  price: number;
  quantity?: number;
  category?: string;
  currency?: string;
}

export function trackMetaAddToCart(params: AddToCartParams) {
  const catalogSku = params.sku || resolveCatalogSku(params.id);
  const qty = params.quantity && params.quantity > 0 ? params.quantity : 1;
  const totalPrice = (Number(params.price) || 0) * qty;

  safeFbq('track', 'AddToCart', {
    content_name: params.name,
    content_ids: [catalogSku],
    content_type: 'product',
    value: totalPrice,
    currency: params.currency || 'INR',
    contents: [
      {
        id: catalogSku,
        quantity: qty,
        item_price: Number(params.price) || 0,
      },
    ],
  });
}

/**
 * 4. Track InitiateCheckout
 * Dispatched when user opens checkout or clicks Buy Now
 */
export interface CheckoutItemParam {
  id: string;
  sku?: string;
  name: string;
  price: number;
  quantity: number;
}

export interface InitiateCheckoutParams {
  items: CheckoutItemParam[];
  totalValue: number;
  currency?: string;
  coupon?: string;
}

export function trackMetaInitiateCheckout(params: InitiateCheckoutParams) {
  const contents = params.items.map((item) => {
    const sku = item.sku || resolveCatalogSku(item.id);
    return {
      id: sku,
      quantity: item.quantity,
      item_price: Number(item.price) || 0,
    };
  });

  const contentIds = Array.from(new Set(contents.map((c) => c.id)));
  const totalQuantity = params.items.reduce((sum, i) => sum + i.quantity, 0);

  safeFbq('track', 'InitiateCheckout', {
    content_ids: contentIds,
    content_type: 'product',
    value: Number(params.totalValue) || 0,
    currency: params.currency || 'INR',
    num_items: totalQuantity,
    contents,
    coupon: params.coupon || undefined,
  });
}

/**
 * 5. Track AddPaymentInfo
 * Dispatched when user selects payment mode (Prepaid UPI or COD)
 */
export function trackMetaAddPaymentInfo(params: {
  paymentType: 'upi' | 'cod' | string;
  value: number;
  items?: CheckoutItemParam[];
  currency?: string;
}) {
  const contents = (params.items || []).map((item) => ({
    id: item.sku || resolveCatalogSku(item.id),
    quantity: item.quantity,
    item_price: item.price,
  }));
  const contentIds = contents.map((c) => c.id);

  safeFbq('track', 'AddPaymentInfo', {
    content_ids: contentIds.length > 0 ? contentIds : undefined,
    content_type: 'product',
    value: Number(params.value) || 0,
    currency: params.currency || 'INR',
    contents: contents.length > 0 ? contents : undefined,
  });
}

/**
 * 6. Track Purchase
 * Crucial high-priority conversion event for ROAS and Catalog Sales
 */
export interface PurchaseParams {
  orderId: string;
  value: number;
  currency?: string;
  items: CheckoutItemParam[];
  paymentMethod: 'upi' | 'cod' | string;
  customerPhone?: string;
  customerEmail?: string;
  customerCity?: string;
  customerState?: string;
  customerPincode?: string;
}

export function trackMetaPurchase(params: PurchaseParams) {
  const contents = params.items.map((item) => {
    const sku = item.sku || resolveCatalogSku(item.id);
    return {
      id: sku,
      quantity: item.quantity,
      item_price: Number(item.price) || 0,
    };
  });

  const contentIds = Array.from(new Set(contents.map((c) => c.id)));
  const totalQuantity = params.items.reduce((sum, i) => sum + i.quantity, 0);

  // Set Advanced Matching user data if available
  if (params.customerPhone || params.customerEmail) {
    try {
      const cleanPhone = (params.customerPhone || '').replace(/\D/g, '');
      const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
      safeFbq('set', 'userData', {
        ph: formattedPhone || undefined,
        em: params.customerEmail ? params.customerEmail.trim().toLowerCase() : undefined,
        ct: params.customerCity ? params.customerCity.trim().toLowerCase() : undefined,
        st: params.customerState ? params.customerState.trim().toLowerCase() : undefined,
        zp: params.customerPincode ? params.customerPincode.trim() : undefined,
        country: 'in',
      });
    } catch (e) {
      // Non-blocking
    }
  }

  safeFbq('track', 'Purchase', {
    content_ids: contentIds,
    content_type: 'product',
    value: Number(params.value) || 0,
    currency: params.currency || 'INR',
    num_items: totalQuantity,
    order_id: params.orderId,
    contents,
  });
}

/**
 * 7. Track Search
 * Dispatched when a customer searches products
 */
export function trackMetaSearch(query: string) {
  if (!query || query.trim().length === 0) return;
  safeFbq('track', 'Search', {
    search_string: query.trim(),
    content_category: 'Jewellery',
  });
}

/**
 * 8. Track Contact
 * Dispatched on WhatsApp or support channel click
 */
export function trackMetaContact(channel: string = 'WhatsApp') {
  safeFbq('track', 'Contact', {
    content_name: channel,
    value: 0,
    currency: 'INR',
  });
}

/**
 * 9. Track AddToWishlist
 */
export function trackMetaAddToWishlist(params: {
  id: string;
  sku?: string;
  name: string;
  price: number;
}) {
  const catalogSku = params.sku || resolveCatalogSku(params.id);
  safeFbq('track', 'AddToWishlist', {
    content_name: params.name,
    content_ids: [catalogSku],
    content_type: 'product',
    value: Number(params.price) || 0,
    currency: 'INR',
  });
}
