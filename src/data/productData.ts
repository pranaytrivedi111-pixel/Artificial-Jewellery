import {
  BundleOption,
  CouponCode,
  FaqItem,
  ProductDetails,
  ProductGalleryItem,
  ReviewItem,
} from '../types';

export interface HighlightItem {
  label: string;
  value: string;
}

export interface CustomerMediaItem {
  id: string;
  src: string;
  thumbSrc?: string;
  caption: string;
  author: string;
  city: string;
}

export interface RelatedProductItem {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
}

export interface LiveSalesNotification {
  name: string;
  city: string;
  item: string;
  time: string;
}

export const ASSET_IMAGES = {
  brandLogo: '/qavelle_logo_transparent.png',
  hero: '/Cinematic.webp',
  crest: '/qavelle_crest_transparent.png',
};

export const AVAILABLE_COUPONS: CouponCode[] = [
  {
    code: 'QVL100',
    description: 'Flat ₹100 Instant Royal Discount on orders above ₹499',
    discountType: 'flat',
    discountValue: 100,
    minSpend: 499,
  },
  {
    code: 'QVL10',
    description: 'Extra 10% OFF on your QAVELLE order',
    discountType: 'percentage',
    discountValue: 10,
    minSpend: 299,
  },
];

const makeBundles = (
  prefix: string,
  shortName: string,
  unitPrice: number,
  unitMrp: number
): BundleOption[] => {
  const pct1 = Math.round(((unitMrp - unitPrice) / unitMrp) * 100);
  const price2 = Math.round(unitPrice * 2 * 0.9);
  const mrp2 = unitMrp * 2;
  const pct2 = Math.round(((mrp2 - price2) / mrp2) * 100);
  const price3 = Math.round(unitPrice * 3 * 0.85);
  const mrp3 = unitMrp * 3;
  const pct3 = Math.round(((mrp3 - price3) / mrp3) * 100);

  return [
    {
      id: `${prefix}-single`,
      title: `${shortName} (Pack of 1)`,
      subtitle: 'Includes Free Royal Velvet Box + Express Delivery',
      unitCount: 1,
      price: unitPrice,
      originalPrice: unitMrp,
      discountPercent: pct1,
      badge: 'MOST POPULAR',
      badgeText: 'MOST POPULAR',
      popular: true,
      isPopular: true,
      saveAmount: unitMrp - unitPrice,
    },
    {
      id: `${prefix}-duo`,
      title: `${shortName} (Pack of 2 • Gift Duo)`,
      subtitle: 'Extra 10% OFF • Ideal for Gifting & Festive Styling',
      unitCount: 2,
      price: price2,
      originalPrice: mrp2,
      discountPercent: pct2,
      badge: 'SAVE EXTRA 10%',
      badgeText: 'SAVE EXTRA 10%',
      popular: false,
      isPopular: false,
      saveAmount: mrp2 - price2,
    },
    {
      id: `${prefix}-trio`,
      title: `${shortName} (Pack of 3 • Family Value)`,
      subtitle: 'Extra 15% OFF • Priority Express Dispatch',
      unitCount: 3,
      price: price3,
      originalPrice: mrp3,
      discountPercent: pct3,
      badge: 'BEST VALUE',
      badgeText: 'BEST VALUE',
      popular: false,
      isPopular: false,
      saveAmount: mrp3 - price3,
    },
  ];
};

const makeReviews = (
  prefix: string,
  productShort: string,
  images: string[] = []
): ReviewItem[] => [
  {
    id: `${prefix}-rev-1`,
    author: 'Ananya Sharma',
    city: 'Jaipur',
    state: 'Rajasthan',
    rating: 5,
    date: '2 days ago',
    title: 'Looks straight out of a boutique showroom',
    comment: `Ordered the ${productShort} for a family function and everyone thought it was fine gold jewellery. Finishing is smooth, lightweight on the skin, and arrived in a gorgeous QAVELLE velvet box.`,
    verified: true,
    userImage: images[0],
    helpfulCount: 34,
    badge: 'Verified Buyer',
  },
  {
    id: `${prefix}-rev-2`,
    author: 'Priya Nair',
    city: 'Kochi',
    state: 'Kerala',
    rating: 5,
    date: '5 days ago',
    title: 'Super fast COD delivery & exact match to photos',
    comment: `Really impressed by the detailing and polish of this ${productShort}. No irritation even after wearing it for 8+ hours straight. Totally worth every rupee.`,
    verified: true,
    userImage: images[1],
    helpfulCount: 21,
    badge: 'Verified Buyer',
  },
  {
    id: `${prefix}-rev-3`,
    author: 'Meera Kulkarni',
    city: 'Pune',
    state: 'Maharashtra',
    rating: 5,
    date: '1 week ago',
    title: 'Received so many compliments!',
    comment: `The shine and craftsmanship on this ${productShort} are unmatched at this price point. Packaging was secure and gifting-ready. Already ordering another set for my sister.`,
    verified: true,
    userImage: images[2],
    helpfulCount: 18,
    badge: 'Verified Buyer',
  },
  {
    id: `${prefix}-rev-4`,
    author: 'Riya Verma',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    rating: 4,
    date: '2 weeks ago',
    title: 'Elegant, lightweight and tarnish-resistant',
    comment: `Wore the ${productShort} twice already and the finish still looks brand new. QAVELLE WhatsApp support was also very responsive with tracking updates.`,
    verified: true,
    helpfulCount: 12,
    badge: 'Verified Buyer',
  },
];

const makeCustomerMedia = (
  prefix: string,
  items: { src: string; thumbSrc?: string; caption: string; author: string; city: string }[]
): CustomerMediaItem[] =>
  items.map((item, index) => ({
    id: `${prefix}-media-${index + 1}`,
    ...item,
  }));

// ============================================================================
// 1. DEFAULT PRODUCT: GOLD PLATED FANCY JHUMKA EARRINGS SET OF 6
// ============================================================================
export const PRODUCT_DETAILS: ProductDetails = {
  id: 'jhumka',
  title: 'Handcrafted 18K Gold Plated Jhumka Earrings for Women - Set of 6 Pairs',
  shortTitle: '18K Gold Jhumka Set of 6',
  tagline: '6 Handcrafted Traditional Ethnic Jhumka Pairs with Pearls & Crystals',
  subtitle: 'Set of 6 unique festive jhumka designs with 18K micro gold plating & pearl drops',
  fullDescription:
    'Traditional Oxidised Gold Jhumka Earrings Combo for Women Daily Wear Ethnic Jhumka Earrings Set for Women (Pack of 6). Set of 6 unique traditional jhumka designs handcrafted with Austrian crystals and lustrous pearl drops. 18K micro gold plating with anti-allergy push backs, certificate of authenticity, and quality guarantee.',
  description:
    'Set of 6 handcrafted ethnic jhumka earrings featuring 18K micro gold plating, lustrous pearl drops, and skin-safe hypoallergenic push backs.',
  rating: 4.9,
  ratingsCount: 2480,
  reviewsCount: 1657,
  size: 'Free Size (6 Pairs)',
  price: 499,
  salePrice: 499,
  originalPrice: 1999,
  regularPrice: 1999,
  discountPercent: 75,
  discountPercentage: 75,
  sku: 'DE-JHM-OXGLD-06',
  inStock: true,
  stockLeft: 9,
  inStockCount: 9,
  recentSales24h: 184,
  currentLiveViewers: 42,
  freeDeliveryThreshold: 0,
  brand: 'QAVELLE',
  countryOfOrigin: 'India',
  badge: 'BESTSELLER COMBO',
  tag: 'Pack of 6 Pairs',
  urgencyText: 'Only 9 royal sets left in stock!',
  materials: '18K Gold Plated Alloy & Pearls',
  dimensions: 'Free Size • Featherlight Comfort Fit',
};

export const PRODUCT_GALLERY: ProductGalleryItem[] = [
  {
    id: 'jhm-1',
    src: '/Cinematic.webp',
    thumbSrc: '/Cinematic_thumb.webp',
    alt: 'Handcrafted 18K Gold Plated Jhumka Earrings Set of 6',
    title: 'Royal Gold Jhumka Collection (Set of 6)',
    tag: 'Bestseller',
  },
  {
    id: 'jhm-2',
    src: '/UGC_1.webp',
    thumbSrc: '/UGC_1_thumb.webp',
    alt: 'Jhumka Earrings Set Close-up',
    title: 'Handcrafted Pearl & Filigree Detail',
  },
  {
    id: 'jhm-3',
    src: '/UGC_2.webp',
    thumbSrc: '/UGC_2_thumb.webp',
    alt: 'Ethnic Jhumka Styling View',
    title: 'Festive & Ethnic Wear Styling',
  },
  {
    id: 'jhm-4',
    src: '/UGC_3.webp',
    thumbSrc: '/UGC_3_thumb.webp',
    alt: 'Jhumka Set Packaging View',
    title: 'Six Unique Royal Silhouettes',
  },
  {
    id: 'jhm-5',
    src: '/UGC.webp',
    thumbSrc: '/UGC_thumb.webp',
    alt: 'Customer Unboxing Jhumka Set',
    title: 'Complimentary Royal Velvet Box',
  },
];

export const PRODUCT_HIGHLIGHTS: HighlightItem[] = [
  { label: 'Pack Contents', value: '6 Unique Jhumka Pairs (12 Earrings)' },
  { label: 'Plating', value: '18K Micro Gold Anti-Tarnish Polish' },
  { label: 'Stone & Accent', value: 'Austrian Crystals & Pearl Drops' },
  { label: 'Skin Safety', value: '100% Lead & Nickel Free' },
];

export const ADDITIONAL_DETAILS: HighlightItem[] = [
  { label: 'Base Material', value: 'Hypoallergenic Brass Alloy' },
  { label: 'Closure Type', value: 'Secure Anti-Allergy Push Back' },
  { label: 'Occasion', value: 'Weddings, Festivals, Ethnic & Daily Wear' },
  { label: 'Weight', value: 'Featherlight All-Day Comfort' },
  { label: 'Packaging', value: 'Free QAVELLE Royal Velvet Box' },
  { label: 'Origin', value: 'Handcrafted in India' },
];

export const BUNDLE_OPTIONS: BundleOption[] = makeBundles('jhumka', '18K Gold Jhumka Set of 6', 499, 1999);
export const REVIEWS_LIST: ReviewItem[] = makeReviews('jhumka', 'Gold Jhumka Set of 6', [
  '/jhumka_review_1.jpg',
  '/jhumka_review_3.jpg',
  '/girl_reviewer_1.jpg',
]);

// ============================================================================
// 2. RHODIUM PLATED AUSTRIAN DIAMOND BRIDAL CHOKER SET
// ============================================================================
export const CHOKER_PRODUCT_DETAILS: ProductDetails = {
  id: 'choker',
  title: 'Rhodium Plated Austrian Diamond Jewellery Set with Royal Kundan Pearls & Matching Earrings',
  shortTitle: 'Austrian Diamond Bridal Choker Set',
  tagline: 'Regal Rhodium Plated Bridal Choker with Drop Earrings & Maang Tikka',
  subtitle: 'White Austrian Crystals & Kundan Pearls with Tarnish-Resistant Rhodium Finish',
  fullDescription:
    'Regal Rhodium Plated Choker with White Austrian Crystals & Kundan Pearls. Includes matching royal drop earrings and maang tikka. Tarnish-resistant rhodium electroplating with comfort-fit flexible back dori with adjustable bead. Perfect for weddings, sangeet, engagement, and grand galas.',
  rating: 4.9,
  ratingsCount: 1890,
  reviewsCount: 1124,
  size: 'Adjustable Free Size',
  price: 749,
  originalPrice: 2999,
  discountPercent: 75,
  sku: 'QAV-RHOD-AUST-CHOKER-01',
  inStock: true,
  stockLeft: 11,
  recentSales24h: 132,
  currentLiveViewers: 38,
  freeDeliveryThreshold: 0,
  brand: 'QAVELLE',
  countryOfOrigin: 'India',
  badge: 'ROYAL BRIDAL',
  materials: 'Rhodium Plated Brass & Alloy with Austrian Crystals & Kundan Pearls',
};

export const CHOKER_PRODUCT_GALLERY: ProductGalleryItem[] = [
  {
    id: 'choker-1',
    src: '/Hero_website_neklace.webp',
    thumbSrc: '/Hero_website_neklace_thumb.webp',
    alt: 'Rhodium Plated Austrian Diamond Bridal Choker Set',
    title: 'Royal Austrian Diamond Choker Set',
    tag: 'Royal Bridal',
  },
  {
    id: 'choker-2',
    src: '/neklace_producshot.webp',
    thumbSrc: '/neklace_producshot_thumb.webp',
    alt: 'Choker Necklace and Matching Earrings Close-up',
    title: 'Precision Pavé Crystal Setting',
  },
  {
    id: 'choker-3',
    src: '/neklace_productshot_2.webp',
    thumbSrc: '/neklace_productshot_2_thumb.webp',
    alt: 'Bridal Choker Set Studio Detail',
    title: 'Kundan Pearl Drops & Adjustable Dori',
  },
];

export const CHOKER_PRODUCT_HIGHLIGHTS: HighlightItem[] = [
  { label: 'Set Includes', value: 'Bridal Choker + Earrings + Maang Tikka' },
  { label: 'Plating', value: 'Tarnish-Resistant Rhodium Silver Polish' },
  { label: 'Stones', value: 'AAA Austrian Diamonds & Kundan Pearls' },
  { label: 'Fit', value: 'Comfort-Fit Adjustable Back Dori' },
];

export const CHOKER_ADDITIONAL_DETAILS: HighlightItem[] = [
  { label: 'Base Material', value: 'Skin-Safe Brass Alloy' },
  { label: 'Color', value: 'White / Silver Sparkle' },
  { label: 'Occasion', value: 'Bridal, Sangeet, Reception & Engagement' },
  { label: 'Packaging', value: 'Luxury Velvet Presentation Box' },
  { label: 'Skin Safety', value: 'Lead & Nickel Free Hypoallergenic' },
  { label: 'Origin', value: 'Handcrafted in India' },
];

export const CHOKER_BUNDLE_OPTIONS: BundleOption[] = makeBundles('choker', 'Austrian Diamond Choker Set', 749, 2999);
export const CHOKER_REVIEWS_LIST: ReviewItem[] = makeReviews('choker', 'Austrian Diamond Choker Set', [
  '/necklace_review_1.jpg',
  '/necklace_review_2.jpg',
  '/necklace_review_3.jpg',
]);
export const CHOKER_CUSTOMER_MEDIA: CustomerMediaItem[] = makeCustomerMedia('choker', [
  { src: '/necklace_review_1.jpg', caption: 'Wore it for my sister’s sangeet!', author: 'Kavya R.', city: 'Delhi' },
  { src: '/necklace_review_2.jpg', caption: 'Sparkles like real diamonds under lights', author: 'Sneha M.', city: 'Mumbai' },
  { src: '/necklace_review_3.jpg', caption: 'So comfortable and regal', author: 'Pooja S.', city: 'Bengaluru' },
]);

// ============================================================================
// 3. SHIMMERING PACK OF 5 NECKLACE CHAIN PENDANT COMBO (+ COMBO5 ALIAS)
// ============================================================================
export const SHIMMERING_SLUG = '/products/shimmering-pack-of-5-necklace-pendant-combo';
export const COMBO5_SLUG = SHIMMERING_SLUG;

export const SHIMMERING_PRODUCT_DETAILS: ProductDetails = {
  id: 'necklace-combo-5',
  title: 'Shimmering Beautiful Pack of 5 Necklace Chain Pendant Combo for Women and Girls',
  shortTitle: 'Shimmering Pack of 5 Pendants',
  tagline: '5 Distinct Designer Silver-Plated Pendants for Layering & Everyday Glam',
  subtitle: 'Curved Pearl Arch, Dainty Star, Solitaire Pearl Drop, Heart & Infinity Charm',
  fullDescription:
    'Shimmering Beautiful Pack of 5 Necklace Chain Pendant Combo for Women and Girls - 5 distinct designer pendants (Curved Pearl Arch, Dainty Star, Solitaire Pearl Drop, Polished Heart, and Infinity Charm) with high-shine silver plated chains. Designed for versatile styling, allowing you to wear each pendant individually for everyday minimalism or layered together.',
  rating: 4.8,
  ratingsCount: 1520,
  reviewsCount: 942,
  size: '18 Inch + 2 Inch Extender',
  price: 349,
  originalPrice: 999,
  discountPercent: 65,
  sku: 'QAV-NECK-COMBO-5-SLV',
  inStock: true,
  stockLeft: 12,
  recentSales24h: 118,
  currentLiveViewers: 31,
  freeDeliveryThreshold: 0,
  brand: 'QAVELLE',
  countryOfOrigin: 'India',
  badge: 'POPULAR PACK OF 5',
  materials: 'Silver Plated Alloy with Pearls & Polished Charms',
};

export const SHIMMERING_PRODUCT_GALLERY: ProductGalleryItem[] = [
  {
    id: 'shim-1',
    src: '/combo5_user_1.webp',
    thumbSrc: '/combo5_user_1_thumb.webp',
    alt: 'Shimmering Pack of 5 Necklace Chain Pendant Combo',
    title: '5 Designer Silver Pendant Chains',
    tag: 'Pack of 5',
  },
  {
    id: 'shim-2',
    src: '/combo5_user_2.webp',
    thumbSrc: '/combo5_user_2_thumb.webp',
    alt: 'Dainty Silver Pendants Close-up',
    title: 'Minimalist Everyday Styling',
  },
  {
    id: 'shim-3',
    src: '/combo5_user_3.webp',
    thumbSrc: '/combo5_user_3_thumb.webp',
    alt: 'Layered Pendant Necklaces View',
    title: 'Wear Solo or Layered Together',
  },
  {
    id: 'shim-4',
    src: '/combo5_user_4.webp',
    thumbSrc: '/combo5_user_4_thumb.webp',
    alt: 'Pack of 5 Necklaces Detail',
    title: 'Adjustable Extender Lobster Clasp',
  },
];

export const SHIMMERING_PRODUCT_HIGHLIGHTS: HighlightItem[] = [
  { label: 'Combo Includes', value: '5 Complete Pendant Necklaces' },
  { label: 'Plating', value: 'High-Shine Anti-Tarnish Silver Polish' },
  { label: 'Chain Length', value: '18 Inches + 2 Inch Extender' },
  { label: 'Style', value: 'Everyday Minimalist & Layered Chic' },
];

export const SHIMMERING_ADDITIONAL_DETAILS: HighlightItem[] = [
  { label: 'Base Material', value: 'Skin-Safe Alloy & Simulated Pearls' },
  { label: 'Color', value: 'Lustrous Silver' },
  { label: 'Closure', value: 'Secure Lobster Clasp' },
  { label: 'Occasion', value: 'College, Office, Brunch & Gifting' },
  { label: 'Skin Safety', value: 'Hypoallergenic, Lead & Nickel Free' },
  { label: 'Origin', value: 'India' },
];

export const SHIMMERING_BUNDLE_OPTIONS: BundleOption[] = makeBundles('shimmering', 'Shimmering Pack of 5 Pendants', 349, 999);
export const SHIMMERING_REVIEWS_LIST: ReviewItem[] = makeReviews('shimmering', 'Shimmering Pack of 5 Pendants', [
  '/combo5_user_1.webp',
  '/combo5_user_2.webp',
]);
export const SHIMMERING_CUSTOMER_MEDIA: CustomerMediaItem[] = makeCustomerMedia('shimmering', [
  { src: '/combo5_user_1.webp', thumbSrc: '/combo5_user_1_thumb.webp', caption: 'All 5 chains look so delicate and chic', author: 'Aarohi D.', city: 'Hyderabad' },
  { src: '/combo5_user_2.webp', thumbSrc: '/combo5_user_2_thumb.webp', caption: 'Perfect for office & college wear', author: 'Neha T.', city: 'Chandigarh' },
]);

export const COMBO5_PRODUCT_DETAILS = SHIMMERING_PRODUCT_DETAILS;
export const COMBO5_PRODUCT_GALLERY = SHIMMERING_PRODUCT_GALLERY;
export const COMBO5_PRODUCT_HIGHLIGHTS = SHIMMERING_PRODUCT_HIGHLIGHTS;
export const COMBO5_ADDITIONAL_DETAILS = SHIMMERING_ADDITIONAL_DETAILS;
export const COMBO5_BUNDLE_OPTIONS = SHIMMERING_BUNDLE_OPTIONS;
export const COMBO5_REVIEWS_LIST = SHIMMERING_REVIEWS_LIST;
export const COMBO5_CUSTOMER_MEDIA = SHIMMERING_CUSTOMER_MEDIA;

// ============================================================================
// 4. ELEGANT EVERYDAY NECKLACE SET - COMBO OF 5
// ============================================================================
export const ELEGANT_EVERYDAY_PRODUCT_DETAILS: ProductDetails = {
  id: 'elegant-everyday-5',
  title: 'Elegant Everyday Necklace Set - Combo of 5 Necklaces with Cubic Zirconia Pendants',
  shortTitle: 'Elegant Everyday Combo of 5',
  tagline: '5 Gold-Plated Cubic Zirconia Everyday Pendant Necklaces',
  subtitle: 'Gold Plated Brass with Sparkling American Diamond / CZ Solitaire Motifs',
  fullDescription:
    'Elegant Everyday Necklace Set - Combo of 5 Necklaces. An artificial necklace set designed for daily wear, office wear, casual outfits, college, and dresses. Crafted with brass base metal, lustrous gold plating, and sparkling Cubic Zirconia / American Diamond stones. Features sleek, subtle, and stylish long pendant chains with adjustable extenders. Wear solo for minimalist charm or layer together.',
  rating: 4.9,
  ratingsCount: 1340,
  reviewsCount: 816,
  size: '18 Inch + 2 Inch Extender',
  price: 349,
  originalPrice: 999,
  discountPercent: 65,
  sku: 'QAV-ELEGANT-COMBO5-GLD',
  inStock: true,
  stockLeft: 14,
  recentSales24h: 109,
  currentLiveViewers: 27,
  freeDeliveryThreshold: 0,
  brand: 'QAVELLE',
  countryOfOrigin: 'India',
  badge: 'BEST VALUE COMBO',
  materials: 'Gold Plated Brass with Cubic Zirconia',
};

export const ELEGANT_EVERYDAY_PRODUCT_GALLERY: ProductGalleryItem[] = [
  { id: 'eleg-1', src: '/elegant_combo_1.webp', thumbSrc: '/elegant_combo_1_thumb.webp', alt: 'Elegant Everyday Gold Necklace Combo of 5', title: '5 Gold-Plated Everyday Pendants', tag: 'Best Value' },
  { id: 'eleg-2', src: '/elegant_combo_2.webp', thumbSrc: '/elegant_combo_2_thumb.webp', alt: 'Cubic Zirconia Pendant Detail', title: 'Sparkling CZ Stone Craftsmanship' },
  { id: 'eleg-3', src: '/elegant_combo_3.webp', thumbSrc: '/elegant_combo_3_thumb.webp', alt: 'Minimalist Gold Chain Look', title: 'Office & Casual Wardrobe Essential' },
  { id: 'eleg-4', src: '/elegant_combo_4.webp', thumbSrc: '/elegant_combo_4_thumb.webp', alt: 'Layered Necklace Styling', title: 'Effortless Multi-Layer Styling' },
  { id: 'eleg-5', src: '/elegant_combo_5.webp', thumbSrc: '/elegant_combo_5_thumb.webp', alt: 'Combo of 5 Necklaces Flatlay', title: '5 Separate Chains Included' },
];

export const ELEGANT_EVERYDAY_PRODUCT_HIGHLIGHTS: HighlightItem[] = [
  { label: 'Combo Includes', value: '5 Gold-Plated Pendant Necklaces' },
  { label: 'Stones', value: 'AAA Cubic Zirconia / American Diamonds' },
  { label: 'Plating', value: '18K Lustrous Micro Gold Polish' },
  { label: 'Length', value: '18 Inches + 2 Inch Extender' },
];

export const ELEGANT_EVERYDAY_ADDITIONAL_DETAILS: HighlightItem[] = [
  { label: 'Base Metal', value: 'Skin-Safe Brass' },
  { label: 'Color', value: '18K Warm Gold' },
  { label: 'Pattern', value: 'Geometric Minimalist Motifs' },
  { label: 'Closure', value: 'Adjustable Lobster Clasp' },
  { label: 'Skin Safety', value: 'Lead & Nickel Free' },
  { label: 'Origin', value: 'India' },
];

export const ELEGANT_EVERYDAY_BUNDLE_OPTIONS: BundleOption[] = makeBundles('elegant-everyday', 'Elegant Everyday Combo of 5', 349, 999);
export const ELEGANT_EVERYDAY_REVIEWS_LIST: ReviewItem[] = makeReviews('elegant-everyday', 'Elegant Everyday Combo of 5', ['/girl_reviewer_2.jpg']);
export const ELEGANT_EVERYDAY_CUSTOMER_MEDIA: CustomerMediaItem[] = makeCustomerMedia('elegant-everyday', [
  { src: '/elegant_combo_1.webp', thumbSrc: '/elegant_combo_1_thumb.webp', caption: 'Every piece looks refined and expensive', author: 'Shruti P.', city: 'Ahmedabad' },
]);

// ============================================================================
// 5. RADHIKA ANANT AMBANI INSPIRED GREEN AD NECKLACE SET
// ============================================================================
export const RADHIKA_GREEN_AD_SLUG = '/products/radhika-anant-ambani-inspired-green-ad-necklace-set';

export const RADHIKA_GREEN_AD_PRODUCT_DETAILS: ProductDetails = {
  id: 'radhika-green-ad',
  title: 'Radhika Anant Ambani Inspired Green AD Necklace Set with Matching Drop Earrings',
  shortTitle: 'Radhika Green AD Necklace Set',
  tagline: 'Celebrity-Inspired Colombian Emerald Green AD Choker & Chandelier Earrings',
  subtitle: 'Emerald-Cut Centerstones with Micro-Pavé American Diamonds & Anti-Tarnish Finish',
  fullDescription:
    'Trending celebrity masterpiece inspired by Radhika Ambani. Regal Emerald Green Austrian American Diamond Choker Necklace with Matching Chandelier Earrings, crafted with skin-safe brass alloy and anti-tarnish rhodium silver plating. Features emerald-cut centerstones with micro-pave crystals. Double-layered 24K gold and rhodium polish, 100% skin safe and hypoallergenic.',
  rating: 4.9,
  ratingsCount: 2150,
  reviewsCount: 1412,
  size: 'Adjustable Free Size',
  price: 399,
  originalPrice: 1299,
  discountPercent: 69,
  sku: 'QAV-RADHIKA-AMBANI-GREEN-AD',
  inStock: true,
  stockLeft: 7,
  recentSales24h: 216,
  currentLiveViewers: 54,
  freeDeliveryThreshold: 0,
  brand: 'QAVELLE',
  countryOfOrigin: 'India',
  badge: 'TRENDING CELEBRITY',
  materials: 'Rhodium Plated Brass with Emerald CZ & American Diamonds',
};

export const RADHIKA_GREEN_AD_PRODUCT_GALLERY: ProductGalleryItem[] = [
  { id: 'radh-1', src: '/radhika_ambani_1.webp', thumbSrc: '/radhika_ambani_1_thumb.webp', alt: 'Radhika Green AD Necklace Set Hero', title: 'Celebrity Emerald Green AD Set', tag: 'Trending Celebrity' },
  { id: 'radh-2', src: '/radhika_ambani_2.webp', thumbSrc: '/radhika_ambani_2_thumb.webp', alt: 'Emerald AD Necklace Detail', title: 'Emerald-Cut Stones & Micro-Pavé' },
  { id: 'radh-3', src: '/radhika_ambani_3.webp', thumbSrc: '/radhika_ambani_3_thumb.webp', alt: 'Matching Green AD Drop Earrings', title: 'Matching Chandelier Earrings Included' },
  { id: 'radh-4', src: '/radhika_ambani_4.webp', thumbSrc: '/radhika_ambani_4_thumb.webp', alt: 'Bridal Emerald Styling View', title: 'Regal Sangeet & Wedding Look' },
  { id: 'radh-5', src: '/radhika_ambani_5.webp', thumbSrc: '/radhika_ambani_5_thumb.webp', alt: 'Necklace Set Presentation', title: 'Royal Velvet Box Packaging' },
];

export const RADHIKA_GREEN_AD_PRODUCT_HIGHLIGHTS: HighlightItem[] = [
  { label: 'Design', value: 'Celebrity Emerald Green AD Masterpiece' },
  { label: 'Set Includes', value: 'Choker Necklace + Matching Drop Earrings' },
  { label: 'Stone Quality', value: 'Emerald-Cut CZ & Micro-Pavé AD' },
  { label: 'Plating', value: 'Anti-Tarnish Rhodium Silver Finish' },
];

export const RADHIKA_GREEN_AD_ADDITIONAL_DETAILS: HighlightItem[] = [
  { label: 'Base Metal', value: 'Hypoallergenic Brass Alloy' },
  { label: 'Color', value: 'Colombian Emerald Green & Silver' },
  { label: 'Setting', value: 'Royal Filigree & Pavé Setting' },
  { label: 'Fit', value: 'Adjustable Free Size Back Clasp' },
  { label: 'Occasion', value: 'Weddings, Receptions & Festive Galas' },
  { label: 'Origin', value: 'India' },
];

export const RADHIKA_GREEN_AD_BUNDLE_OPTIONS: BundleOption[] = makeBundles('radhika-green-ad', 'Radhika Green AD Necklace Set', 399, 1299);
export const RADHIKA_GREEN_AD_REVIEWS_LIST: ReviewItem[] = makeReviews('radhika-green-ad', 'Radhika Green AD Necklace Set', [
  '/radhika_green_lifestyle.webp',
  '/girl_reviewer_3.jpg',
]);
export const RADHIKA_GREEN_AD_CUSTOMER_MEDIA: CustomerMediaItem[] = makeCustomerMedia('radhika-green-ad', [
  { src: '/radhika_green_hero.webp', thumbSrc: '/radhika_green_hero_thumb.webp', caption: 'Total showstopper at my cousin’s wedding!', author: 'Diya K.', city: 'Surat' },
  { src: '/radhika_green_earrings.webp', thumbSrc: '/radhika_green_earrings_thumb.webp', caption: 'The emerald sparkle is unbelievable', author: 'Nisha V.', city: 'Noida' },
]);

// ============================================================================
// 6. ROYAL ELEGANT GOLD PLATED JEWELLERY SET (ALLURE GOLD SET)
// ============================================================================
export const ALLURE_GOLD_SET_SLUG = '/products/royal-elegant-gold-plated-jewellery-set';

export const ALLURE_GOLD_SET_PRODUCT_DETAILS: ProductDetails = {
  id: 'allure-gold-set',
  title: 'Royal Elegant Gold Plated Jewellery Set with Matching Earrings',
  shortTitle: 'Royal Elegant Gold Set',
  tagline: 'Majestic 22K Micro Gold-Plated Heritage Necklace Set with Ruby Accents',
  subtitle: 'Includes Necklace, Drop Earrings, Adjustable Bracelet & Cocktail Ring',
  fullDescription:
    'Majestic 22K micro gold-plated heritage necklace set adorned with intricate leaf-shaped crystal motifs, imperial ruby-red gemstones, matching drop earrings, adjustable bracelet, and cocktail ring. Complete with free royal velvet presentation box and certificate of authenticity.',
  rating: 4.9,
  ratingsCount: 1620,
  reviewsCount: 980,
  size: 'Adjustable Free Size',
  price: 849,
  originalPrice: 2799,
  discountPercent: 70,
  sku: 'QAV-ROYAL-GOLD-SET-849',
  inStock: true,
  stockLeft: 8,
  recentSales24h: 94,
  currentLiveViewers: 29,
  freeDeliveryThreshold: 0,
  brand: 'QAVELLE',
  countryOfOrigin: 'India',
  badge: 'ROYAL HERITAGE',
  materials: '22K Micro Gold Plated Brass Alloy with Ruby Stones & Austrian Crystals',
};

export const ALLURE_GOLD_SET_PRODUCT_GALLERY: ProductGalleryItem[] = [
  { id: 'all-1', src: '/aa1.webp', thumbSrc: '/aa1_thumb.webp', alt: 'Royal Elegant Gold Plated Jewellery Set', title: '22K Micro Gold Heritage Set', tag: 'Royal Heritage' },
  { id: 'all-2', src: '/aaa2.webp', thumbSrc: '/aaa2_thumb.webp', alt: 'Ruby & Crystal Leaf Motifs Close-up', title: 'Imperial Ruby & Crystal Work' },
  { id: 'all-3', src: '/aa3.webp', thumbSrc: '/aa3_thumb.webp', alt: 'Matching Drop Earrings Detail', title: 'Matching Drop Earrings Included' },
  { id: 'all-4', src: '/aa4.webp', thumbSrc: '/aa4_thumb.webp', alt: 'Complete Royal Set View', title: 'Bracelet & Cocktail Ring Included' },
  { id: 'all-5', src: '/aa5.webp', thumbSrc: '/aa5_thumb.webp', alt: 'Royal Velvet Box Presentation', title: 'Free Velvet Presentation Box' },
];

export const ALLURE_GOLD_SET_PRODUCT_HIGHLIGHTS: HighlightItem[] = [
  { label: 'Complete Set', value: 'Necklace + Earrings + Bracelet + Ring' },
  { label: 'Plating', value: '22K Micro Gold Anti-Tarnish Finish' },
  { label: 'Gemstones', value: 'Imperial Ruby Stones & Austrian Crystals' },
  { label: 'Packaging', value: 'Royal Velvet Box + Authenticity Card' },
];

export const ALLURE_GOLD_SET_ADDITIONAL_DETAILS: HighlightItem[] = [
  { label: 'Base Metal', value: 'Skin-Safe Brass Alloy' },
  { label: 'Color', value: '22K Gold & Imperial Ruby' },
  { label: 'Pattern', value: 'Royal Heritage Filigree' },
  { label: 'Size', value: 'Adjustable Free Size' },
  { label: 'Occasion', value: 'Weddings, Pujas & Grand Celebrations' },
  { label: 'Origin', value: 'Handcrafted in India' },
];

export const ALLURE_GOLD_SET_BUNDLE_OPTIONS: BundleOption[] = makeBundles('allure-gold-set', 'Royal Elegant Gold Jewellery Set', 849, 2799);
export const ALLURE_GOLD_SET_REVIEWS_LIST: ReviewItem[] = makeReviews('allure-gold-set', 'Royal Elegant Gold Set', ['/allure_gold_model.webp']);
export const ALLURE_GOLD_SET_CUSTOMER_MEDIA: CustomerMediaItem[] = makeCustomerMedia('allure-gold-set', [
  { src: '/allure_gold_1.webp', thumbSrc: '/allure_gold_1_thumb.webp', caption: 'Authentic 22K gold-like finish!', author: 'Sunita G.', city: 'Indore' },
  { src: '/allure_gold_2.webp', thumbSrc: '/allure_gold_2_thumb.webp', caption: 'Complete 4-piece heritage look', author: 'Pallavi B.', city: 'Nagpur' },
]);

// ============================================================================
// 7. TRENDY ALLOY GOLD PLATED KUNDAN & PEARL JEWELLERY SET
// ============================================================================
export const TRENDY_ALLOY_SET_SLUG = '/products/trendy-alloy-gold-plated-jewellery-set';

export const TRENDY_ALLOY_SET_PRODUCT_DETAILS: ProductDetails = {
  id: 'trendy-alloy-set',
  title: 'Trendy Alloy Gold Plated Kundan & Pearl Jewellery Set with Matching Drop Earrings',
  shortTitle: 'Trendy Kundan & Pearl Set',
  tagline: 'Handcrafted 22K Micro Gold-Plated Kundan & Austrian Pearl Necklace Set',
  subtitle: 'Traditional Kundan Filigree with Matching Pearl Drop Earrings & Velvet Box',
  fullDescription:
    'Exquisite handcrafted alloy necklace enriched with lustrous Austrian pearls, royal kundan stones, and matching drop earrings. Engineered with a durable skin-safe base, 22K micro gold plating, and an anti-tarnish protective coating. Ideal for weddings, festive pujas, and ethnic celebrations. Complete with free luxury velvet jewelry box and certificate of authenticity.',
  rating: 4.8,
  ratingsCount: 1210,
  reviewsCount: 734,
  size: 'Adjustable Free Size',
  price: 849,
  originalPrice: 2799,
  discountPercent: 70,
  sku: 'QAV-TRENDY-ALLOY-849',
  inStock: true,
  stockLeft: 12,
  recentSales24h: 88,
  currentLiveViewers: 24,
  freeDeliveryThreshold: 0,
  brand: 'QAVELLE',
  countryOfOrigin: 'India',
  badge: 'TRENDY BESTSELLER',
  materials: '22K Micro Gold Plated Alloy, Kundan & Austrian Pearls',
};

export const TRENDY_ALLOY_SET_PRODUCT_GALLERY: ProductGalleryItem[] = [
  { id: 'trnd-1', src: '/b1.webp', thumbSrc: '/b1_thumb.webp', alt: 'Trendy Kundan & Pearl Jewellery Set', title: 'Royal Kundan & Pearl Necklace Set', tag: 'Bestseller' },
  { id: 'trnd-2', src: '/b2.webp', thumbSrc: '/b2_thumb.webp', alt: 'Kundan Filigree Close-up', title: 'Handcrafted Kundan Setting' },
  { id: 'trnd-3', src: '/b3.webp', thumbSrc: '/b3_thumb.webp', alt: 'Matching Pearl Drop Earrings', title: 'Austrian Pearl Drop Earrings' },
  { id: 'trnd-4', src: '/b4.webp', thumbSrc: '/b4_thumb.webp', alt: 'Ethnic Festive Styling', title: '22K Micro Gold Protective Coating' },
  { id: 'trnd-5', src: '/b5.webp', thumbSrc: '/b5_thumb.webp', alt: 'Full Jewellery Set Presentation', title: 'Luxury Velvet Presentation Box' },
];

export const TRENDY_ALLOY_SET_PRODUCT_HIGHLIGHTS: HighlightItem[] = [
  { label: 'Set Includes', value: 'Kundan Necklace + Matching Drop Earrings' },
  { label: 'Plating', value: '22K Micro Gold Anti-Tarnish Finish' },
  { label: 'Embellishments', value: 'Royal Kundan Stones & Austrian Pearls' },
  { label: 'Comfort', value: 'Skin-Safe Adjustable Festive Fit' },
];

export const TRENDY_ALLOY_SET_ADDITIONAL_DETAILS: HighlightItem[] = [
  { label: 'Base Metal', value: 'Hypoallergenic Alloy' },
  { label: 'Color', value: '22K Gold & White Pearl' },
  { label: 'Pattern', value: 'Traditional Kundan Filigree' },
  { label: 'Occasion', value: 'Weddings, Pujas & Ethnic Celebrations' },
  { label: 'Packaging', value: 'Free Royal Velvet Box' },
  { label: 'Origin', value: 'India' },
];

export const TRENDY_ALLOY_SET_BUNDLE_OPTIONS: BundleOption[] = makeBundles('trendy-alloy-set', 'Trendy Kundan & Pearl Set', 849, 2799);
export const TRENDY_ALLOY_SET_REVIEWS_LIST: ReviewItem[] = makeReviews('trendy-alloy-set', 'Trendy Kundan & Pearl Set', ['/girl_reviewer_4.jpg']);
export const TRENDY_ALLOY_SET_CUSTOMER_MEDIA: CustomerMediaItem[] = makeCustomerMedia('trendy-alloy-set', [
  { src: '/b1.webp', thumbSrc: '/b1_thumb.webp', caption: 'So graceful with silk sarees!', author: 'Madhuri J.', city: 'Mysuru' },
]);

// ============================================================================
// 8. COMBO OF 2 AESTHETIC DAILY WEAR PENDANTS (PASTEL PINK & PANNA GREEN)
// ============================================================================
export const AESTHETIC_PENDANT_COMBO_SLUG =
  '/products/combo-of-2-aesthetic-daily-wear-pendants-stylish-pastel-pink-panna-green-locket-with-sleek-chain';

export const AESTHETIC_PENDANT_COMBO_PRODUCT_DETAILS: ProductDetails = {
  id: 'combo-2-pendants',
  title: 'Combo of 2 Aesthetic Daily Wear Pendants: Stylish Pastel Pink & Panna Green Locket with Sleek Chain',
  shortTitle: 'Combo of 2 Aesthetic Pendants',
  tagline: 'Korean Minimalist Duo — Pastel Blush Pink & Royal Panna Green Solitaire Lockets',
  subtitle: '2 Separate Anti-Tarnish Pendant Chains with Free Luxury Velvet Pouch',
  fullDescription:
    'A must-have Korean minimalist duo crafted for everyday styling. This combo pack includes 2 separate dainty pendant chains: one featuring a delicate pastel blush pink solitaire crystal locket, and the second featuring a rich royal emerald panna green crystal locket. Finished with sleek, anti-tarnish Italian link chains, hypoallergenic brass alloy, and smooth lobster clasps with 2-inch extenders. Complimentary luxury velvet gift pouch included.',
  rating: 4.9,
  ratingsCount: 1460,
  reviewsCount: 890,
  size: '16 Inch + 2 Inch Extender',
  price: 549,
  originalPrice: 1499,
  discountPercent: 63,
  sku: 'QAV-AESTHETIC-COMBO2-549',
  inStock: true,
  stockLeft: 16,
  recentSales24h: 142,
  currentLiveViewers: 36,
  freeDeliveryThreshold: 0,
  brand: 'QAVELLE',
  countryOfOrigin: 'India',
  badge: 'ROYAL VIRAL TRENDING',
  materials: 'Micro Rhodium & 18K Polish Alloy with Solitaire Crystals',
};

export const AESTHETIC_PENDANT_COMBO_PRODUCT_GALLERY: ProductGalleryItem[] = [
  { id: 'aes-1', src: '/c1.webp', thumbSrc: '/c1_thumb.webp', alt: 'Combo of 2 Pastel Pink & Panna Green Pendants', title: 'Pastel Pink & Panna Green Duo', tag: 'Royal Viral' },
  { id: 'aes-2', src: '/c2.webp', thumbSrc: '/c2_thumb.webp', alt: 'Panna Green Solitaire Pendant Close-up', title: 'Royal Emerald Panna Green Locket' },
  { id: 'aes-3', src: '/c3.webp', thumbSrc: '/c3_thumb.webp', alt: 'Pastel Blush Pink Locket Close-up', title: 'Delicate Pastel Blush Pink Locket' },
  { id: 'aes-4', src: '/c4.webp', thumbSrc: '/c4_thumb.webp', alt: 'Aesthetic Daily Wear Styling', title: 'Sleek Italian Link Chains' },
  { id: 'aes-5', src: '/c5.webp', thumbSrc: '/c5_thumb.webp', alt: 'Combo of 2 Pendants Gift View', title: 'Complimentary Velvet Gift Pouch' },
];

export const AESTHETIC_PENDANT_COMBO_PRODUCT_HIGHLIGHTS: HighlightItem[] = [
  { label: 'Combo Includes', value: '2 Individual Pendant Chains (Pink + Green)' },
  { label: 'Style', value: 'Korean Minimalist Daily Wear Solitaire' },
  { label: 'Chain', value: '16 Inch + 2 Inch Adjustable Extender' },
  { label: 'Finish', value: 'Anti-Tarnish Micro Polish, Skin Safe' },
];

export const AESTHETIC_PENDANT_COMBO_ADDITIONAL_DETAILS: HighlightItem[] = [
  { label: 'Colors', value: 'Pastel Pink & Panna Green' },
  { label: 'Material', value: 'Hypoallergenic Brass Alloy & Crystals' },
  { label: 'Closure', value: 'Smooth Lobster Clasp' },
  { label: 'Occasion', value: 'Daily Wear, College, Office & Gifting' },
  { label: 'Packaging', value: 'Free Luxury Velvet Gift Pouch' },
  { label: 'Origin', value: 'India' },
];

export const AESTHETIC_PENDANT_COMBO_BUNDLE_OPTIONS: BundleOption[] = makeBundles('combo-2-pendants', 'Combo of 2 Aesthetic Pendants', 549, 1499);
export const AESTHETIC_PENDANT_COMBO_REVIEWS_LIST: ReviewItem[] = makeReviews('combo-2-pendants', 'Combo of 2 Aesthetic Pendants', ['/combo_2_aesthetic_model.webp']);
export const AESTHETIC_PENDANT_COMBO_CUSTOMER_MEDIA: CustomerMediaItem[] = makeCustomerMedia('combo-2-pendants', [
  { src: '/combo_2_aesthetic_hero.webp', thumbSrc: '/combo_2_aesthetic_hero_thumb.webp', caption: 'Both colours look super aesthetic!', author: 'Ishita M.', city: 'Kolkata' },
  { src: '/combo_2_aesthetic_flatlay.webp', thumbSrc: '/combo_2_aesthetic_flatlay_thumb.webp', caption: 'Minimalist perfection for everyday', author: 'Tanvi S.', city: 'Gurugram' },
]);

// ============================================================================
// 9. GOLD PLATED STAINLESS STEEL EMERALD CZ FLAT SNAKE CHAIN NECKLACE
// ============================================================================
export const EMERALD_SNAKE_SLUG =
  '/products/gold-plated-stainless-steel-cubic-zirconia-pendant-green-emerald-anti-tarnish-gold-plated-stainless-steel-flat-snake-chain-necklace-green-waterproof-chain-layering-pendant-gifts-for-women-and-girls';

export const EMERALD_SNAKE_PRODUCT_DETAILS: ProductDetails = {
  id: 'emerald-snake-pendant',
  title: 'Gold Plated Stainless Steel Cubic Zirconia Pendant Green Emerald Anti-Tarnish Flat Snake Chain Necklace',
  shortTitle: 'Emerald Anti-Tarnish Snake Chain',
  tagline: '100% Waterproof 18K PVD Gold 316L Stainless Steel Flat Snake Chain + Emerald CZ',
  subtitle: 'Sweatproof, Shower-Safe Anti-Tarnish Herringbone Chain with Emerald Solitaire',
  fullDescription:
    'Elevate your everyday luxury with this premium 18K Gold Plated Stainless Steel Flat Snake Chain Necklace featuring an opulent radiant-cut Emerald Green Cubic Zirconia solitaire pendant. Masterfully crafted from surgical-grade 316L stainless steel with a high-mirror liquid gold herringbone weave that glides seamlessly against your collarbone. Engineered with advanced anti-tarnish vacuum PVD gold plating, making it 100% waterproof, sweatproof, and shower-safe without fading. Complete with an adjustable lobster clasp extender.',
  rating: 4.9,
  ratingsCount: 1740,
  reviewsCount: 1085,
  size: '16 Inch + 2 Inch Extender',
  price: 549,
  originalPrice: 1499,
  discountPercent: 63,
  sku: 'QAV-EMERALD-SNAKE-549',
  inStock: true,
  stockLeft: 14,
  recentSales24h: 165,
  currentLiveViewers: 44,
  freeDeliveryThreshold: 0,
  brand: 'QAVELLE',
  countryOfOrigin: 'India',
  badge: '100% WATERPROOF',
  materials: '18K Gold Plated 316L Stainless Steel & Emerald CZ',
};

export const EMERALD_SNAKE_PRODUCT_GALLERY: ProductGalleryItem[] = [
  { id: 'es-1', src: '/d1.webp', thumbSrc: '/d1_thumb.webp', alt: 'Emerald CZ Anti-Tarnish Flat Snake Chain Necklace', title: '18K PVD Gold Emerald Snake Chain', tag: '100% Waterproof' },
  { id: 'es-2', src: '/d2.webp', thumbSrc: '/d2_thumb.webp', alt: 'Liquid Gold Herringbone Weave Close-up', title: 'Mirror-Finish Flat Snake Weave' },
  { id: 'es-3', src: '/d3.webp', thumbSrc: '/d3_thumb.webp', alt: 'Emerald Solitaire Pendant Detail', title: 'Radiant-Cut Emerald Green CZ' },
  { id: 'es-4', src: '/emerald_snake_waterproof.webp', thumbSrc: '/emerald_snake_waterproof_thumb.webp', alt: 'Waterproof Anti-Tarnish Guarantee', title: 'Waterproof & Sweatproof 316L Steel' },
  { id: 'es-5', src: '/emerald_snake_box.webp', thumbSrc: '/emerald_snake_box_thumb.webp', alt: 'Luxury Gift Box View', title: 'Gift-Ready QAVELLE Velvet Box' },
];

export const EMERALD_SNAKE_PRODUCT_HIGHLIGHTS: HighlightItem[] = [
  { label: 'Durability', value: '100% Waterproof, Sweatproof & Anti-Tarnish' },
  { label: 'Base Metal', value: 'Surgical-Grade 316L Stainless Steel' },
  { label: 'Plating', value: '18K Vacuum PVD Gold Plating' },
  { label: 'Pendant', value: 'Radiant-Cut Emerald Green Cubic Zirconia' },
];

export const EMERALD_SNAKE_ADDITIONAL_DETAILS: HighlightItem[] = [
  { label: 'Chain Style', value: 'Liquid Flat Snake Herringbone' },
  { label: 'Length', value: '16 Inch + 2 Inch Extender' },
  { label: 'Color', value: 'Emerald Green & 18K Gold' },
  { label: 'Skin Safety', value: 'Hypoallergenic, Tarnish-Free Daily Wear' },
  { label: 'Occasion', value: 'Everyday Luxury, Office, Brunch & Gifts' },
  { label: 'Origin', value: 'India' },
];

export const EMERALD_SNAKE_BUNDLE_OPTIONS: BundleOption[] = makeBundles('emerald-snake', 'Emerald Anti-Tarnish Snake Chain', 549, 1499);
export const EMERALD_SNAKE_REVIEWS_LIST: ReviewItem[] = makeReviews('emerald-snake', 'Emerald Snake Chain Necklace', ['/emerald_snake_model.webp']);
export const EMERALD_SNAKE_CUSTOMER_MEDIA: CustomerMediaItem[] = makeCustomerMedia('emerald-snake', [
  { src: '/emerald_snake_hero.webp', thumbSrc: '/emerald_snake_hero_thumb.webp', caption: 'Literally shower-safe and still glows like real gold', author: 'Aisha K.', city: 'Mumbai' },
  { src: '/emerald_snake_chain.webp', thumbSrc: '/emerald_snake_chain_thumb.webp', caption: 'Sits so flat and sleek on the collarbone', author: 'Ritika A.', city: 'Pune' },
]);

// ============================================================================
// 10. HIGH GRADE U-SHAPED WHITE ENAMEL HANDBAG DROP EARRINGS
// ============================================================================
export const WHITE_ENAMEL_HANDBAG_EARRINGS_SLUG =
  '/products/suyug-high-grade-u-shaped-white-enemel-handbag-drop-earrings-for-women-and-girls';

export const WHITE_ENAMEL_HANDBAG_EARRINGS_PRODUCT_DETAILS: ProductDetails = {
  id: 'white-enamel-handbag-earrings',
  title: 'High Grade U Shaped White Enamel Handbag Drop Earrings For Women And Girls',
  shortTitle: 'White Enamel Handbag Earrings',
  tagline: 'Parisian Couture Chic — 18K Gold Plated U-Shaped White Enamel Handbag Drops',
  subtitle: 'High-Gloss Milk-White Enamel Inlay with Featherlight Click-Top Hinged Latch',
  fullDescription:
    'A breathtaking fusion of playful whimsy and modern Parisian couture elegance. Crafted with an ultra-lightweight hypoallergenic alloy core and bathed in 18K yellow gold micron plating, each earring features a dainty U-shaped miniature handbag silhouette filled with high-gloss milk-white enamel inlay and an arched golden handle. Designed with a secure click-top hinged latch back for effortless all-day comfort without tugging on ear lobes.',
  rating: 4.9,
  ratingsCount: 1180,
  reviewsCount: 695,
  size: '2.2 cm Drop Length',
  price: 399,
  originalPrice: 999,
  discountPercent: 60,
  sku: 'QVL-EARRING-63UP0K',
  inStock: true,
  stockLeft: 19,
  recentSales24h: 127,
  currentLiveViewers: 33,
  freeDeliveryThreshold: 0,
  brand: 'QAVELLE',
  countryOfOrigin: 'India',
  badge: 'ROYAL VIRAL TRENDING',
  materials: '18K Gold Plated Alloy & Glossy Enamel',
};

export const WHITE_ENAMEL_HANDBAG_EARRINGS_PRODUCT_GALLERY: ProductGalleryItem[] = [
  { id: 'whb-1', src: '/e1.webp', thumbSrc: '/e1_thumb.webp', alt: 'U-Shaped White Enamel Handbag Drop Earrings', title: 'Parisian White Enamel Handbag Earrings', tag: 'Korean Chic' },
  { id: 'whb-2', src: '/e2.webp', thumbSrc: '/e2_thumb.webp', alt: 'White Enamel Inlay & Gold Handle Detail', title: '18K Gold Micron Polish & Milk-White Enamel' },
  { id: 'whb-3', src: '/e3.webp', thumbSrc: '/e3_thumb.webp', alt: 'Handbag Drop Earrings Side Angle', title: 'Secure Click-Top Hinged Latch' },
];

export const WHITE_ENAMEL_HANDBAG_EARRINGS_PRODUCT_HIGHLIGHTS: HighlightItem[] = [
  { label: 'Motif', value: 'Miniature U-Shaped Couture Handbag' },
  { label: 'Finish', value: '18K Yellow Gold Plating & Glossy Enamel' },
  { label: 'Closure', value: 'Effortless Click-Top Hinged Latch' },
  { label: 'Comfort', value: 'Ultra-Lightweight All-Day Wear (2.2 cm)' },
];

export const WHITE_ENAMEL_HANDBAG_EARRINGS_ADDITIONAL_DETAILS: HighlightItem[] = [
  { label: 'Base Material', value: 'Hypoallergenic Alloy & Enamel' },
  { label: 'Color', value: 'Gold & Milk-White Enamel' },
  { label: 'Drop Length', value: '2.2 cm' },
  { label: 'Style', value: 'Korean / Parisian Minimalist Chic' },
  { label: 'Skin Safety', value: 'Lead & Nickel Free' },
  { label: 'Origin', value: 'India' },
];

export const WHITE_ENAMEL_HANDBAG_EARRINGS_BUNDLE_OPTIONS: BundleOption[] = makeBundles('handbag-earrings', 'White Enamel Handbag Earrings', 399, 999);
export const WHITE_ENAMEL_HANDBAG_EARRINGS_REVIEWS_LIST: ReviewItem[] = makeReviews('handbag-earrings', 'White Enamel Handbag Earrings', [
  '/white_handbag_user_1.webp',
  '/white_handbag_user_2.webp',
  '/white_handbag_user_3.webp',
]);
export const WHITE_ENAMEL_HANDBAG_EARRINGS_CUSTOMER_MEDIA: CustomerMediaItem[] = makeCustomerMedia('handbag-earrings', [
  { src: '/white_handbag_user_1.webp', thumbSrc: '/white_handbag_user_1_thumb.webp', caption: 'Cutest earrings I own! So classy', author: 'Simran K.', city: 'New Delhi' },
  { src: '/white_handbag_user_2.webp', thumbSrc: '/white_handbag_user_2_thumb.webp', caption: 'Super lightweight and zero irritation', author: 'Kritika S.', city: 'Bengaluru' },
  { src: '/white_handbag_user_3.webp', thumbSrc: '/white_handbag_user_3_thumb.webp', caption: 'Goes with every western outfit', author: 'Vanshika R.', city: 'Jaipur' },
]);

// ============================================================================
// 11. COMBO OF 3 ELEGANT DOLPHIN CRYSTALS PENDANT NECKLACES
// ============================================================================
export const DOLPHIN_CRYSTALS_PENDANT_COMBO_SLUG =
  '/products/combo-of-3-elegant-dolphin-crystals-pendant-necklace-for-women-silver-plated-round-charm-with-colored-stone-pink-purple-sky';

export const DOLPHIN_CRYSTALS_PENDANT_COMBO_PRODUCT_DETAILS: ProductDetails = {
  id: 'dolphin-crystals-pendant-combo',
  title: 'Combo Of 3 Elegant Dolphin Crystals Pendant Necklace for Women Silver Plated Round Charm with Colored Stone (Pink, Purple, Sky)',
  shortTitle: 'Combo of 3 Dolphin Crystal Pendants',
  tagline: '3 Silver-Plated Leaping Dolphin Crystal Necklaces (Pink, Purple & Sky Blue)',
  subtitle: 'Faceted Round Crystal Gemstones with Skin-Safe Silver Link Chains',
  fullDescription:
    'An enchanting symbol of joy, freedom, harmony, and affectionate friendship. This signature viral combo includes 3 individual silver-plated pendant necklaces, each showcasing a finely sculpted leaping dolphin silhouette encircling a brilliant round faceted crystal gemstone in Blush Rose Pink, Amethyst Purple, and Ocean Sky Blue. Suspended on sleek, skin-friendly silver-plated link chains with secure lobster clasp closures. Perfect for Western chic, casual college outfits, brunch wear, and BFF gifting.',
  rating: 4.9,
  ratingsCount: 1390,
  reviewsCount: 845,
  size: '45 cm + 5 cm Extender',
  price: 499,
  originalPrice: 1499,
  discountPercent: 67,
  sku: 'QVL-DOLPHIN-F1V4I9',
  inStock: true,
  stockLeft: 12,
  recentSales24h: 136,
  currentLiveViewers: 34,
  freeDeliveryThreshold: 0,
  brand: 'QAVELLE',
  countryOfOrigin: 'India',
  badge: 'ROYAL VIRAL COMBO',
  materials: 'Silver Plated Alloy & Faceted Crystals',
};

export const DOLPHIN_CRYSTALS_PENDANT_COMBO_PRODUCT_GALLERY: ProductGalleryItem[] = [
  { id: 'dol-1', src: '/dolphin_f2.webp', thumbSrc: '/dolphin_f2_thumb.webp', alt: 'Combo of 3 Dolphin Crystals Pendant Necklaces', title: '3 Dolphin Crystal Pendants (Pink, Purple, Sky)', tag: 'Combo of 3' },
  { id: 'dol-2', src: '/dolphin_f3.webp', thumbSrc: '/dolphin_f3_thumb.webp', alt: 'Blush Rose Pink Dolphin Crystal Pendant', title: 'Blush Rose Pink Faceted Crystal' },
  { id: 'dol-3', src: '/dolphin_f4.webp', thumbSrc: '/dolphin_f4_thumb.webp', alt: 'Amethyst Purple Dolphin Pendant', title: 'Amethyst Purple Dolphin Charm' },
  { id: 'dol-4', src: '/dolphin_f5.webp', thumbSrc: '/dolphin_f5_thumb.webp', alt: 'Ocean Sky Blue Dolphin Pendant', title: 'Ocean Sky Blue Crystal Pendant' },
  { id: 'dol-5', src: '/dolphin_f6.webp', thumbSrc: '/dolphin_f6_thumb.webp', alt: 'Silver Link Chain & Clasp Detail', title: 'Perfect for Everyday & BFF Gifting' },
];

export const DOLPHIN_CRYSTALS_PENDANT_COMBO_PRODUCT_HIGHLIGHTS: HighlightItem[] = [
  { label: 'Combo Includes', value: '3 Separate Dolphin Crystal Necklaces' },
  { label: 'Crystal Shades', value: 'Blush Pink, Amethyst Purple & Sky Blue' },
  { label: 'Plating', value: 'High-Shine Skin-Safe Silver Polish' },
  { label: 'Length', value: '45 cm Chain + 5 cm Extender' },
];

export const DOLPHIN_CRYSTALS_PENDANT_COMBO_ADDITIONAL_DETAILS: HighlightItem[] = [
  { label: 'Material', value: 'Silver Plated Alloy & Faceted Crystals' },
  { label: 'Motif', value: 'Leaping Dolphin Circle Charm' },
  { label: 'Closure', value: 'Secure Lobster Clasp' },
  { label: 'Occasion', value: 'College, Casual Chic & BFF Gifting' },
  { label: 'Skin Safety', value: 'Lead & Nickel Free' },
  { label: 'Origin', value: 'India' },
];

export const DOLPHIN_CRYSTALS_PENDANT_COMBO_BUNDLE_OPTIONS: BundleOption[] = makeBundles('dolphin-combo', 'Combo of 3 Dolphin Pendants', 499, 1499);
export const DOLPHIN_CRYSTALS_PENDANT_COMBO_REVIEWS_LIST: ReviewItem[] = makeReviews('dolphin-combo', 'Combo of 3 Dolphin Crystal Pendants', ['/dolphin_f2.webp']);
export const DOLPHIN_CRYSTALS_PENDANT_COMBO_CUSTOMER_MEDIA: CustomerMediaItem[] = makeCustomerMedia('dolphin-combo', [
  { src: '/dolphin_f2.webp', thumbSrc: '/dolphin_f2_thumb.webp', caption: 'Gifted two to my best friends & kept one!', author: 'Rhea M.', city: 'Chennai' },
]);

// ============================================================================
// 12. TRENDY DESIGNER THIN AS RICE 21 INCHES SILVER CHAIN
// ============================================================================
export const THIN_AS_RICE_SILVER_CHAIN_SLUG =
  '/products/trendy-designer-thin-as-rice-21-inches-25-gram-rice-chain-for-women-and-girls-black-silver-plated-brass-metal-chain';

export const THIN_AS_RICE_SILVER_CHAIN_PRODUCT_DETAILS: ProductDetails = {
  id: 'thin-as-rice-silver-chain',
  title: 'Trendy Designer Thin as Rice 21 inches 2.5 gram Rice chain for women and Girls Black Silver Plated Brass Metal Chain',
  shortTitle: 'Thin as Rice 21" Silver Chain',
  tagline: 'Ultra-Fine 2.5g Featherweight Faceted Rice-Grain Chain with Diamond-Like Shimmer',
  subtitle: '21-Inch High-Shine Black Silver Micron Plated Brass Metal Chain',
  fullDescription:
    'Indulge in understated luxury with the viral Thin as Rice chain necklace. Crafted from premium brass with high-shine black silver micron plating, this piece features an ultra-fine rice-grain faceted weave that catches and reflects ambient light like diamonds. Measuring 21 inches in length and weighing just 2.5 grams, it provides a featherweight, skin-friendly silhouette that is barely felt yet distinctly visible. Perfect as an everyday standalone minimal necklace or for layering with your favourite pendants. 100% skin safe, lead and nickel free.',
  rating: 4.9,
  ratingsCount: 1640,
  reviewsCount: 1020,
  size: '21 Inches (2.5 Grams)',
  price: 349,
  originalPrice: 999,
  discountPercent: 65,
  sku: 'QVL-RICE-70GS5Y',
  inStock: true,
  stockLeft: 14,
  recentSales24h: 173,
  currentLiveViewers: 41,
  freeDeliveryThreshold: 0,
  brand: 'QAVELLE',
  countryOfOrigin: 'India',
  badge: 'ROYAL VIRAL TREND',
  materials: 'Black Silver Plated Brass',
};

export const THIN_AS_RICE_SILVER_CHAIN_PRODUCT_GALLERY: ProductGalleryItem[] = [
  { id: 'rice-1', src: '/g1.webp', thumbSrc: '/g1_thumb.webp', alt: 'Thin as Rice 21 inch Silver Chain', title: 'Ultra-Fine 2.5g Rice-Grain Chain', tag: 'Royal Viral' },
  { id: 'rice-2', src: '/g2.webp', thumbSrc: '/g2_thumb.webp', alt: 'Faceted Rice Chain Light Reflection Close-up', title: 'Diamond-Like Faceted Light Reflection' },
  { id: 'rice-3', src: '/g3.webp', thumbSrc: '/g3_thumb.webp', alt: '21-inch Minimalist Chain Styling', title: 'Wear Solo or Layer with Pendants' },
];

export const THIN_AS_RICE_SILVER_CHAIN_PRODUCT_HIGHLIGHTS: HighlightItem[] = [
  { label: 'Weave', value: 'Ultra-Fine Faceted Rice-Grain Links' },
  { label: 'Weight & Length', value: 'Featherweight 2.5 Grams • 21 Inches' },
  { label: 'Plating', value: 'High-Shine Black Silver Micron Finish' },
  { label: 'Skin Safety', value: '100% Skin Safe, Lead & Nickel Free' },
];

export const THIN_AS_RICE_SILVER_CHAIN_ADDITIONAL_DETAILS: HighlightItem[] = [
  { label: 'Base Metal', value: 'Premium Brass' },
  { label: 'Color', value: 'Black Silver' },
  { label: 'Length', value: '21 Inches' },
  { label: 'Weight', value: '2.5 Grams' },
  { label: 'Occasion', value: 'Everyday Minimalist & Pendant Layering' },
  { label: 'Origin', value: 'India' },
];

export const THIN_AS_RICE_SILVER_CHAIN_BUNDLE_OPTIONS: BundleOption[] = makeBundles('rice-chain', 'Thin as Rice 21" Silver Chain', 349, 999);
export const THIN_AS_RICE_SILVER_CHAIN_REVIEWS_LIST: ReviewItem[] = makeReviews('rice-chain', 'Thin as Rice 21" Silver Chain', ['/g1.webp']);
export const THIN_AS_RICE_SILVER_CHAIN_CUSTOMER_MEDIA: CustomerMediaItem[] = makeCustomerMedia('rice-chain', [
  { src: '/g1.webp', thumbSrc: '/g1_thumb.webp', caption: 'So sleek and shiny — literally catches every light', author: 'Nandini P.', city: 'Ahmedabad' },
]);

// ============================================================================
// 13. KOREAN GLORIOUS PEARL GOLD PLATED PEACOCK DROP EARRINGS
// ============================================================================
export const KOREAN_PEACOCK_PEARL_EARRINGS_SLUG =
  '/products/korean-glorious-pearl-gold-plated-peacock-motif-earrings-with-white-moti-for-women';

export const KOREAN_PEACOCK_PEARL_EARRINGS_PRODUCT_DETAILS: ProductDetails = {
  id: 'korean-peacock-pearl-earrings',
  title: 'Korean Glorious Pearl Gold Plated Style Peacock and White Moti Earring for Women',
  shortTitle: 'Korean Peacock Pearl Earrings',
  tagline: '18K Gold-Plated Peacock Motif Drop Earrings with Micro CZ & White Moti Pearls',
  subtitle: 'Ornate Korean-Imperial Peacock Silhouette with Cascade Pearl Drops',
  fullDescription:
    'Indulge in imperial elegance with these Korean Glorious Pearl Gold Plated Peacock motif drop earrings. Handcrafted from hypoallergenic alloy with rich 18K yellow gold micron plating, each earring features an ornate peacock silhouette adorned with micro-faceted cubic zirconia diamonds and lustrous cascade pearl moti drops. 100% skin safe, lead and nickel free with comfortable hypoallergenic push back closures.',
  rating: 4.9,
  ratingsCount: 1290,
  reviewsCount: 784,
  size: 'Drop Earrings (Free Size)',
  price: 399,
  originalPrice: 999,
  discountPercent: 60,
  sku: 'QVL-PEACOCK-6SQGX4',
  inStock: true,
  stockLeft: 15,
  recentSales24h: 148,
  currentLiveViewers: 37,
  freeDeliveryThreshold: 0,
  brand: 'QAVELLE',
  countryOfOrigin: 'India',
  badge: 'ROYAL VIRAL TRENDING',
  materials: '18K Gold Plated Alloy, Cubic Zirconia & Pearls',
};

export const KOREAN_PEACOCK_PEARL_EARRINGS_PRODUCT_GALLERY: ProductGalleryItem[] = [
  { id: 'pea-1', src: '/g1-1.png', alt: 'Korean Peacock Pearl Gold Plated Earrings', title: 'Ornate Peacock & White Moti Drops', tag: 'Korean Luxury' },
  { id: 'pea-2', src: '/g2-1.png', alt: 'Peacock Motif Micro CZ Stones Close-up', title: 'Micro-Faceted Cubic Zirconia Detail' },
  { id: 'pea-3', src: '/g3-1.png', alt: 'Cascade Pearl Moti Drop View', title: 'Lustrous Cascade White Moti Drops' },
  { id: 'pea-4', src: '/g4.png', alt: 'Peacock Earrings Wearing View', title: '18K Gold Micron Polish • Skin Safe' },
];

export const KOREAN_PEACOCK_PEARL_EARRINGS_PRODUCT_HIGHLIGHTS: HighlightItem[] = [
  { label: 'Design', value: 'Korean Ornate Peacock & White Moti Drops' },
  { label: 'Plating', value: 'Rich 18K Yellow Gold Micron Plating' },
  { label: 'Stones', value: 'Micro-Faceted CZ & Lustrous Pearl Drops' },
  { label: 'Closure', value: 'Hypoallergenic Comfort Push Back' },
];

export const KOREAN_PEACOCK_PEARL_EARRINGS_ADDITIONAL_DETAILS: HighlightItem[] = [
  { label: 'Base Material', value: 'Hypoallergenic Alloy' },
  { label: 'Color', value: 'Gold & White Pearl' },
  { label: 'Pattern', value: 'Peacock Drop Motif' },
  { label: 'Occasion', value: 'Festive, Indo-Western & Evening Wear' },
  { label: 'Skin Safety', value: '100% Lead & Nickel Free' },
  { label: 'Origin', value: 'India' },
];

export const KOREAN_PEACOCK_PEARL_EARRINGS_BUNDLE_OPTIONS: BundleOption[] = makeBundles('peacock-earrings', 'Korean Peacock Pearl Earrings', 399, 999);
export const KOREAN_PEACOCK_PEARL_EARRINGS_REVIEWS_LIST: ReviewItem[] = makeReviews('peacock-earrings', 'Korean Peacock Pearl Earrings', ['/g1-1.png']);
export const KOREAN_PEACOCK_PEARL_EARRINGS_CUSTOMER_MEDIA: CustomerMediaItem[] = makeCustomerMedia('peacock-earrings', [
  { src: '/g1-1.png', caption: 'So detailed and regal in person!', author: 'Lavanya T.', city: 'Hyderabad' },
]);

// ============================================================================
// 14. NEW SOLID DESIGNER METAL ANALOG WATCHES FOR WOMEN
// ============================================================================
export const DESIGNER_METAL_ANALOG_WATCH_SLUG =
  '/products/new-solid-designer-metal-analog-watches-for-women';

export const DESIGNER_METAL_ANALOG_WATCH_PRODUCT_DETAILS: ProductDetails = {
  id: 'designer-metal-analog-watch',
  title: 'New Solid Designer Metal Analog Watches For Women',
  shortTitle: 'Solid Designer Metal Watch',
  tagline: '18K Gold Electroplated Stainless Steel Designer Analog Timepiece with Sunburst Dial',
  subtitle: 'Precision Japanese Quartz Movement, Hardened Mineral Glass & Adjustable Metal Strap',
  fullDescription:
    'Elevate your personal elegance with the New Solid Designer Metal Analog Watch for Women by QAVELLE. Expertly engineered with a high-accuracy Japanese quartz movement and encased in a solid polished stainless steel body with lustrous 18K gold electroplating. Featuring a refined sunburst minimalist dial with crystal-embellished hour markers and an adjustable triple-link designer metal bracelet.',
  rating: 4.9,
  ratingsCount: 1420,
  reviewsCount: 876,
  size: 'Adjustable Link Strap',
  price: 499,
  originalPrice: 1499,
  discountPercent: 67,
  sku: 'QVL-WATCH-6AYLP7',
  inStock: true,
  stockLeft: 18,
  recentSales24h: 192,
  currentLiveViewers: 48,
  freeDeliveryThreshold: 0,
  brand: 'QAVELLE',
  countryOfOrigin: 'India',
  badge: 'ROYAL VIRAL TREND',
  materials: 'Stainless Steel & Hardened Mineral Glass',
};

export const DESIGNER_METAL_ANALOG_WATCH_PRODUCT_GALLERY: ProductGalleryItem[] = [
  { id: 'wtc-1', src: '/h1.png', alt: 'Solid Designer Metal Analog Watch For Women', title: 'Designer 18K Gold-Finish Analog Watch', tag: 'Designer Luxury' },
  { id: 'wtc-2', src: '/h2.png', alt: 'Sunburst Minimalist Dial Close-up', title: 'Crystal Hour Markers & Mineral Glass' },
  { id: 'wtc-3', src: '/h3.png', alt: 'Adjustable Triple-Link Metal Strap Detail', title: 'Solid Stainless Steel Link Bracelet' },
];

export const DESIGNER_METAL_ANALOG_WATCH_PRODUCT_HIGHLIGHTS: HighlightItem[] = [
  { label: 'Movement', value: 'High-Precision Japanese Quartz Analog' },
  { label: 'Strap & Case', value: 'Solid Polished Stainless Steel Links' },
  { label: 'Glass', value: 'Scratch-Resistant Hardened Mineral Crystal' },
  { label: 'Fit', value: 'Adjustable Fold-Over Deployment Clasp' },
];

export const DESIGNER_METAL_ANALOG_WATCH_ADDITIONAL_DETAILS: HighlightItem[] = [
  { label: 'Display Type', value: 'Analog Sunburst Minimalist Dial' },
  { label: 'Color', value: 'Gold & Rose Gold Finish' },
  { label: 'Strap Material', value: 'Solid Designer Metal Bracelet' },
  { label: 'Battery', value: 'Long-Life Pre-Installed Cell' },
  { label: 'Occasion', value: 'Office, Formal, Party & Luxury Gifting' },
  { label: 'Origin', value: 'India' },
];

export const DESIGNER_METAL_ANALOG_WATCH_BUNDLE_OPTIONS: BundleOption[] = makeBundles('designer-watch', 'Solid Designer Metal Watch', 499, 1499);
export const DESIGNER_METAL_ANALOG_WATCH_REVIEWS_LIST: ReviewItem[] = makeReviews('designer-watch', 'Solid Designer Metal Watch', ['/h1.png', '/h2.png']);
export const DESIGNER_METAL_ANALOG_WATCH_CUSTOMER_MEDIA: CustomerMediaItem[] = makeCustomerMedia('designer-watch', [
  { src: '/h1.png', caption: 'Feels heavy and luxurious on the wrist!', author: 'Divya N.', city: 'Bengaluru' },
  { src: '/h2.png', caption: 'Looks like a ₹5,000+ designer watch', author: 'Sakshi B.', city: 'Pune' },
]);

// ============================================================================
// 15. KOREAN TRENDY BUTTERFLY PEARL EARRINGS (RECENTLY ADDED PRODUCT)
// ============================================================================
export const KOREAN_TRENDY_BUTTERFLY_EARRINGS_SLUG =
  '/products/korean-trendy-butterfly-earrings-western-fancy-earrings-for-women-girls';

export const KOREAN_TRENDY_BUTTERFLY_EARRINGS_PRODUCT_DETAILS: ProductDetails = {
  id: 'korean-trendy-butterfly-earrings',
  title: 'Korean Trendy Butterfly Pearl Earrings Western Fancy Earrings For Women & Girls',
  shortTitle: 'Korean Butterfly Pearl Earrings',
  tagline: 'Sculpted Pavé CZ Butterfly Wings with Luminous Teardrop Pearl Drops',
  subtitle: '18K Anti-Tarnish Gold Finish • Western & Festive Statement Drops (3.5 cm)',
  fullDescription:
    'Channel delicate romance and ethereal charm with the Korean Trendy Butterfly Pearl Earrings for Women & Girls by QAVELLE. Featuring intricately sculpted butterfly wings embellished with glittering pavé cubic zirconia crystals, these earrings flow seamlessly into a lustrous teardrop pearl drop that sways gracefully with every movement. Coated in a signature 18K electroplated anti-tarnish gold finish and secured with comfortable hypoallergenic push-back studs, this pair effortlessly complements Western evening wear, chic casual outfits, and festive gatherings.',
  description:
    'Sculpted butterfly wings embellished with glittering pavé cubic zirconia crystals and luminous teardrop pearl drops in an 18K anti-tarnish gold finish.',
  rating: 4.9,
  ratingsCount: 1580,
  reviewsCount: 964,
  size: '3.5 cm Drop Length',
  price: 499,
  salePrice: 499,
  originalPrice: 1599,
  regularPrice: 1599,
  discountPercent: 69,
  discountPercentage: 69,
  sku: 'QVL-BUTTERFLY-6MH7FX',
  inStock: true,
  stockLeft: 14,
  inStockCount: 14,
  recentSales24h: 218,
  currentLiveViewers: 52,
  freeDeliveryThreshold: 0,
  brand: 'QAVELLE',
  countryOfOrigin: 'India',
  badge: 'ROYAL VIRAL TREND',
  tag: 'Korean Fancy',
  urgencyText: 'Trending across India — only 14 pairs left!',
  materials: '18K Gold Plated Alloy, Pavé Cubic Zirconia & Luminous Pearl Drop',
  dimensions: '3.5 cm Drop Length • Featherlight Comfort',
};

export const KOREAN_TRENDY_BUTTERFLY_EARRINGS_PRODUCT_GALLERY: ProductGalleryItem[] = [
  {
    id: 'bfly-1',
    src: '/i1.png',
    alt: 'Korean Trendy Butterfly Pearl Earrings Front View',
    title: 'Pavé CZ Butterfly & Teardrop Pearl Drop',
    tag: 'New Arrival',
  },
  {
    id: 'bfly-2',
    src: '/i2.png',
    alt: 'Korean Trendy Butterfly Pearl Earrings Close-up Detail',
    title: '18K Electroplated Anti-Tarnish Gold Finish',
  },
  {
    id: 'bfly-3',
    src: '/i3.png',
    alt: 'Korean Trendy Butterfly Pearl Earrings Styling Shot',
    title: 'Western Evening & Festive Statement Look',
  },
];

export const KOREAN_TRENDY_BUTTERFLY_EARRINGS_PRODUCT_HIGHLIGHTS: HighlightItem[] = [
  { label: 'Design', value: 'Sculpted Butterfly Wings & Teardrop Pearl' },
  { label: 'Stones', value: 'Glittering Pavé Cubic Zirconia Crystals' },
  { label: 'Plating', value: '18K Anti-Tarnish Electroplated Gold' },
  { label: 'Closure', value: 'Hypoallergenic Comfort Push-Back Studs' },
];

export const KOREAN_TRENDY_BUTTERFLY_EARRINGS_ADDITIONAL_DETAILS: HighlightItem[] = [
  { label: 'Base Material', value: 'Hypoallergenic Alloy, CZ & Pearl' },
  { label: 'Color', value: 'Gold & White Pearl' },
  { label: 'Drop Length', value: '3.5 cm' },
  { label: 'Style', value: 'Korean Trendy / Western Fancy' },
  { label: 'Skin Safety', value: '100% Lead & Nickel Free' },
  { label: 'Origin', value: 'India' },
];

export const KOREAN_TRENDY_BUTTERFLY_EARRINGS_BUNDLE_OPTIONS: BundleOption[] = makeBundles(
  'butterfly-earrings',
  'Korean Butterfly Pearl Earrings',
  499,
  1599
);

export const KOREAN_TRENDY_BUTTERFLY_EARRINGS_REVIEWS_LIST: ReviewItem[] = makeReviews(
  'butterfly-earrings',
  'Korean Butterfly Pearl Earrings',
  ['/i1.png', '/i2.png', '/i3.png']
);

export const KOREAN_TRENDY_BUTTERFLY_EARRINGS_REVIEWS = KOREAN_TRENDY_BUTTERFLY_EARRINGS_REVIEWS_LIST;

export const KOREAN_TRENDY_BUTTERFLY_EARRINGS_CUSTOMER_MEDIA: CustomerMediaItem[] = makeCustomerMedia(
  'butterfly-earrings',
  [
    { src: '/i1.png', caption: 'Delicate, sparkly & super light on the ears!', author: 'Aanya S.', city: 'Mumbai' },
    { src: '/i2.png', caption: 'The pearl drop sways so gracefully', author: 'Komal R.', city: 'Delhi' },
    { src: '/i3.png', caption: 'Paired with my cocktail dress — instant compliments', author: 'Shreya V.', city: 'Bengaluru' },
  ]
);

// ============================================================================
// GLOBAL FAQS, LIVE SALES TOASTS & RELATED PRODUCTS
// ============================================================================
export const FAQS_LIST: FaqItem[] = [
  {
    question: 'Is QAVELLE jewellery skin-safe and anti-tarnish?',
    answer:
      'Yes. Every QAVELLE piece is 100% lead-free and nickel-free, crafted with hypoallergenic base metals and sealed with multi-layer micro gold, rhodium, or PVD anti-tarnish plating.',
  },
  {
    question: 'Do you offer Cash on Delivery (COD) across India?',
    answer:
      'Yes! We offer Pan-India Cash on Delivery (COD) as well as Instant Zero-Fee UPI checkout across 19,000+ pincodes with free express shipping.',
  },
  {
    question: 'How long does delivery take?',
    answer:
      'Orders are dispatched within 24 hours from our studio and typically arrive in 3–5 business days across metro cities and 4–7 business days for other Indian locations.',
  },
  {
    question: 'What is your return or replacement policy?',
    answer:
      'Every QAVELLE order is backed by our 7-day hassle-free replacement guarantee in the rare event of transit damage or a manufacturing defect.',
  },
  {
    question: 'Does the jewellery come in gift-ready packaging?',
    answer:
      'Yes. Every order includes a complimentary signature QAVELLE royal velvet box or velvet pouch, making it immediately ready for gifting.',
  },
  {
    question: 'How should I care for my jewellery to keep it shining?',
    answer:
      'Store each piece inside the complimentary QAVELLE velvet box away from perfumes, hairsprays, and direct moisture, and wipe gently with a soft dry cloth after wear.',
  },
];

export const LIVE_SALES_NOTIFICATIONS: LiveSalesNotification[] = [
  { name: 'Priya S.', city: 'Mumbai', item: 'Korean Butterfly Pearl Earrings', time: '2 mins ago' },
  { name: 'Ananya R.', city: 'Delhi', item: 'Radhika Green AD Necklace Set', time: '5 mins ago' },
  { name: 'Kavya M.', city: 'Bengaluru', item: 'Solid Designer Metal Watch', time: '8 mins ago' },
  { name: 'Sneha P.', city: 'Pune', item: '18K Gold Jhumka Set of 6', time: '12 mins ago' },
  { name: 'Meera K.', city: 'Jaipur', item: 'Emerald Anti-Tarnish Snake Chain', time: '16 mins ago' },
];

export const RELATED_PRODUCTS: RelatedProductItem[] = [
  {
    id: 'rel-butterfly',
    title: 'Korean Trendy Butterfly Pearl Earrings',
    price: 499,
    originalPrice: 1599,
    rating: 4.9,
    reviews: 964,
    image: '/i1.png',
  },
  {
    id: 'rel-watch',
    title: 'New Solid Designer Metal Analog Watch',
    price: 499,
    originalPrice: 1499,
    rating: 4.9,
    reviews: 876,
    image: '/h1.png',
  },
  {
    id: 'rel-radhika',
    title: 'Radhika Inspired Green AD Necklace Set',
    price: 399,
    originalPrice: 1299,
    rating: 4.9,
    reviews: 1412,
    image: '/radhika_ambani_1.webp',
  },
  {
    id: 'rel-choker',
    title: 'Rhodium Austrian Diamond Bridal Choker Set',
    price: 749,
    originalPrice: 2999,
    rating: 4.9,
    reviews: 1124,
    image: '/Hero_website_neklace.webp',
  },
];
