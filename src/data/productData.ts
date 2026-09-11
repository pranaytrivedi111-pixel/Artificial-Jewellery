import { BundleOption, CouponCode, FaqItem, ProductGalleryItem, ReviewItem } from '../types';

import jhumkaHeroBanner from '../assets/images/hero_jhumka_exact_1788252165017.jpg';
import jhumkaCinematic from '../assets/images/cinematic_exact_1788252183341.jpg';
import jhumkaModelEar from '../assets/images/ugc_ear_exact_1788252211052.jpg';
import jhumkaPeacockHand from '../assets/images/ugc_peacock_exact_1788252265877.jpg';
import jhumkaTempleLakshmi from '../assets/images/ugc_lakshmi_exact_1788252291168.jpg';
import jhumkaCollectionHand from '../assets/images/ugc_set_hand_exact_1788252309931.jpg';
import jhumkaLuxuryPackaging from '../assets/images/jhumka_luxury_packaging_1788197372634.jpg';
import jhumkaPearlCombo from '../assets/images/jhumka_pearl_combo_1788197357510.jpg';
import jhumkaModelPortrait from '../assets/images/jhumka_model_portrait_1788197297409.jpg';
import jhumkaHandHolding from '../assets/images/jhumka_hand_holding_1788197255373.jpg';
import jhumkaCraftBanner from '../assets/images/jhumka_craft_banner_1788197325971.jpg';
import jhumkaStudioWhite from '../assets/images/jhumka_studio_white_1788197312261.jpg';
import qavelleBrandLogo from '../assets/images/qavelle_brand_logo_1788290647404.jpg';
import kundanChokerImg from '../assets/images/kundan_choker_necklace_1788291962322.jpg';
import templeHaramImg from '../assets/images/temple_haram_necklace_1788291979036.jpg';
import rubyFloralNecklaceImg from '../assets/images/ruby_floral_necklace_1788291994276.jpg';
import antiqueBanglesImg from '../assets/images/antique_gold_bangles_1788292011949.jpg';
import rhodiumChokerHero from '../assets/images/rhodium_choker_hero_1788380811717.jpg';
import rhodiumChokerModel from '../assets/images/rhodium_choker_model_1788380838970.jpg';
import rhodiumChokerFlatlay from '../assets/images/rhodium_choker_flatlay_1788380878391.jpg';
import rhodiumChokerMacro from '../assets/images/rhodium_choker_macro_1788380894697.jpg';
import jhumkaReviewPhoto1 from '../assets/images/jhumka_review_photo_1_1788794712560.jpg';
import jhumkaReviewPhoto2 from '../assets/images/jhumka_review_photo_2_1788794729172.jpg';
import necklaceReviewPhoto1 from '../assets/images/necklace_review_photo_1_1788794746748.jpg';
import necklaceReviewPhoto2 from '../assets/images/necklace_review_photo_2_1788794767749.jpg';

// Direct paths to uploaded image files (when placed in public/ or project root)
// with bundled high-res assets as fallback
export const UPLOADED_IMAGES = {
  heroWebsite: '/Hero_website.webp',
  cinematic: '/Cinematic.webp',
  ugc1: '/UGC_1.webp',
  ugc2: '/UGC_2.webp',
  ugc3: '/UGC_3.webp',
  ugc: '/UGC.webp',
  necklaceHeroWebsite: '/Hero_website_neklace.webp',
  necklaceProductShot1: '/neklace_producshot.webp',
  necklaceProductShot2: '/neklace_productshot_2.webp',
};

export const ASSET_IMAGES = {
  brandLogo: '/qavelle_logo_cropped.png',
  brandLogoTransparent: '/qavelle_logo_transparent.png',
  brandLogoFull: '/qavelle_logo.png',
  brandLogoDark: '/qavelle_logo_horizontal_dark.svg',
  brandCrest: '/qavelle_crest.svg',
  kundanChoker: kundanChokerImg,
  templeHaram: templeHaramImg,
  rubyFloralNecklace: rubyFloralNecklaceImg,
  antiqueBangles: antiqueBanglesImg,
  hero: '/Cinematic.webp',
  hand: '/UGC_1.png',
  chart: '/Cinematic.png',
  cert: '/UGC_3.png',
  astro: '/UGC_2.png',
  box: '/Cinematic.png',
  vedic: '/UGC.png',
  macro: '/UGC_2.png',
  ankit: '/UGC_1.png',
  celebReel: '/UGC_1.png',
  unboxReel: '/UGC.png',
  custBangles: '/UGC_2.png',
  custPalm: '/UGC_3.png',
  jhumkaHero: '/Cinematic.webp',
  jhumkaCinematic: '/Cinematic.png',
  jhumkaStudioWhite: jhumkaStudioWhite,
  jhumkaModelEar: '/UGC_1.png',
  jhumkaPeacock: '/UGC_2.png',
  jhumkaLakshmi: '/UGC_3.png',
  jhumkaCollection: '/UGC.png',
  jhumkaPackaging: '/Cinematic.png',
  jhumkaModelPortrait: '/UGC_1.png',
  jhumkaHandHolding: '/UGC_2.png',
  jhumkaCraftBanner: '/Hero_website.png',
  jhumkaPearlCombo: '/UGC_3.png',
  necklaceHeroWebsite: '/Hero_website_neklace.png',
  necklaceProductShot1: '/neklace_producshot.png',
  necklaceProductShot2: '/neklace_productshot_2.png',
};

// Matching Necklaces to mention on Jhumka Earrings Product Page
export const JHUMKA_MATCHING_VARIANTS = [
  {
    id: 'var-radhika-green-ad',
    productId: 'radhika-green-ad' as const,
    title: 'Radhika Anant Ambani Inspired Green AD Necklace Set with Earrings',
    category: 'Celebrity Bridal AD Set',
    price: 299,
    originalPrice: 999,
    discountPercent: 70,
    image: '/radhika_ambani_1.webp',
    tag: 'Ambani Inspired',
    sourceUrl: '/radhika-anant-ambani-inspired-green-ad-neckless-set',
  },
  {
    id: 'var-necklace-1',
    productId: 'choker' as const,
    title: 'Rhodium Plated White Austrian Diamond Bridal Choker Set',
    category: 'Necklace Set',
    price: 799,
    originalPrice: 2999,
    discountPercent: 73,
    image: '/neklace_producshot.webp',
    sourceUrl: '/necklace',
  },
  {
    id: 'var-necklace-combo-5',
    productId: 'necklace-combo-5' as const,
    title: 'Shimmering Beautiful Pack of 5 Necklace Chain Pendant Combo for Women and Girls',
    category: 'Silver Pendant Combo (Pack of 5)',
    price: 349,
    originalPrice: 999,
    discountPercent: 65,
    image: '/combo5_user_1.webp',
    tag: 'Pack of 5',
    sourceUrl: '/shimmering-beautiful-pack-of-5-necklace-chain-pendant-combo-for-women-and-girls',
  },
  {
    id: 'var-elegant-everyday-5',
    productId: 'elegant-everyday-5' as const,
    title: 'Elegant Everyday Necklace Set – Combo of 5 Necklaces',
    category: 'Everyday Necklace Combo (Set of 5)',
    price: 349,
    originalPrice: 999,
    discountPercent: 65,
    image: '/elegant_combo_1.webp',
    tag: 'Combo of 5',
    sourceUrl: '/elegant-everyday-necklace-set-combo-of-5-necklaces',
  },
  {
    id: 'var-jhumka-trendy',
    productId: 'trendy-alloy-set' as const,
    title: 'Trendy Alloy Gold Plated Kundan & Pearl Jewellery Set with Matching Drop Earrings',
    category: 'Necklace Sets',
    price: 399,
    originalPrice: 1499,
    discountPercent: 73,
    image: '/b1.png',
    tag: 'Trendy Bestseller',
    sourceUrl: '/products/trendy-alloy-gold-plated-jewellery-set',
  },
];

// Matching Earrings / Jhumka Sets to mention on Necklace Product Page ("and vice versa in necklace page")
export const CHOKER_MATCHING_VARIANTS = [
  {
    id: 'var-radhika-green-ad',
    productId: 'radhika-green-ad' as const,
    title: 'Radhika Anant Ambani Inspired Green AD Necklace Set with Earrings',
    category: 'Celebrity Bridal AD Set',
    price: 299,
    originalPrice: 999,
    discountPercent: 70,
    image: '/radhika_ambani_1.webp',
    tag: 'Ambani Inspired',
    sourceUrl: '/radhika-anant-ambani-inspired-green-ad-neckless-set',
  },
  {
    id: 'var-earring-1',
    productId: 'jhumka' as const,
    title: 'Gold Plated Fancy Jhumka Earrings for Women – Set of 6 Pairs',
    category: 'Jhumka Combo',
    price: 499,
    originalPrice: 1999,
    discountPercent: 75,
    image: '/Cinematic.webp',
    sourceUrl: '/',
  },
  {
    id: 'var-necklace-combo-5',
    productId: 'necklace-combo-5' as const,
    title: 'Shimmering Beautiful Pack of 5 Necklace Chain Pendant Combo for Women and Girls',
    category: 'Silver Pendant Combo (Pack of 5)',
    price: 349,
    originalPrice: 999,
    discountPercent: 65,
    image: '/combo5_user_1.webp',
    tag: 'Pack of 5',
    sourceUrl: '/shimmering-beautiful-pack-of-5-necklace-chain-pendant-combo-for-women-and-girls',
  },
  {
    id: 'var-choker-trendy',
    productId: 'trendy-alloy-set' as const,
    title: 'Trendy Alloy Gold Plated Kundan & Pearl Jewellery Set with Matching Drop Earrings',
    category: 'Necklace Sets',
    price: 399,
    originalPrice: 1499,
    discountPercent: 73,
    image: '/b1.png',
    tag: 'Trendy Bestseller',
    sourceUrl: '/products/trendy-alloy-gold-plated-jewellery-set',
  },
];

// Matching Products to mention on 5-Pack Necklace Combo Page
export const COMBO5_MATCHING_VARIANTS = [
  {
    id: 'var-radhika-green-ad',
    productId: 'radhika-green-ad' as const,
    title: 'Radhika Anant Ambani Inspired Green AD Necklace Set with Earrings',
    category: 'Celebrity Bridal AD Set',
    price: 299,
    originalPrice: 999,
    discountPercent: 70,
    image: '/radhika_ambani_1.webp',
    tag: 'Ambani Inspired',
    sourceUrl: '/radhika-anant-ambani-inspired-green-ad-neckless-set',
  },
  {
    id: 'var-earring-1',
    productId: 'jhumka' as const,
    title: 'Gold Plated Fancy Jhumka Earrings for Women – Set of 6 Pairs',
    category: 'Jhumka Combo',
    price: 499,
    originalPrice: 1999,
    discountPercent: 75,
    image: '/Cinematic.webp',
    sourceUrl: '/',
  },
  {
    id: 'var-necklace-1',
    productId: 'choker' as const,
    title: 'Rhodium Plated White Austrian Diamond Bridal Choker Set',
    category: 'Necklace Set',
    price: 799,
    originalPrice: 2999,
    discountPercent: 73,
    image: '/neklace_producshot.webp',
    sourceUrl: '/necklace',
  },
  {
    id: 'var-elegant-everyday-5',
    productId: 'elegant-everyday-5' as const,
    title: 'Elegant Everyday Necklace Set – Combo of 5 Necklaces',
    category: 'Everyday Necklace Combo (Set of 5)',
    price: 349,
    originalPrice: 999,
    discountPercent: 65,
    image: '/elegant_combo_1.webp',
    tag: 'Combo of 5',
    sourceUrl: '/elegant-everyday-necklace-set-combo-of-5-necklaces',
  },
];

// Matching Products to mention on Elegant Everyday 5-Necklace Page
export const ELEGANT_EVERYDAY_MATCHING_VARIANTS = [
  {
    id: 'var-radhika-green-ad',
    productId: 'radhika-green-ad' as const,
    title: 'Radhika Anant Ambani Inspired Green AD Necklace Set with Earrings',
    category: 'Celebrity Bridal AD Set',
    price: 299,
    originalPrice: 999,
    discountPercent: 70,
    image: '/radhika_ambani_1.webp',
    tag: 'Ambani Inspired',
    sourceUrl: '/radhika-anant-ambani-inspired-green-ad-neckless-set',
  },
  {
    id: 'var-earring-1',
    productId: 'jhumka' as const,
    title: 'Gold Plated Fancy Jhumka Earrings for Women – Set of 6 Pairs',
    category: 'Jhumka Combo',
    price: 499,
    originalPrice: 1999,
    discountPercent: 75,
    image: '/Cinematic.webp',
    sourceUrl: '/',
  },
  {
    id: 'var-necklace-1',
    productId: 'choker' as const,
    title: 'Rhodium Plated White Austrian Diamond Bridal Choker Set',
    category: 'Necklace Set',
    price: 799,
    originalPrice: 2999,
    discountPercent: 73,
    image: '/neklace_producshot.webp',
    sourceUrl: '/necklace',
  },
  {
    id: 'var-necklace-combo-5',
    productId: 'necklace-combo-5' as const,
    title: 'Shimmering Beautiful Pack of 5 Necklace Chain Pendant Combo for Women and Girls',
    category: 'Silver Pendant Combo (Pack of 5)',
    price: 349,
    originalPrice: 999,
    discountPercent: 65,
    image: '/combo5_user_1.webp',
    tag: 'Pack of 5',
    sourceUrl: '/shimmering-beautiful-pack-of-5-necklace-chain-pendant-combo-for-women-and-girls',
  },
];

// Matching Products to mention on Radhika Ambani Green AD Necklace Page
export const RADHIKA_GREEN_AD_MATCHING_VARIANTS = [
  {
    id: 'var-necklace-1',
    productId: 'choker' as const,
    title: 'Rhodium Plated White Austrian Diamond Bridal Choker Set',
    category: 'Necklace Set',
    price: 799,
    originalPrice: 2999,
    discountPercent: 73,
    image: '/neklace_producshot.webp',
    sourceUrl: '/necklace',
  },
  {
    id: 'var-earring-1',
    productId: 'jhumka' as const,
    title: 'Gold Plated Fancy Jhumka Earrings for Women – Set of 6 Pairs',
    category: 'Jhumka Combo',
    price: 499,
    originalPrice: 1999,
    discountPercent: 75,
    image: '/Cinematic.webp',
    sourceUrl: '/',
  },
  {
    id: 'var-necklace-combo-5',
    productId: 'necklace-combo-5' as const,
    title: 'Shimmering Beautiful Pack of 5 Necklace Chain Pendant Combo for Women and Girls',
    category: 'Silver Pendant Combo (Pack of 5)',
    price: 349,
    originalPrice: 999,
    discountPercent: 65,
    image: '/combo5_user_1.webp',
    tag: 'Pack of 5',
    sourceUrl: '/shimmering-beautiful-pack-of-5-necklace-chain-pendant-combo-for-women-and-girls',
  },
  {
    id: 'var-elegant-everyday-5',
    productId: 'elegant-everyday-5' as const,
    title: 'Elegant Everyday Necklace Set – Combo of 5 Necklaces',
    category: 'Everyday Necklace Combo (Set of 5)',
    price: 349,
    originalPrice: 999,
    discountPercent: 65,
    image: '/elegant_combo_1.webp',
    tag: 'Combo of 5',
    sourceUrl: '/elegant-everyday-necklace-set-combo-of-5-necklaces',
  },
];

// Matching Products to mention on Royal Elegant Gold Plated Jewellery Set Page
export const ALLURE_GOLD_SET_MATCHING_VARIANTS = [
  {
    id: 'var-allure-choker',
    productId: 'choker' as const,
    title: 'Rhodium Plated White Austrian Diamond Bridal Choker Set',
    category: 'Bridal Choker Set',
    price: 799,
    originalPrice: 2999,
    discountPercent: 73,
    image: '/neklace_producshot.webp',
    sourceUrl: '/necklace',
  },
  {
    id: 'var-allure-jhumka',
    productId: 'jhumka' as const,
    title: 'Gold Plated Fancy Jhumka Earrings for Women – Set of 6 Pairs',
    category: 'Jhumka Combo',
    price: 499,
    originalPrice: 1999,
    discountPercent: 75,
    image: '/Cinematic.webp',
    sourceUrl: '/',
  },
  {
    id: 'var-allure-radhika',
    productId: 'radhika-green-ad' as const,
    title: 'Radhika Anant Ambani Inspired Green AD Necklace Set with Matching Earrings',
    category: 'Celebrity Inspired',
    price: 299,
    originalPrice: 999,
    discountPercent: 70,
    image: '/radhika_ambani_1.webp',
    tag: 'Trending Celebrity',
    sourceUrl: '/radhika-anant-ambani-inspired-green-ad-neckless-set',
  },
  {
    id: 'var-allure-trendy',
    productId: 'trendy-alloy-set' as const,
    title: 'Trendy Alloy Gold Plated Kundan & Pearl Jewellery Set with Matching Drop Earrings',
    category: 'Necklace Sets',
    price: 399,
    originalPrice: 1499,
    discountPercent: 73,
    image: '/b1.png',
    tag: 'Trendy Bestseller',
    sourceUrl: '/products/trendy-alloy-gold-plated-jewellery-set',
  },
];

export const BRACELET_VARIANTS = JHUMKA_MATCHING_VARIANTS;

export const PRODUCT_DETAILS = {
  title: 'Gold Plated Fancy Jhumka Earrings for Women – Set of 6',
  fullDescription:
    'Traditional Oxidised Gold Jhumka Earrings Combo for Women Daily Wear Ethnic Jhumka Earrings Set for Women (Pack of 6)',
  shortTitle: 'Gold Plated Jhumka Set',
  tagline: 'Traditional Oxidised Gold Jhumka Combo • Pack of 6 • Free Size',
  rating: 4.2,
  ratingsCount: 48121,
  reviewsCount: 18723,
  size: 'Free Size',
  price: 499,
  originalPrice: 1999,
  discountPercent: 75,
  sku: 'DE-JHM-OXGLD-06',
  inStock: true,
  stockLeft: 12,
  recentSales24h: 218,
  currentLiveViewers: 44,
  freeDeliveryThreshold: 0,
  brand: 'QAVELLE',
  countryOfOrigin: 'India',
};

export const PRODUCT_HIGHLIGHTS = [
  { label: 'Stone Type', value: 'No Stone' },
  { label: 'Plating', value: 'Oxidised Gold' },
  { label: 'Occasion', value: 'Festive, Ethnic, Daily Wear' },
  { label: 'Net Quantity (N)', value: '1 (Set of 6 Pairs)' },
  { label: 'Packaging', value: 'Free Velvet Keepsake Box' },
];

export const ADDITIONAL_DETAILS = [
  { label: 'Type', value: 'Jhumkhas' },
  { label: 'Trend', value: 'LakshmiDevi' },
  { label: 'Base Metal', value: 'Alloy' },
  { label: 'Sizing', value: 'Free Size' },
  { label: 'Color', value: 'Gold' },
  { label: 'Brand', value: 'QAVELLE' },
  { label: 'Package Includes', value: '6 Pairs Jhumkas + Free Velvet Keepsake Box' },
  { label: 'Generic Name', value: 'Accessories' },
  { label: 'L × W × H', value: '2 × 3 × 2 inch' },
  { label: 'Country of Origin', value: 'India' },
];

export const PRODUCT_GALLERY: ProductGalleryItem[] = [
  {
    id: '2',
    src: '/Cinematic.webp',
    thumbSrc: '/Cinematic_thumb.webp',
    alt: 'Complete 6-Pair Royal Antique Gold Jhumka Collection on Silk & Wood with Pearls',
    title: 'Cinematic Flatlay',
    tag: 'Collection',
  },
  {
    id: '4',
    src: '/UGC_1.webp',
    thumbSrc: '/UGC_1_thumb.webp',
    alt: 'Customer photo wearing Floral Ruby-Emerald Antique Jhumka on ear',
    title: 'On-Ear Fit & Scale',
    tag: 'UGC',
  },
  {
    id: '5',
    src: '/UGC_2.webp',
    thumbSrc: '/UGC_2_thumb.webp',
    alt: 'Detailed in-hand view of Antique Peacock Motif Jhumkas with Ruby & Emerald Stones',
    title: 'Peacock Mayur Pair',
    tag: 'Hand Close-up',
  },
  {
    id: '6',
    src: '/UGC_3.webp',
    thumbSrc: '/UGC_3_thumb.webp',
    alt: 'Detailed in-hand view of South Indian Temple Goddess Lakshmi Antique Jhumkas',
    title: 'Temple Lakshmi Pair',
    tag: 'Temple Art',
  },
  {
    id: '7',
    src: '/UGC.webp',
    thumbSrc: '/UGC_thumb.webp',
    alt: 'Holding Teardrop Floral Jhumkas with the full classic set in background',
    title: 'Collection in Hand',
    tag: 'Hand View',
  },
];

export const BUNDLE_OPTIONS: BundleOption[] = [
  {
    id: 'single-set',
    title: 'Gold Plated Fancy Jhumka Earrings (Set of 6 Pairs)',
    subtitle: 'Includes all 6 Antique Oxidised Gold Designs + Free Velvet Keepsake Box',
    unitCount: 1,
    price: 499,
    originalPrice: 1999,
    discountPercent: 75,
    popular: true,
    saveAmount: 1500,
  },
];

export const AVAILABLE_COUPONS: CouponCode[] = [
  {
    code: 'QVL100',
    description: 'Flat ₹100 instant discount on prepaid orders (Auto-applied on Prepaid)',
    discountType: 'flat',
    discountValue: 100,
    minSpend: 0,
  },
  {
    code: 'QVL10',
    description: 'Flat 10% instant discount on orders above ₹999',
    discountType: 'percentage',
    discountValue: 10,
    minSpend: 999,
  },
  {
    code: 'PREPAID50',
    description: 'Flat ₹50 OFF on instant UPI / Card payments',
    discountType: 'flat',
    discountValue: 50,
  },
  {
    code: 'SURYA5',
    description: 'Special 5% discount on heritage royal collection',
    discountType: 'percentage',
    discountValue: 5,
  },
];

export const KEY_BENEFITS = [
  {
    icon: 'Sparkles',
    title: '6 Royal Heritage Designs',
    description:
      'Curated box featuring 6 distinct iconic designs: Peacock Motif, South Indian Temple Lakshmi, Ruby-Emerald Floral, Teardrop Filigree, Pearl Droplet & Classic Bell Jhumkas.',
  },
  {
    icon: 'ShieldCheck',
    title: 'Anti-Tarnish Multi-Layer Gold Polish',
    description:
      'Electroplated with high-micron antique matte gold finish and protective lacquer coating that resists sweat, oxidation, and fading for years.',
  },
  {
    icon: 'Feather',
    title: 'Ultra-Lightweight Comfort',
    description:
      'Engineered with hollow casting and balanced weight distribution (8-14g per pair) to ensure zero earlobe stretching or pulling even during 12+ hour celebrations.',
  },
  {
    icon: 'HeartHandshake',
    title: '100% Hypoallergenic & Skin-Safe',
    description:
      'Crafted from lead-free, nickel-free premium alloy with smooth polished inner posts to prevent irritation, itching, or redness on sensitive ears.',
  },
  {
    icon: 'Coins',
    title: 'Unmatched Value & Versatility',
    description:
      'Complete festive jewelry wardrobe in one box — seamlessly pairs with Silk Sarees, Lehengas, Anarkalis, Kurtis, and fusion ethnic wear for weddings, festivals & parties.',
  },
  {
    icon: 'Gift',
    title: 'Luxury Gift Box Packaging',
    description:
      'Arrives safely packed in a signature royal gold-embossed presentation box with soft velvet pouches and a Certificate of Authenticity, perfect for gifting.',
  },
];

export const WHO_SHOULD_WEAR = [
  'Women looking for a versatile, lightweight ethnic jhumka collection for daily wear and festive occasions',
  'Brides and bridesmaids seeking regal traditional jewelry for mehendi, sangeet, and wedding ceremonies',
  'College students and working professionals wanting elegant traditional earrings to pair with kurtis and sarees',
  'Anyone looking for a high-value, ready-to-gift heirloom quality jewelry box for mothers, sisters, or wives',
];

export const RITUAL_STEPS = [
  {
    step: '1',
    title: 'Unboxing & Inspection',
    detail: 'Open your royal QAVELLE box and check all 6 pairs preserved inside individual velvet slots.',
  },
  {
    step: '2',
    title: 'Styling & Occasion Matching',
    detail: 'Choose the peacock or temple Lakshmi pair for grand festivals/weddings, and floral or pearl pairs for festive gatherings.',
  },
  {
    step: '3',
    title: 'Care & Maintenance',
    detail: 'Keep away from direct perfume sprays or harsh chemicals. Wipe gently with a soft cotton cloth after wearing.',
  },
  {
    step: '4',
    title: 'Storage in Velvet Box',
    detail: 'Store each pair in the provided velvet pouch or keepsake box to maintain the pristine antique gold finish.',
  },
];

export const SPECIFICATIONS_TABLE = [
  { label: 'Product Name', value: 'Gold Plated Fancy Jhumka Earrings (Set of 6 Pairs)' },
  { label: 'Plating / Finish', value: 'Multi-Layer Antique Oxidised Micro Gold Plating' },
  { label: 'Base Metal', value: 'High-Grade Hypoallergenic Brass & Copper Alloy (Lead & Nickel Free)' },
  { label: 'Stones & Accents', value: 'Hand-set Ruby & Emerald Glass Stones, Faux Basra Pearls' },
  { label: 'Closure Type', value: 'Ear-Safe Push Back / Secure Screw Posts' },
  { label: 'Weight', value: 'Approx. 8 - 14 Grams per pair (Lightweight for all-day comfort)' },
  { label: 'Box Contents', value: '6 Unique Pairs of Antique Jhumkas + Free Velvet Keepsake Box + Velvet Pouches + Certificate of Authenticity' },
  { label: 'Country of Origin', value: 'Handcrafted in Jaipur, India' },
];

export const REVIEWS_LIST: ReviewItem[] = [
  {
    id: 'rev-3',
    author: 'Ananya Roy',
    city: 'Bengaluru',
    state: 'Karnataka',
    rating: 5,
    date: '3 days ago',
    title: 'All 6 designs are uniquely varied from South Indian temple style to modern pearl jhumkas',
    comment:
      'All 6 designs are uniquely varied from South Indian temple style to modern pearl jhumkas. Delivered safely to Bangalore in pristine velvet packaging. Each pair feels premium yet feather-light on the ears.',
    verified: true,
    helpfulCount: 142,
    badge: 'Verified Buyer',
    userImage: '/girl_reviewer_1.jpg',
  },
  {
    id: 'rev-2',
    author: 'Pooja Verma',
    city: 'Mumbai',
    state: 'Maharashtra',
    rating: 5,
    date: '4 days ago',
    title: 'Lightweight and comfortable! Looks regal on ears',
    comment:
      'I was worried about earlobe heaviness, but these are wonderfully lightweight. The micro gold plating and ruby-emerald stone accents look premium. The keepsake box gave complete peace of mind.',
    verified: true,
    helpfulCount: 98,
    badge: 'Verified Buyer',
    userImage: '/girl_reviewer_2.jpg',
  },
  {
    id: 'rev-1',
    author: 'Shalini Verma',
    city: 'Delhi NCR',
    state: 'Delhi',
    rating: 5,
    date: '5 days ago',
    title: 'Noticed stunning compliments at my cousin’s wedding!',
    comment:
      'I ordered this combo after seeing QAVELLE online. The gold plating has a rich antique sheen and the peacock earrings look like real heritage temple gold. Delivered in 2 days in a royal velvet box.',
    verified: true,
    helpfulCount: 84,
    badge: 'Verified Buyer',
    userImage: '/jhumka_review_1.jpg',
  },
  {
    id: 'rev-4',
    author: 'Sunita Reddy',
    city: 'Hyderabad',
    state: 'Telangana',
    rating: 5,
    date: '1 week ago',
    title: 'Premium quality with authentic antique polish',
    comment:
      'You can feel the quality right when unboxing. The royal box and velvet pouch keep every piece protected. I am ordering another combo set for gifting to my sister.',
    verified: true,
    helpfulCount: 65,
    badge: 'Verified Buyer',
    userImage: '/girl_reviewer_4.jpg',
  },
  {
    id: 'rev-5',
    author: 'Kavita Joshi',
    city: 'Jaipur',
    state: 'Rajasthan',
    rating: 5,
    date: '1 week ago',
    title: '100% genuine antique finish. High craftsmanship',
    comment:
      'Being from Jaipur, I understand traditional jewelry well. This is authentic craftsmanship with durable gold plating. QAVELLE has done a fantastic job delivering heritage artistry at an accessible price.',
    verified: true,
    helpfulCount: 47,
    badge: 'Verified Buyer',
    userImage: '/jhumka_review_3.jpg',
  },
  {
    id: 'rev-6',
    author: 'Deepika Sen',
    city: 'Kolkata',
    state: 'West Bengal',
    rating: 5,
    date: '2 weeks ago',
    title: 'Wore these during Pujo, look like real heirloom gold!',
    comment:
      'Honestly didn’t expect such fine craftsmanship for 6 pairs at this price. I wore the peacock pair on Ashtami with my saree and received so many compliments from relatives. They are surprisingly light on the earlobes with zero pulling even after a full evening out. The antique matte gold finish looks so rich. Very happy with this buy!',
    verified: true,
    helpfulCount: 39,
    badge: 'Verified Buyer',
    userImage: '/girl_reviewer_3.jpg',
  },
  {
    id: 'rev-7',
    author: 'Meenakshi Iyer',
    city: 'Chennai',
    state: 'Tamil Nadu',
    rating: 5,
    date: '2 weeks ago',
    title: 'South Indian temple design looks like 22k temple gold',
    comment:
      'The Lakshmi Devi motif and pearl drops are crafted with exquisite precision. Perfect for Bharatanatyam recitals, temple visits, and family festive functions. Does not cause any skin irritation.',
    verified: true,
    helpfulCount: 31,
    badge: 'Verified Buyer',
    userImage: '/girl_reviewer_1.jpg',
  },
];

export const FAQS_LIST: FaqItem[] = [
  {
    question: 'Is the gold plating anti-tarnish and skin friendly?',
    answer:
      'Yes, absolutely. QAVELLE uses hypoallergenic, lead-free and nickel-free alloy with advanced multi-layer micro oxidised gold electroplating. Every order comes accompanied by an official QAVELLE Quality Certificate confirming skin-safe and durable finish.',
  },
  {
    question: 'Are these jhumkas heavy on the earlobes?',
    answer:
      'No! Each pair is specially engineered using lightweight filigree and hollow-craft techniques, weighing only 8 to 14 grams per pair. You can wear them comfortably all day and night during festivals and weddings without any earlobe pulling or pain.',
  },
  {
    question: 'What is included in the Set of 6 combo pack?',
    answer:
      'The combo includes 6 distinct pairs: 1x Peacock Motif Jhumka, 1x South Indian Temple Lakshmi Jhumka, 1x Ruby-Emerald Floral Jhumka, 1x Teardrop Filigree Jhumka, 1x Pearl Droplet Jhumka, and 1x Classic Heritage Bell Jhumka, along with a luxury gift box and velvet storage pouches.',
  },
  {
    question: 'How should I care for and clean my gold-plated jhumkas?',
    answer:
      'To maintain the bright antique luster, avoid spraying perfumes or applying lotions directly on the earrings. Wipe gently with a dry cotton cloth after use and store in the provided velvet pouch or box away from moisture.',
  },
  {
    question: 'Is Cash on Delivery (COD) available and what is the return policy?',
    answer:
      'Yes! Cash on Delivery is available across 26,000+ PIN codes in India. We offer free express shipping and a 7-day hassle-free replacement guarantee if you receive any damaged or defective piece.',
  },
];

export const RELATED_PRODUCTS = [
  {
    id: 'rel-1',
    title: 'Royal Kundan Pearl Bridal Choker Set (Necklace + Earrings)',
    rating: 4.9,
    reviews: 2140,
    price: 1299,
    originalPrice: 2999,
    discount: '57% OFF',
    tag: 'Bestseller Choker',
    image: kundanChokerImg,
  },
  {
    id: 'rel-2',
    title: 'Antique Temple Lakshmi Long Haram Necklace Set',
    rating: 4.8,
    reviews: 1480,
    price: 1499,
    originalPrice: 3499,
    discount: '57% OFF',
    tag: 'Temple Heritage',
    image: templeHaramImg,
  },
  {
    id: 'rel-3',
    title: 'Royal Ruby & Emerald Antique Floral Necklace Set',
    rating: 4.9,
    reviews: 1840,
    price: 1199,
    originalPrice: 2799,
    discount: '57% OFF',
    tag: 'Festive Wear',
    image: rubyFloralNecklaceImg,
  },
  {
    id: 'rel-4',
    title: 'Handcrafted Antique Gold Peacock Kada Bangles (Set of 4)',
    rating: 4.8,
    reviews: 1250,
    price: 899,
    originalPrice: 1999,
    discount: '55% OFF',
    tag: 'Set of 4',
    image: antiqueBanglesImg,
  },
];

export const LIVE_SALES_NOTIFICATIONS = [
  { name: 'Pooja K.', city: 'Delhi NCR', time: 'Just now', item: 'Gold Plated Fancy Jhumka (Set of 6)' },
  { name: 'Ananya S.', city: 'Mumbai', time: '1 min ago', item: 'Royal Kundan Pearl Choker Set' },
  { name: 'Sneha R.', city: 'Bengaluru', time: '3 mins ago', item: 'Gold Plated Fancy Jhumka (Set of 6)' },
  { name: 'Ritika J.', city: 'Jaipur', time: '5 mins ago', item: 'Antique Temple Lakshmi Haram Set' },
  { name: 'Meera V.', city: 'Hyderabad', time: '8 mins ago', item: 'Gold Plated Fancy Jhumka (Set of 6)' },
  { name: 'Divya P.', city: 'Ahmedabad', time: '12 mins ago', item: 'Handcrafted Peacock Kada Bangles' },
];

/* =========================================================================
   RHODIUM PLATED AUSTRIAN DIAMOND - ROYAL KUNDAN PEARL CHOKER DATASET
   ========================================================================= */

export const CHOKER_PRODUCT_DETAILS = {
  id: 'choker-bridal-set',
  title: 'Rhodium Plated White Austrian Diamond Bridal Choker Set',
  fullDescription:
    'Rhodium Plated White Austrian Diamond Bridal Choker Set (Necklace + Jhumka Earrings + Maang Tikka)',
  shortTitle: 'Austrian Diamond Choker Set',
  tagline: 'Rhodium Plated White Austrian Diamond Bridal Set • Necklace + Jhumka Earrings + Maang Tikka',
  rating: 4.8,
  ratingsCount: 21490,
  reviewsCount: 8420,
  size: 'Adjustable Free Size',
  price: 799,
  originalPrice: 2999,
  discountPercent: 73,
  sku: 'QAV-RHOD-AUST-CHOKER-01',
  inStock: true,
  stockLeft: 8,
  recentSales24h: 184,
  currentLiveViewers: 38,
  freeDeliveryThreshold: 0,
  brand: 'QAVELLE',
  countryOfOrigin: 'India',
};

export const CHOKER_PRODUCT_HIGHLIGHTS = [
  { label: 'Base Metal', value: 'Alloy & Brass' },
  { label: 'Plating', value: 'Rhodium Plated' },
  { label: 'Stone Type', value: 'Cubic Zirconia / White Austrian Diamond' },
  { label: 'Sizing', value: 'Adjustable (Dori Cord)' },
  { label: 'Type', value: 'Necklace, Earrings & Maangtika' },
  { label: 'Net Quantity (N)', value: '1 Complete Set' },
];

export const CHOKER_ADDITIONAL_DETAILS = [
  { label: 'Base Metal', value: 'Alloy' },
  { label: 'Plating', value: 'Rhodium / Silver Finish' },
  { label: 'Stone Type', value: 'Austrian Diamond / CZ' },
  { label: 'Sizing', value: 'Adjustable (Free Size)' },
  { label: 'Color', value: 'White / Silver Sparkle' },
  { label: 'Occasion', value: 'Bridal, Wedding, Partywear' },
  { label: 'Country of Origin', value: 'India' },
  { label: 'Net Quantity', value: '1 Necklace + 2 Earrings + 1 Tikka' },
  { label: 'Care', value: 'Wipe with soft cloth, store dry' },
];

export const CHOKER_PRODUCT_GALLERY: ProductGalleryItem[] = [
  {
    id: 'chk-hero-website',
    src: '/Hero_website_neklace.webp',
    thumbSrc: '/Hero_website_neklace_thumb.webp',
    alt: 'Royal Bridal & Festive Necklace Set - Official Hero Website Showcase',
    title: 'Official Hero Banner',
    tag: 'Hero View',
  },
  {
    id: 'chk-product-shot-1',
    src: '/neklace_producshot.webp',
    thumbSrc: '/neklace_producshot_thumb.webp',
    alt: 'Royal Bridal Necklace with Matching Earrings & Maang Tikka - Studio Product Shot',
    title: 'Studio Product Shot',
    tag: 'Studio',
  },
  {
    id: 'chk-product-shot-2',
    src: '/neklace_productshot_2.webp',
    thumbSrc: '/neklace_productshot_2_thumb.webp',
    alt: 'Artisan Crafted Stone Setting & Pearl Drops Close-Up - Detail Product Shot',
    title: 'Artisan Craft & Details',
    tag: 'Detail',
  },
];

export const CHOKER_BUNDLE_OPTIONS: BundleOption[] = [
  {
    id: 'choker-single-set',
    title: 'Rhodium Plated White Austrian Diamond Bridal Choker Set',
    subtitle: '1x Royal Choker Necklace + 2x Jhumka Earrings + 1x Maang Tikka + Velvet Box',
    unitCount: 1,
    price: 799,
    originalPrice: 2999,
    discountPercent: 73,
    popular: true,
    saveAmount: 2200,
  },
];

export const CHOKER_REVIEWS_LIST: ReviewItem[] = [
  {
    id: 'chk-rev-1',
    author: 'Pooja Verma',
    city: 'Mumbai',
    state: 'Maharashtra',
    rating: 5,
    date: '2 days ago',
    title: 'The Austrian diamonds sparkle like real diamonds! Unbelievable quality for ₹799',
    comment:
      'I ordered this bridal choker set for my sister’s engagement. The rhodium plating has an exquisite mirror shine and the Austrian diamonds catch the light brilliantly. Delivered in 2 days with a beautiful velvet box!',
    verified: true,
    helpfulCount: 124,
    badge: 'Verified Buyer',
    userImage: '/necklace_review_1.jpg',
  },
  {
    id: 'chk-rev-2',
    author: 'Ananya Iyer',
    city: 'Bengaluru',
    state: 'Karnataka',
    rating: 5,
    date: '3 days ago',
    title: 'Lightweight on neck and zero itching. Pure royalty!',
    comment:
      'The choker sits flat against the collarbone without scratching or pinching. The dori cord is sturdy and easily adjustable. Matching jhumkas and maang tikka complete the royal look effortlessly.',
    verified: true,
    helpfulCount: 96,
    badge: 'Verified Buyer',
    userImage: '/girl_reviewer_2.jpg',
  },
  {
    id: 'chk-rev-3',
    author: 'Radhika Sharma',
    city: 'Delhi NCR',
    state: 'Delhi',
    rating: 5,
    date: '5 days ago',
    title: 'Looks 10x more expensive in person. Endless compliments at reception',
    comment:
      'Everyone at the party assumed this was an expensive diamond choker from Tanishq. The rhodium finish is completely tarnish-free. Highly recommend QAVELLE for bridal jewelry.',
    verified: true,
    helpfulCount: 78,
    badge: 'Verified Buyer',
    userImage: '/necklace_review_3.jpg',
  },
  {
    id: 'chk-rev-4',
    author: 'Meera Sen',
    city: 'Kolkata',
    state: 'West Bengal',
    rating: 5,
    date: '1 week ago',
    title: 'Safe packaging and pristine white crystals',
    comment:
      'Arrived in tamper-proof bubble packaging inside a luxury jewelry box. The pearl droplets add such a feminine grace. Best online jewelry purchase this season.',
    verified: true,
    helpfulCount: 54,
    badge: 'Verified Buyer',
    userImage: '/girl_reviewer_3.jpg',
  },
  {
    id: 'chk-rev-5',
    author: 'Suman Chawla',
    city: 'Chandigarh',
    state: 'Punjab',
    rating: 5,
    date: '1 week ago',
    title: 'The matching jhumka earrings are gorgeous',
    comment:
      'Usually necklace sets come with tiny studs, but these matching jhumkas are full-sized, lightweight, and so regal. Loved the maang tikka too!',
    verified: true,
    helpfulCount: 42,
    badge: 'Verified Buyer',
    userImage: '/girl_reviewer_1.jpg',
  },
];

export const SHOWCASE_ITEMS = {
  choker: {
    id: 'choker-set',
    title: 'Rhodium Plated White Austrian Diamond Bridal Choker Set',
    category: 'Necklace Set',
    subtitle: 'Rhodium Plated White Austrian Diamond Choker + Jhumkas + Maang Tikka',
    price: 799,
    originalPrice: 2999,
    discount: '73% OFF',
    rating: 4.8,
    reviews: 8420,
    image: '/Hero_website_neklace.png',
  },
  jhumka: {
    id: 'jhumka-set',
    title: 'Gold Plated Fancy Jhumka Earrings for Women – Set of 6 Pairs',
    category: 'Jhumka Combo',
    subtitle: '6 Unique Pairs of Antique Oxidised Gold Jhumkas in Royal Keepsake Box',
    price: 499,
    originalPrice: 1999,
    discount: '75% OFF',
    rating: 4.2,
    reviews: 18723,
    image: '/Cinematic.png',
  },
};

export const CHOKER_CUSTOMER_MEDIA = [
  {
    id: 'm-chk-1',
    type: 'image',
    image: '/necklace_review_1.jpg',
    author: 'Pooja Verma',
    caption: 'Wore this royal choker set for my sister’s engagement reception!',
  },
  {
    id: 'm-chk-2',
    type: 'image',
    image: '/necklace_review_2.jpg',
    author: 'Ananya Iyer',
    caption: 'Unboxing the bridal choker set — breathtaking sparkle and velvet box!',
  },
  {
    id: 'm-chk-3',
    type: 'image',
    image: '/necklace_review_3.jpg',
    author: 'Radhika Sharma',
    caption: 'Looks 10x more expensive in person. Endless compliments at reception!',
  },
  {
    id: 'm-chk-shot1',
    type: 'image',
    image: '/neklace_producshot.png',
    author: 'Meera Sen',
    caption: 'Close-up studio view of the necklace — intricate setting and brilliant shine!',
  },
  {
    id: 'm-chk-shot2',
    type: 'image',
    image: '/neklace_productshot_2.png',
    author: 'Suman Chawla',
    caption: 'The matching jhumka earrings and maang tikka are pure royalty!',
  },
];

/* =========================================================================
   SHIMMERING BEAUTIFUL PACK OF 5 NECKLACE CHAIN PENDANT COMBO DATASET
   ========================================================================= */

export const SHIMMERING_SLUG =
  '/shimmering-beautiful-pack-of-5-necklace-chain-pendant-combo-for-women-and-girls';

export const SHIMMERING_PRODUCT_DETAILS = {
  id: 'necklace-combo-5',
  title: 'Shimmering Beautiful Pack of 5 Necklace Chain Pendant Combo for Women and Girls',
  fullDescription:
    'Shimmering Beautiful Pack of 5 Necklace Chain Pendant Combo for Women and Girls – 5 Distinct Designer Pendants (Curved Pearl Arch, Dainty Star, Solitaire Pearl Drop, Polished Heart, & Infinity Charm) with High-Shine Silver Plated Chains. Designed for versatile styling, allowing you to wear each pendant individually for everyday minimalism or layered together for an elevated statement.',
  shortTitle: 'Shimmering Pack of 5 Combo',
  tagline: '5 Designer Silver Pendant Chains • Anti-Tarnish Finish • Lightweight Daily & Party Wear',
  rating: 4.8,
  ratingsCount: 16840,
  reviewsCount: 4920,
  size: '18 Inch + 2 Inch Extender (Adjustable)',
  price: 349,
  originalPrice: 999,
  discountPercent: 65,
  sku: 'QAV-NECK-COMBO-5-SLV',
  inStock: true,
  stockLeft: 12,
  recentSales24h: 312,
  currentLiveViewers: 45,
  freeDeliveryThreshold: 0,
  brand: 'QAVELLE',
  countryOfOrigin: 'India',
};

export const SHIMMERING_PRODUCT_HIGHLIGHTS = [
  { label: 'Base Metal', value: 'High-Grade Skin-Safe Alloy' },
  { label: 'Plating', value: 'Silver Plated Anti-Tarnish Lustrous Coating' },
  { label: 'Stone / Accent Type', value: 'Lustrous Pearls & Polished Silver Motifs' },
  { label: 'Chain Length', value: '18 Inches + 2 Inch Adjustable Extender' },
  { label: 'Pendants', value: '5 Distinct Motifs (Curved Pearl Arch, Dainty Star, Solitaire Pearl Drop, Polished Heart, Infinity Charm)' },
  { label: 'Net Quantity (N)', value: 'Pack of 5 (5 Pendants with Chains)' },
];

export const SHIMMERING_ADDITIONAL_DETAILS = [
  { label: 'Closure', value: 'Secure Lobster Claw Clasp' },
  { label: 'Occasion', value: 'Daily Wear, College, Office, Gifting, Casual & Party Wear' },
  { label: 'Gender', value: 'Women & Girls' },
  { label: 'Skin Safety', value: '100% Nickel & Lead Free (Hypoallergenic)' },
  { label: 'Country of Origin', value: 'India' },
  { label: 'Care Instructions', value: 'Wipe with soft dry cloth, store in airtight pouch' },
];

export const SHIMMERING_PRODUCT_GALLERY: ProductGalleryItem[] = [
  {
    id: 'shim-hero',
    src: '/combo5_user_1.webp',
    thumbSrc: '/combo5_user_1_thumb.webp',
    alt: 'Shimmering Beautiful Pack of 5 Necklace Chain Pendant Combo',
    title: 'Pack of 5 Silver Necklaces',
    tag: 'Hero View',
  },
  {
    id: 'shim-user-2',
    src: '/combo5_user_2.webp',
    thumbSrc: '/combo5_user_2_thumb.webp',
    alt: 'Individual Pendant Motifs Close-Up View',
    title: 'Pendant Detail Shot',
    tag: 'Detail',
  },
  {
    id: 'shim-user-3',
    src: '/combo5_user_3.webp',
    thumbSrc: '/combo5_user_3_thumb.webp',
    alt: 'Lustrous Finish & Dainty Everyday Chains',
    title: 'Lustrous Finish',
    tag: 'Finish',
  },
  {
    id: 'shim-user-4',
    src: '/combo5_user_4.webp',
    thumbSrc: '/combo5_user_4_thumb.webp',
    alt: 'Secure Lobster Clasp Extender Craftsmanship',
    title: 'Motifs & Clasp',
    tag: 'Craft',
  },
];

export const SHIMMERING_BUNDLE_OPTIONS: BundleOption[] = [
  {
    id: 'shim-5-single',
    title: '1x Pack of 5 Necklace Set',
    subtitle: '5 Silver Pendant Chains + Velvet Box + Free Shipping',
    unitCount: 1,
    price: 349,
    originalPrice: 999,
    discountPercent: 65,
    popular: true,
    saveAmount: 650,
  },
  {
    id: 'shim-5-double',
    title: '2x Sets (Pack of 10 Necklaces)',
    subtitle: '10 Necklaces (Best Value for Gifting) + Extra ₹99 OFF',
    unitCount: 2,
    price: 599,
    originalPrice: 1998,
    discountPercent: 70,
    popular: false,
    saveAmount: 1399,
  },
  {
    id: 'shim-5-triple',
    title: '3x Sets (Pack of 15 Necklaces)',
    subtitle: '15 Necklaces (Family Gifting) + Free Express Delivery',
    unitCount: 3,
    price: 799,
    originalPrice: 2997,
    discountPercent: 73,
    popular: false,
    saveAmount: 2198,
  },
];

/* =========================================================================
   ELEGANT EVERYDAY NECKLACE SET – COMBO OF 5 NECKLACES DATASET
   ========================================================================= */

export const COMBO5_SLUG = '/elegant-everyday-necklace-set-combo-of-5-necklaces';
export const ELEGANT_EVERYDAY_SLUG = COMBO5_SLUG;

export const ELEGANT_EVERYDAY_PRODUCT_DETAILS = {
  id: 'elegant-everyday-5',
  title: 'Elegant Everyday Necklace Set – Combo of 5 Necklaces',
  fullDescription:
    'Elegant Everyday Necklace Set – Combo of 5 Necklaces. An artificial necklace set designed for daily wear, office wear, casual outfits, college, and dresses. Crafted with brass base metal, lustrous gold plating, and sparkling Cubic Zirconia / American Diamond stones. Features sleek, subtle, and stylish long pendant chains in free size with adjustable extenders. Light on the neck, hypoallergenic, and versatile to be worn solo for a minimalist aesthetic or layered together for a chic trendy look.',
  shortTitle: 'Elegant Everyday Combo of 5',
  tagline: '5 Sleek & Subtle Everyday Necklaces • Brass Base Metal with Gold Plating • Cubic Zirconia / AD Stones',
  rating: 4.8,
  ratingsCount: 18420,
  reviewsCount: 5210,
  size: 'Free Size (18 Inch + 2 Inch Adjustable Extender)',
  price: 349,
  originalPrice: 999,
  discountPercent: 65,
  sku: 'QAV-ELEGANT-COMBO5-GLD',
  inStock: true,
  stockLeft: 14,
  recentSales24h: 348,
  currentLiveViewers: 52,
  freeDeliveryThreshold: 0,
  brand: 'QAVELLE',
  countryOfOrigin: 'India',
};

export const COMBO5_PRODUCT_DETAILS = ELEGANT_EVERYDAY_PRODUCT_DETAILS;

export const ELEGANT_EVERYDAY_PRODUCT_HIGHLIGHTS = [
  { label: 'Base Metal', value: 'Brass (High-Grade Skin-Safe Alloy)' },
  { label: 'Plating', value: 'Gold Plated (Lustrous Anti-Tarnish Finish)' },
  { label: 'Stone / Accent Type', value: 'Cubic Zirconia / American Diamond (AD)' },
  { label: 'Type', value: 'Long / Layered Necklaces (Combo of 5)' },
  { label: 'Sizing', value: 'Free Size (18 Inches + 2 Inch Extender)' },
  { label: 'Net Quantity (N)', value: '5 (Combo of 5 Necklaces)' },
];

export const COMBO5_PRODUCT_HIGHLIGHTS = ELEGANT_EVERYDAY_PRODUCT_HIGHLIGHTS;

export const ELEGANT_EVERYDAY_ADDITIONAL_DETAILS = [
  { label: 'Package Contains', value: '5 Individual Pendant Necklaces' },
  { label: 'Closure', value: 'Secure Lobster Claw Clasp with Extender' },
  { label: 'Occasion', value: 'Daily Wear, Office Wear, Casual Outfits, College, Dresses & Gifting' },
  { label: 'Gender', value: 'Women & Girls' },
  { label: 'Skin Safety', value: '100% Nickel & Lead Free (Hypoallergenic)' },
  { label: 'Country of Origin', value: 'India' },
  { label: 'Quality Certification', value: 'QAVELLE Certified Hallmark Standard' },
  { label: 'Care Instructions', value: 'Wipe with soft dry cloth, store in airtight pouch away from water & perfumes' },
];

export const COMBO5_ADDITIONAL_DETAILS = ELEGANT_EVERYDAY_ADDITIONAL_DETAILS;

export const ELEGANT_EVERYDAY_PRODUCT_GALLERY: ProductGalleryItem[] = [
  {
    id: 'e5-img-1',
    src: '/elegant_combo_1.webp',
    thumbSrc: '/elegant_combo_1_thumb.webp',
    alt: 'Elegant Everyday Necklace Set – Combo of 5 Necklaces (Photo 1)',
    title: 'Combo of 5 Necklaces Set',
    tag: 'Hero View',
  },
  {
    id: 'e5-img-2',
    src: '/elegant_combo_2.webp',
    thumbSrc: '/elegant_combo_2_thumb.webp',
    alt: 'Elegant Everyday Necklace Set – Detail View (Photo 2)',
    title: 'Pendant & Chain Detail',
    tag: 'Detail',
  },
  {
    id: 'e5-img-3',
    src: '/elegant_combo_3.webp',
    thumbSrc: '/elegant_combo_3_thumb.webp',
    alt: 'Elegant Everyday Necklace Set – Finish & Craftsmanship (Photo 3)',
    title: 'Finish & Craftsmanship',
    tag: 'Finish',
  },
  {
    id: 'e5-img-4',
    src: '/elegant_combo_4.webp',
    thumbSrc: '/elegant_combo_4_thumb.webp',
    alt: 'Elegant Everyday Necklace Set – Individual Motifs (Photo 4)',
    title: 'Pendant Motifs & Chains',
    tag: 'Motifs',
  },
  {
    id: 'e5-img-5',
    src: '/elegant_combo_5.webp',
    thumbSrc: '/elegant_combo_5_thumb.webp',
    alt: 'Elegant Everyday Necklace Set – Layered Display (Photo 5)',
    title: 'Layered Styling',
    tag: 'Styling',
  },
];

export const COMBO5_PRODUCT_GALLERY = ELEGANT_EVERYDAY_PRODUCT_GALLERY;

export const COMBO5_BUNDLE_OPTIONS: BundleOption[] = [
  {
    id: 'combo-5-single',
    title: '1x Combo of 5 Necklaces Set',
    subtitle: '5 Everyday Necklaces + Velvet Box + Free Shipping',
    unitCount: 1,
    price: 349,
    originalPrice: 999,
    discountPercent: 65,
    popular: true,
    saveAmount: 650,
  },
  {
    id: 'combo-5-double',
    title: '2x Sets (Combo of 10 Necklaces)',
    subtitle: '10 Necklaces (Best Value for Gifting & Friends) + Extra ₹99 OFF',
    unitCount: 2,
    price: 599,
    originalPrice: 1998,
    discountPercent: 70,
    popular: false,
    saveAmount: 1399,
  },
  {
    id: 'combo-5-triple',
    title: '3x Sets (Combo of 15 Necklaces)',
    subtitle: '15 Necklaces (Family & Festive Gifting) + Free Express Delivery',
    unitCount: 3,
    price: 799,
    originalPrice: 2997,
    discountPercent: 73,
    popular: false,
    saveAmount: 2198,
  },
];

export const COMBO5_REVIEWS_LIST: ReviewItem[] = [
  {
    id: 'c5-rev-1',
    author: 'Kavya Singhania',
    city: 'Pune',
    state: 'Maharashtra',
    rating: 5,
    date: '2 days ago',
    title: 'All 5 necklaces are sleek & subtle! Unbeatable value for ₹349',
    comment:
      'I was genuinely impressed when opening this package. All 5 necklaces arrived untangled in individual pouches. The cubic zirconia sparkle looks so elegant for daily office wear. The chains feel sturdy, have smooth lobster clasps, and zero itching or skin irritation even after all-day wear.',
    verified: true,
    helpfulCount: 89,
    badge: 'Verified Buyer',
    userImage: '/girl_reviewer_1.jpg',
  },
  {
    id: 'c5-rev-2',
    author: 'Rhea Kapoor',
    city: 'Delhi',
    state: 'Delhi NCR',
    rating: 5,
    date: '3 days ago',
    title: 'Super aesthetic minimal jewelry — perfect for office & dresses',
    comment:
      'Ordered after seeing this collection trending online. The plating looks bright and classy, not cheap or artificial. You can wear them individually for a minimalist statement or layer together for a trendy look. Delivered in 2 days to Delhi with cash on delivery.',
    verified: true,
    helpfulCount: 74,
    badge: 'Verified Buyer',
    userImage: '/girl_reviewer_2.jpg',
  },
  {
    id: 'c5-rev-3',
    author: 'Tanvi Deshmukh',
    city: 'Mumbai',
    state: 'Maharashtra',
    rating: 5,
    date: '5 days ago',
    title: 'Shared with my sisters and everyone loved their pick!',
    comment:
      'At ₹349 for 5 separate necklaces, this is exceptional value. My sisters took two each, while I kept three. The 2-inch extender chain makes it easy to adjust the length to suit high necks or V-neck dresses. Will definitely purchase again for gifting.',
    verified: true,
    helpfulCount: 62,
    badge: 'Verified Buyer',
    userImage: '/girl_reviewer_3.jpg',
  },
  {
    id: 'c5-rev-4',
    author: 'Ishita Nair',
    city: 'Kochi',
    state: 'Kerala',
    rating: 5,
    date: '1 week ago',
    title: 'No tarnishing or color fading, looks exactly like the photos',
    comment:
      'I have sensitive skin and usually cheap artificial chains turn red or darken within a few hours. These are genuinely hypoallergenic brass alloy. Wore the solitaire pendant in humid Kochi weather for days with zero tarnishing. Packaging was secure and delivery was super fast.',
    verified: true,
    helpfulCount: 51,
    badge: 'Verified Buyer',
    userImage: '/girl_reviewer_4.jpg',
  },
];

export const COMBO5_CUSTOMER_MEDIA = [
  {
    id: 'm-c5-1',
    type: 'image',
    image: '/combo5_user_1.webp',
    author: 'Kavya Singhania',
    caption: 'Combo of 5 everyday necklaces — stunning finish and 5 beautiful pendants!',
  },
  {
    id: 'm-c5-2',
    type: 'image',
    image: '/combo5_user_2.webp',
    author: 'Rhea Kapoor',
    caption: 'Close-up of pendant & chain craftsmanship, very high quality finish.',
  },
  {
    id: 'm-c5-3',
    type: 'image',
    image: '/combo5_user_3.webp',
    author: 'Tanvi Deshmukh',
    caption: 'Lustrous shine and delicate motifs, looks so minimal & pretty in person.',
  },
  {
    id: 'm-c5-4',
    type: 'image',
    image: '/combo5_user_4.webp',
    author: 'Ishita Nair',
    caption: 'Individual chains with sturdy clasps, super lightweight and comfortable on neck.',
  },
];

export const ELEGANT_EVERYDAY_CUSTOMER_MEDIA = [
  {
    id: 'm-ee-1',
    type: 'image',
    image: '/elegant_combo_1.webp',
    author: 'Kavya Singhania',
    caption: 'Combo of 5 everyday necklaces — stunning finish and 5 beautiful pendants!',
  },
  {
    id: 'm-ee-2',
    type: 'image',
    image: '/elegant_combo_2.webp',
    author: 'Rhea Kapoor',
    caption: 'Close-up of pendant & chain craftsmanship, very high quality finish.',
  },
  {
    id: 'm-ee-3',
    type: 'image',
    image: '/elegant_combo_3.webp',
    author: 'Tanvi Deshmukh',
    caption: 'Lustrous shine and delicate motifs, looks so minimal & pretty in person.',
  },
  {
    id: 'm-ee-4',
    type: 'image',
    image: '/elegant_combo_4.webp',
    author: 'Ishita Nair',
    caption: 'Individual chains with sturdy clasps, super lightweight and comfortable on neck.',
  },
  {
    id: 'm-ee-5',
    type: 'image',
    image: '/elegant_combo_5.webp',
    author: 'Ananya Sharma',
    caption: 'Perfect 5-piece layered collection for daily wear and mix-matching with dresses!',
  },
];

export const ELEGANT_EVERYDAY_REVIEWS_LIST = COMBO5_REVIEWS_LIST;
export const SHIMMERING_REVIEWS_LIST = COMBO5_REVIEWS_LIST;

export const SHIMMERING_CUSTOMER_MEDIA = COMBO5_CUSTOMER_MEDIA;

export const ELEGANT_EVERYDAY_BUNDLE_OPTIONS = COMBO5_BUNDLE_OPTIONS;

/* =========================================================================
   RADHIKA ANANT AMBANI INSPIRED GREEN AD NECKLACE SET DATASET
   ========================================================================= */

export const RADHIKA_GREEN_AD_SLUG = '/radhika-anant-ambani-inspired-green-ad-neckless-set';

export const RADHIKA_GREEN_AD_PRODUCT_DETAILS = {
  id: 'radhika-green-ad',
  title: 'Radhika Anant Ambani Inspired Green AD Necklace Set with Matching Earrings',
  fullDescription:
    'Radhika Anant Ambani Inspired Green AD Necklace Set – Regal Emerald Green Austrian American Diamond Choker Necklace with Matching Chandelier Earrings, crafted with skin-safe brass alloy and anti-tarnish rhodium silver plating.',
  shortTitle: 'Radhika Ambani Inspired Green AD Set',
  tagline: 'Colombian Emerald Green Crystals • Austrian American Diamonds • Anti-Tarnish Rhodium Finish',
  rating: 4.9,
  ratingsCount: 21450,
  reviewsCount: 5820,
  size: 'Adjustable Dori / Clasp (Free Size fits all neck sizes)',
  price: 299,
  originalPrice: 999,
  discountPercent: 70,
  sku: 'QAV-RADHIKA-AMBANI-GREEN-AD',
  inStock: true,
  stockLeft: 7,
  recentSales24h: 428,
  currentLiveViewers: 62,
  freeDeliveryThreshold: 0,
  brand: 'QAVELLE',
  countryOfOrigin: 'India',
};

export const RADHIKA_GREEN_AD_PRODUCT_HIGHLIGHTS = [
  { label: 'Base Metal', value: 'High-Grade Skin-Safe Brass Alloy' },
  { label: 'Plating', value: 'Silver Plated / Rhodium Anti-Tarnish Finish' },
  { label: 'Stone Type', value: 'Colombian Emerald Green CZ & Sparkling American Diamonds' },
  { label: 'Sizing', value: 'Free Size (Adjustable Extender Fits All)' },
  { label: 'Occasion', value: 'Wedding, Reception, Engagement, Sangeet & Festive Parties' },
  { label: 'Net Quantity (N)', value: '1 Necklace + 1 Pair of Matching Earrings' },
];

export const RADHIKA_GREEN_AD_ADDITIONAL_DETAILS = [
  { label: 'Package Contains', value: '1 Statement Green AD Necklace + 1 Pair Matching Earrings + Luxury Velvet Pouch' },
  { label: 'Closure', value: 'Adjustable Silk Dori / Secure Hook Clasp' },
  { label: 'Earring Type', value: 'Dangling Chandelier Emerald-Cut AD Earrings with Push Back' },
  { label: 'Stone Setting', value: 'Micro-Pavé Claw Setting with Faceted Emerald Cut Centerpieces' },
  { label: 'Skin Safety', value: '100% Nickel-Free & Lead-Free (Anti-Allergic)' },
  { label: 'Country of Origin', value: 'India' },
  { label: 'Care Instructions', value: 'Wipe with soft dry cloth after use. Store away from perfumes & direct water.' },
];

export const RADHIKA_GREEN_AD_PRODUCT_GALLERY: ProductGalleryItem[] = [
  {
    id: 'rg-1',
    src: '/radhika_ambani_1.webp',
    thumbSrc: '/radhika_ambani_1_thumb.webp',
    alt: 'Radhika Ambani Inspired Green AD Necklace Set - Celebrity Styling & Full Set Display',
    title: 'Celebrity Look & Set',
    tag: 'Hero View',
  },
  {
    id: 'rg-2',
    src: '/radhika_ambani_2.webp',
    thumbSrc: '/radhika_ambani_2_thumb.webp',
    alt: 'Radhika Ambani Emerald Green AD Necklace in Royal Velvet Jewelry Box Packaging',
    title: 'Velvet Box Packaging',
    tag: 'Packaging',
  },
  {
    id: 'rg-3',
    src: '/radhika_ambani_3.webp',
    thumbSrc: '/radhika_ambani_3_thumb.webp',
    alt: 'Statement Colombian Emerald Green Choker Necklace and Chandelier Earrings on Display Bust',
    title: 'Necklace on Display Bust',
    tag: 'Display View',
  },
  {
    id: 'rg-4',
    src: '/radhika_ambani_4.webp',
    thumbSrc: '/radhika_ambani_4_thumb.webp',
    alt: 'Close-up Bridal Portrait of Radhika Ambani Green Emerald AD Jewelry Set on Model',
    title: 'Bridal Portrait Styling',
    tag: 'On Model',
  },
  {
    id: 'rg-5',
    src: '/radhika_ambani_5.webp',
    thumbSrc: '/radhika_ambani_5_thumb.webp',
    alt: 'Pair of Matching Colombian Emerald Green Drop Chandelier Earrings on T-Bar Stand',
    title: 'Matching Chandelier Earrings',
    tag: 'Earrings Pair',
  },
];

export const RADHIKA_GREEN_AD_BUNDLE_OPTIONS: BundleOption[] = [
  {
    id: 'radhika-green-single',
    title: '1x Radhika Ambani Inspired Green AD Set',
    subtitle: '1 Necklace + 1 Pair Matching Earrings + Luxury Velvet Pouch + Free Shipping',
    unitCount: 1,
    price: 299,
    originalPrice: 999,
    discountPercent: 70,
    popular: true,
    saveAmount: 700,
  },
  {
    id: 'radhika-green-double',
    title: '2x Sets (Best For Gifting / Sisters)',
    subtitle: '2 Complete Sets (Necklaces + Earrings) + Extra ₹49 OFF',
    unitCount: 2,
    price: 549,
    originalPrice: 1998,
    discountPercent: 72,
    popular: false,
    saveAmount: 1449,
  },
  {
    id: 'radhika-green-family',
    title: '3x Sets (Family Bridal Combo)',
    subtitle: '3 Complete Sets + Free Express Delivery + Luxury Gift Packaging',
    unitCount: 3,
    price: 799,
    originalPrice: 2997,
    discountPercent: 73,
    popular: false,
    saveAmount: 2198,
  },
];

export const RADHIKA_GREEN_AD_REVIEWS_LIST: ReviewItem[] = [
  {
    id: 'rg-rev-1',
    author: 'Priyanka Joshi',
    city: 'Udaipur',
    state: 'Rajasthan',
    rating: 5,
    date: '1 day ago',
    title: 'Felt like pure royalty! Exact Radhika Ambani wedding vibe',
    comment:
      'The emerald green color is mesmerizing and deep, not transparent or plastic-like. The Austrian American diamonds catch every beam of light under banquet chandeliers. Wore it to my cousin’s sangeet in Udaipur with a deep bottle-green lehenga and got showered with compliments all evening! Super secure clasp and no itching.',
    verified: true,
    helpfulCount: 118,
    badge: 'Verified Buyer',
    userImage: '/girl_reviewer_1.jpg',
  },
  {
    id: 'rg-rev-2',
    author: 'Meera Bhatt',
    city: 'Ahmedabad',
    state: 'Gujarat',
    rating: 5,
    date: '2 days ago',
    title: 'Unbelievable quality for ₹299 — looks worth at least ₹3,500',
    comment:
      'I was honestly hesitant ordering jewelry at ₹299 thinking it might look dull, but when I opened the package I was stunned. The finish is immaculate, stones are tightly prong-set, and the matching earrings are statement pieces on their own. Delivered in 2 days with Cash on Delivery.',
    verified: true,
    helpfulCount: 95,
    badge: 'Verified Buyer',
    userImage: '/girl_reviewer_2.jpg',
  },
  {
    id: 'rg-rev-3',
    author: 'Sneha Nair',
    city: 'Bengaluru',
    state: 'Karnataka',
    rating: 5,
    date: '3 days ago',
    title: 'Zero allergic reaction, comfortable adjustable fit on neck',
    comment:
      'I have extremely sensitive skin and usually artificial jewelry causes redness within an hour. This set has a smooth backside with zero rough edges. Sits perfectly on the collarbone and the dori cord lets you adjust whether you want a snug choker or lower princess necklace.',
    verified: true,
    helpfulCount: 78,
    badge: 'Verified Buyer',
    userImage: '/girl_reviewer_3.jpg',
  },
  {
    id: 'rg-rev-4',
    author: 'Divya Malhotra',
    city: 'Chandigarh',
    state: 'Punjab',
    rating: 5,
    date: '5 days ago',
    title: 'Stones shine like real Colombian emeralds and solitaire diamonds',
    comment:
      'Paired this with an ivory and gold organza saree for a cocktail dinner. Friends kept asking if it was heirloom emerald jewelry! The rhodium silver plating gives it that authentic high-jewelry sheen. Very well packaged with bubble wrap and velvet pouch.',
    verified: true,
    helpfulCount: 64,
    badge: 'Verified Buyer',
    userImage: '/girl_reviewer_4.jpg',
  },
];

export const RADHIKA_GREEN_AD_CUSTOMER_MEDIA = [
  {
    id: 'm-rg-1',
    type: 'image',
    image: '/radhika_ambani_1.webp',
    author: 'Priyanka Joshi',
    caption: 'Radhika Ambani look comparison — regal Colombian emerald green tone with sparkling diamond pavé.',
  },
  {
    id: 'm-rg-2',
    type: 'image',
    image: '/radhika_ambani_2.webp',
    author: 'Meera Bhatt',
    caption: 'Opening the velvet jewelry box — securely cushioned and ready for royal gifting.',
  },
  {
    id: 'm-rg-3',
    type: 'image',
    image: '/radhika_ambani_3.webp',
    author: 'Sneha Nair',
    caption: 'Full bridal choker necklace & chandelier earrings on display — exquisite craftsmanship.',
  },
  {
    id: 'm-rg-4',
    type: 'image',
    image: '/radhika_ambani_4.webp',
    author: 'Divya Malhotra',
    caption: 'Close-up bridal portrait wearing the set — looks 10x more expensive in person!',
  },
  {
    id: 'm-rg-5',
    type: 'image',
    image: '/radhika_ambani_5.webp',
    author: 'Ananya Sharma',
    caption: 'The matching chandelier earrings are lightweight and hold securely with push-back clasps.',
  },
];

// =========================================================================
// ROYAL ELEGANT GOLD PLATED JEWELLERY SET (₹749)
// =========================================================================

export const ALLURE_GOLD_SET_SLUG = '/products/royal-elegant-gold-plated-jewellery-set';

export const ALLURE_GOLD_SET_PRODUCT_DETAILS = {
  id: 'allure-gold-set',
  title: 'Royal Elegant Gold Plated Jewellery Set with Matching Earrings',
  fullDescription:
    'Royal Elegant Gold Plated Jewellery Set – Majestic 22K micro gold-plated necklace set adorned with intricate leaf-shaped crystal motifs, imperial ruby-red gemstones, matching drop earrings, adjustable bracelet, and cocktail ring. Complete with free royal velvet presentation box.',
  shortTitle: 'Royal Elegant Gold Plated Set',
  tagline: '22K Micro Gold Plating • Imperial Ruby Gemstones • Austrian Crystals • Free Royal Velvet Gift Box',
  rating: 4.9,
  ratingsCount: 18420,
  reviewsCount: 4960,
  size: 'Adjustable Silk Dori / Clasp (Free Size fits all neck sizes)',
  price: 749,
  originalPrice: 2499,
  discountPercent: 70,
  sku: 'QAV-ROYAL-GOLD-SET-749',
  inStock: true,
  stockLeft: 8,
  recentSales24h: 312,
  currentLiveViewers: 54,
  freeDeliveryThreshold: 0,
  brand: 'QAVELLE',
  countryOfOrigin: 'India',
};

export const ALLURE_GOLD_SET_PRODUCT_HIGHLIGHTS = [
  { label: 'Base Metal', value: 'High-Grade Skin-Safe Brass Alloy' },
  { label: 'Plating', value: '22K Micro Gold Plating with Anti-Tarnish Seal' },
  { label: 'Stone Type', value: 'Imperial Ruby-Red Stones & Faceted Austrian Crystals' },
  { label: 'Sizing', value: 'Free Size (Adjustable Silk Dori Fits All)' },
  { label: 'Occasion', value: 'Weddings, Reception, Festive Puja, Sangeet & Grand Celebrations' },
  { label: 'Net Quantity (N)', value: '1 Necklace + 1 Pair Matching Earrings + Bracelet & Ring' },
];

export const ALLURE_GOLD_SET_ADDITIONAL_DETAILS = [
  { label: 'Package Contains', value: '1 Royal Gold Plated Necklace + 1 Pair Matching Drop Earrings + Bracelet & Ring + Velvet Box' },
  { label: 'Closure', value: 'Traditional Adjustable Silk Dori / Secure Hook Clasp' },
  { label: 'Earring Type', value: 'Matching Traditional Drop Dangler Earrings with Push Back' },
  { label: 'Stone Setting', value: 'Hand-Crafted Bezel & Micro-Prong Crystal Setting' },
  { label: 'Skin Safety', value: '100% Lead-Free & Nickel-Free (Hypoallergenic & Non-Irritating)' },
  { label: 'Country of Origin', value: 'India' },
  { label: 'Care Instructions', value: 'Wipe with soft cloth after wear. Keep away from water, soaps & perfumes.' },
];

export const ALLURE_GOLD_SET_PRODUCT_GALLERY: ProductGalleryItem[] = [
  {
    id: 'ag-1',
    src: '/aa1.webp',
    thumbSrc: '/aa1_thumb.webp',
    alt: 'Royal Elegant Gold Plated Jewellery Set - Complete Set with Necklace, Earrings, Bracelet and Ring',
    title: 'Complete Royal Jewellery Set',
    tag: 'Hero View',
  },
  {
    id: 'ag-2',
    src: '/aaa2.webp',
    thumbSrc: '/aaa2_thumb.webp',
    alt: 'Royal Elegant Gold Plated Jewellery Set Styled on Model - Ruby Gemstones & Drop Earrings',
    title: 'Royal Styling on Model',
    tag: 'On Model',
  },
  {
    id: 'ag-3',
    src: '/aa3.webp',
    thumbSrc: '/aa3_thumb.webp',
    alt: 'Close-Up of Royal Gold Necklace with Ruby Gemstone and Crystal Leaf Motifs',
    title: 'Royal Necklace Detail',
    tag: 'Necklace',
  },
  {
    id: 'ag-4',
    src: '/aa4.webp',
    thumbSrc: '/aa4_thumb.webp',
    alt: 'Matching 22K Micro Gold Plated Drop Earrings with Ruby Gemstones',
    title: 'Matching Drop Earrings',
    tag: 'Earrings',
  },
  {
    id: 'ag-5',
    src: '/aa5.webp',
    thumbSrc: '/aa5_thumb.webp',
    alt: 'Matching Gold Plated Adjustable Bracelet and Cocktail Ring',
    title: 'Matching Bracelet & Ring',
    tag: 'Accessories',
  },
];

export const ALLURE_GOLD_SET_BUNDLE_OPTIONS: BundleOption[] = [
  {
    id: 'allure-gold-single',
    title: '1x Royal Elegant Gold Plated Set',
    subtitle: '1 Royal Necklace + 1 Pair Matching Earrings + Bracelet & Ring + Free Velvet Box + Free Shipping',
    unitCount: 1,
    price: 749,
    originalPrice: 2499,
    discountPercent: 70,
    popular: true,
    saveAmount: 1750,
  },
  {
    id: 'allure-gold-double',
    title: '2x Sets (Sister / Bestie Combo)',
    subtitle: '2 Complete Gold Plated Sets + Free Velvet Boxes + Extra ₹100 OFF',
    unitCount: 2,
    price: 1399,
    originalPrice: 4998,
    discountPercent: 72,
    popular: false,
    saveAmount: 3599,
  },
  {
    id: 'allure-gold-family',
    title: '3x Sets (Grand Bridal Festive Combo)',
    subtitle: '3 Complete Sets + Free Express Delivery + Royal Gift Wrapping Included',
    unitCount: 3,
    price: 1999,
    originalPrice: 7497,
    discountPercent: 73,
    popular: false,
    saveAmount: 5498,
  },
];

export const ALLURE_GOLD_SET_REVIEWS_LIST: ReviewItem[] = [
  {
    id: 'ag-rev-1',
    author: 'Kavita Rathore',
    city: 'Jaipur',
    state: 'Rajasthan',
    rating: 5,
    date: '1 day ago',
    title: 'Pure royal craftsmanship! Looked like genuine 22K gold',
    comment:
      'I ordered this Royal Elegant set for my brother’s wedding in Jaipur. The golden polish has that rich warm temple gold sheen, not brassy or yellow. The filigree work is clean with no rough edges, and the matching earrings are so lightweight that I wore them for 8 hours straight with zero discomfort. Worth every single rupee of ₹749!',
    verified: true,
    helpfulCount: 94,
    badge: 'Verified Buyer',
    userImage: '/girl_reviewer_2.jpg',
  },
  {
    id: 'ag-rev-2',
    author: 'Shalini Deshmukh',
    city: 'Pune',
    state: 'Maharashtra',
    rating: 5,
    date: '3 days ago',
    title: 'Packaging in royal velvet box was breathtaking',
    comment:
      'Arrived in just 2 days with Cash on Delivery. The presentation is so premium — opened the velvet box and everyone in the room gasped! The necklace sits so gracefully around the collarbone and the adjustable dori makes it easy to adjust the drop. Highly recommended!',
    verified: true,
    helpfulCount: 78,
    badge: 'Verified Buyer',
    userImage: '/girl_reviewer_3.jpg',
  },
  {
    id: 'ag-rev-3',
    author: 'Ananya Sen',
    city: 'Kolkata',
    state: 'West Bengal',
    rating: 5,
    date: '5 days ago',
    title: 'Extremely good quality and zero tarnish after wear',
    comment:
      'Wore it during Durga Puja celebrations in Kolkata with a Banarasi saree. Received endless compliments! The stones have dazzling fire under festive lighting. Wiped it clean and stored it back in the pouch — still looks brand new. Amazing value at ₹749.',
    verified: true,
    helpfulCount: 52,
    badge: 'Verified Buyer',
    userImage: '/girl_reviewer_1.jpg',
  },
  {
    id: 'ag-rev-4',
    author: 'Meenakshi Iyer',
    city: 'Chennai',
    state: 'Tamil Nadu',
    rating: 5,
    date: '6 days ago',
    title: 'Perfect traditional weight and impeccable finish',
    comment:
      'The finish on this Royal Elegant jewellery set is flawless. Very neat stone setting, secure push back earrings, and authentic antique gold tone. Looks like a heritage heirloom piece. Truly impressed with QAVELLE’s quality.',
    verified: true,
    helpfulCount: 41,
    badge: 'Verified Buyer',
    userImage: '/girl_reviewer_4.jpg',
  },
];

export const ALLURE_GOLD_SET_CUSTOMER_MEDIA = [
  {
    id: 'm-ag-1',
    type: 'image',
    image: '/aa1.webp',
    author: 'Kavita Rathore',
    caption: 'Full Royal Elegant Gold Plated Jewellery Set resting on velvet display.',
  },
  {
    id: 'm-ag-2',
    type: 'image',
    image: '/aaa2.webp',
    author: 'Shalini Deshmukh',
    caption: 'Styled with royal festive attire — breathtaking ruby brilliance and elegant drape.',
  },
  {
    id: 'm-ag-3',
    type: 'image',
    image: '/aa3.webp',
    author: 'Priyanka Ghosh',
    caption: 'Close-up of the royal ruby gemstone and delicate leaf crystal motifs.',
  },
  {
    id: 'm-ag-4',
    type: 'image',
    image: '/aa4.webp',
    author: 'Ananya Sen',
    caption: 'Close-up of the matching drop earrings — lightweight and beautifully faceted.',
  },
  {
    id: 'm-ag-5',
    type: 'image',
    image: '/aa5.webp',
    author: 'Meenakshi Iyer',
    caption: 'Matching adjustable bracelet and cocktail ring — exquisite finishing throughout.',
  },
];

// =========================================================================
// TRENDY ALLOY GOLD PLATED JEWELLERY SET (₹399) - Reselling Edition
// =========================================================================

export const TRENDY_ALLOY_SET_SLUG = '/products/trendy-alloy-gold-plated-jewellery-set';

export const TRENDY_ALLOY_SET_MATCHING_VARIANTS = [
  {
    id: 'var-trendy-radhika',
    productId: 'radhika-green-ad' as const,
    title: 'Radhika Anant Ambani Inspired Green AD Necklace Set with Matching Drop Earrings',
    category: 'Celebrity Bridal AD Set',
    price: 299,
    originalPrice: 999,
    discountPercent: 70,
    image: '/radhika_ambani_1.webp',
    tag: 'Ambani Inspired',
    sourceUrl: '/products/radhika-anant-ambani-inspired-green-ad-necklace-set',
  },
  {
    id: 'var-trendy-allure',
    productId: 'allure-gold-set' as const,
    title: 'Royal Elegant Gold Plated Jewellery Set with Matching Earrings',
    category: 'Necklace Sets',
    price: 749,
    originalPrice: 2499,
    discountPercent: 70,
    image: '/aa1.webp',
    tag: '22K Gold Plated',
    sourceUrl: '/products/royal-elegant-gold-plated-jewellery-set',
  },
  {
    id: 'var-trendy-choker',
    productId: 'choker' as const,
    title: 'Rhodium Plated White Austrian Diamond Bridal Choker Set',
    category: 'Bridal Choker Set',
    price: 799,
    originalPrice: 2999,
    discountPercent: 73,
    image: '/neklace_producshot.webp',
    sourceUrl: '/products/rhodium-plated-austrian-diamond-choker-set',
  },
  {
    id: 'var-trendy-jhumka',
    productId: 'jhumka' as const,
    title: 'Handcrafted 18K Gold Plated Jhumka Earrings – Set of 6 Pairs',
    category: 'Jhumka Combo',
    price: 499,
    originalPrice: 1999,
    discountPercent: 75,
    image: '/Cinematic.webp',
    sourceUrl: '/products/gold-plated-fancy-jhumka-earrings-set-of-6',
  },
];

export const TRENDY_ALLOY_SET_PRODUCT_DETAILS = {
  id: 'trendy-alloy-set',
  title: 'Trendy Alloy Gold Plated Kundan & Pearl Jewellery Set with Matching Drop Earrings',
  fullDescription:
    'Trendy Alloy Gold Plated Kundan & Pearl Jewellery Set – Exquisite handcrafted alloy necklace enriched with lustrous Austrian pearls, royal kundan stones, and matching drop earrings. Engineered with a durable skin-safe base, 22K micro gold plating, and an anti-tarnish protective coating. Ideal for weddings, festive pujas, and ethnic celebrations. Complete with free luxury velvet jewelry gift box.',
  shortTitle: 'Trendy Alloy Jewellery Set',
  tagline: '22K Micro Gold Plating • Handcrafted Kundan & Pearl Drops • Free Royal Velvet Gift Box',
  rating: 4.8,
  ratingsCount: 14280,
  reviewsCount: 3640,
  size: 'Adjustable Silk Dori (Free Size fits all neck sizes comfortably)',
  price: 399,
  originalPrice: 1499,
  discountPercent: 73,
  sku: 'QAV-TRENDY-ALLOY-399',
  inStock: true,
  stockLeft: 12,
  recentSales24h: 248,
  currentLiveViewers: 39,
  freeDeliveryThreshold: 0,
  brand: 'QAVELLE',
  countryOfOrigin: 'India',
};

export const TRENDY_ALLOY_SET_PRODUCT_HIGHLIGHTS = [
  { label: 'Base Metal', value: 'High-Grade Skin-Safe Brass & Copper Alloy' },
  { label: 'Plating', value: '22K Micro Gold Plated with Anti-Tarnish Seal' },
  { label: 'Stone Type', value: 'Lustrous Austrian Pearls & Hand-Cut Kundan Stones' },
  { label: 'Sizing', value: 'Free Size (Adjustable Silk Dori Fits All)' },
  { label: 'Occasion', value: 'Weddings, Reception, Festive Puja, Sangeet & Traditional Functions' },
  { label: 'Net Quantity (N)', value: '1 Necklace + 1 Pair Matching Drop Earrings' },
];

export const TRENDY_ALLOY_SET_ADDITIONAL_DETAILS = [
  { label: 'Package Contains', value: '1 Gold Plated Alloy Necklace + 1 Pair Matching Drop Earrings + Luxury Velvet Gift Box' },
  { label: 'Closure', value: 'Traditional Hand-Braided Silk Drawstring Cord (Dori) / Secure Clasp' },
  { label: 'Earring Type', value: 'Matching Traditional Drop Earrings with Push-Back Clasps' },
  { label: 'Stone Setting', value: 'Hand-Crafted Bezel & Micro-Prong Pearl Setting' },
  { label: 'Skin Safety', value: '100% Lead-Free & Nickel-Free (Hypoallergenic & Non-Irritating)' },
  { label: 'Country of Origin', value: 'India' },
  { label: 'Care Instructions', value: 'Wipe with soft lint-free cloth after use. Store in provided velvet box away from perfumes and moisture.' },
];

export const TRENDY_ALLOY_SET_PRODUCT_GALLERY: ProductGalleryItem[] = [
  {
    id: 'ta-1',
    src: '/b1.png',
    thumbSrc: '/b1_thumb.webp',
    alt: 'Trendy Alloy Gold Plated Kundan & Pearl Jewellery Set with Matching Earrings - Main View',
    title: 'Complete Trendy Alloy Set',
    tag: 'Hero View',
  },
  {
    id: 'ta-2',
    src: '/b2.png',
    thumbSrc: '/b2_thumb.webp',
    alt: 'Trendy Alloy Gold Plated Jewellery Set - Artisan Motif and Craft Detail',
    title: 'Heritage Craftsmanship',
    tag: 'Craft Detail',
  },
  {
    id: 'ta-3',
    src: '/b3.png',
    thumbSrc: '/b3_thumb.webp',
    alt: 'Trendy Alloy Gold Plated Choker & Drop Earrings - Angle View',
    title: 'Kundan & Pearl Detail',
    tag: 'Close-Up',
  },
  {
    id: 'ta-4',
    src: '/b4.png',
    thumbSrc: '/b4_thumb.webp',
    alt: 'Trendy Alloy Gold Plated Jewellery Set - Presentation View',
    title: 'Complete Ensemble',
    tag: 'Set View',
  },
  {
    id: 'ta-5',
    src: '/b5.png',
    thumbSrc: '/b5_thumb.webp',
    alt: 'Trendy Alloy Gold Plated Kundan & Pearl Drops - Macro Artistry',
    title: 'Macro Artistry',
    tag: 'Macro',
  },
];

export const TRENDY_ALLOY_SET_BUNDLE_OPTIONS: BundleOption[] = [
  {
    id: 'trendy-alloy-single',
    title: '1x Trendy Alloy Gold Plated Set',
    subtitle: '1 Necklace + 1 Pair Matching Drop Earrings + Free Velvet Box + Free Express Shipping',
    unitCount: 1,
    price: 399,
    originalPrice: 1499,
    discountPercent: 73,
    popular: true,
    saveAmount: 1100,
  },
  {
    id: 'trendy-alloy-double',
    title: '2x Sets (Sister / Bestie Combo)',
    subtitle: '2 Complete Jewellery Sets + 2 Velvet Gift Boxes + Extra ₹50 OFF',
    unitCount: 2,
    price: 749,
    originalPrice: 2998,
    discountPercent: 75,
    popular: false,
    saveAmount: 2249,
  },
  {
    id: 'trendy-alloy-family',
    title: '3x Sets (Grand Festive Family Combo)',
    subtitle: '3 Complete Sets + Free Express Courier Delivery + Royal Gift Packaging',
    unitCount: 3,
    price: 1099,
    originalPrice: 4497,
    discountPercent: 76,
    popular: false,
    saveAmount: 3398,
  },
];

export const TRENDY_ALLOY_SET_REVIEWS_LIST: ReviewItem[] = [
  {
    id: 'ta-rev-1',
    author: 'Pooja Verma',
    city: 'Ahmedabad',
    state: 'Gujarat',
    rating: 5,
    date: '1 day ago',
    title: 'Unbelievable beauty and shine for ₹399! Loved it',
    comment:
      'I was so pleasantly surprised when opening the package. The gold plating looks so rich and authentic, like real 22K gold. The pearl drops and kundan stones sparkle gorgeously. The adjustable dori makes it very easy to fit. Highly recommended!',
    verified: true,
    helpfulCount: 89,
    badge: 'Verified Buyer',
    userImage: '/girl_reviewer_1.jpg',
  },
  {
    id: 'ta-rev-2',
    author: 'Sunita Rawat',
    city: 'Dehradun',
    state: 'Uttarakhand',
    rating: 5,
    date: '3 days ago',
    title: 'Earrings are super comfortable and lightweight',
    comment:
      'Often heavy necklace sets hurt the ears, but these matching earrings are wonderfully light while looking grand. The finish has zero roughness, totally skin friendly. Beautiful velvet box packaging too.',
    verified: true,
    helpfulCount: 64,
    badge: 'Verified Buyer',
    userImage: '/girl_reviewer_2.jpg',
  },
  {
    id: 'ta-rev-3',
    author: 'Ritu Nair',
    city: 'Kochi',
    state: 'Kerala',
    rating: 5,
    date: '4 days ago',
    title: 'Wore it for family wedding — got so many compliments!',
    comment:
      'Draped it with my Kanjeevaram silk saree. Everyone thought I bought it from a high-end bridal boutique. QAVELLE’s quality and packaging is top-notch. Express delivery reached in 2 days.',
    verified: true,
    helpfulCount: 47,
    badge: 'Verified Buyer',
    userImage: '/girl_reviewer_3.jpg',
  },
  {
    id: 'ta-rev-4',
    author: 'Divya Agarwal',
    city: 'Indore',
    state: 'Madhya Pradesh',
    rating: 5,
    date: '6 days ago',
    title: 'Value for money is unmatched',
    comment:
      'At this price point, the craftsmanship is remarkable. The alloy is sturdy, the gold tone is elegant without being too bright or yellow, and the finish is clean. Will order another one as a gift for my sister.',
    verified: true,
    helpfulCount: 38,
    badge: 'Verified Buyer',
    userImage: '/girl_reviewer_4.jpg',
  },
];

export const TRENDY_ALLOY_SET_CUSTOMER_MEDIA = [
  {
    id: 'm-ta-1',
    type: 'image',
    image: '/b1.png',
    author: 'Pooja Verma',
    caption: 'Trendy Alloy Gold Plated Jewellery Set complete necklace and earrings.',
  },
  {
    id: 'm-ta-2',
    type: 'image',
    image: '/b2.png',
    author: 'Sunita Rawat',
    caption: 'Stunning traditional craft and intricate kundan setting.',
  },
  {
    id: 'm-ta-3',
    type: 'image',
    image: '/b3.png',
    author: 'Ritu Nair',
    caption: 'Close-up of the delicate floral motif and lustrous pearl drops.',
  },
  {
    id: 'm-ta-4',
    type: 'image',
    image: '/b4.png',
    author: 'Divya Agarwal',
    caption: 'Detailed view of the 22K micro gold plating finish and matching earrings.',
  },
];






