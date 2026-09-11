export type ProductId =
  | 'jhumka'
  | 'choker'
  | 'necklace-combo-5'
  | 'radhika-green-ad'
  | 'elegant-everyday-5'
  | 'allure-gold-set'
  | 'trendy-alloy-set';

export interface ProductGalleryItem {
  id: string;
  src: string;
  thumbSrc?: string;
  alt: string;
  title: string;
  tag?: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  city: string;
  state: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  userImage?: string;
  helpfulCount: number;
  badge?: string;
}

export interface BundleOption {
  id: string;
  title: string;
  subtitle: string;
  unitCount: number;
  price: number;
  originalPrice: number;
  discountPercent: number;
  badge?: string;
  popular?: boolean;
  saveAmount?: number;
}

export interface CartItem {
  id: string;
  bundle: BundleOption;
  quantity: number;
  freeEnergization?: boolean;
  freeVelvetPouch?: boolean;
  freeCertificate?: boolean;
  freeVelvetBox?: boolean;
  giftWrap?: boolean;
}

export interface DeliveryEstimate {
  pincode: string;
  city: string;
  state: string;
  days: number;
  estimatedDate: string;
  codAvailable: boolean;
  expressAvailable: boolean;
}

export interface CouponCode {
  code: string;
  description: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minSpend?: number;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ProductDetails {
  id?: string;
  title: string;
  fullDescription: string;
  shortTitle: string;
  tagline: string;
  rating: number;
  ratingsCount: number;
  reviewsCount: number;
  size: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  sku: string;
  inStock: boolean;
  stockLeft: number;
  recentSales24h: number;
  currentLiveViewers: number;
  freeDeliveryThreshold: number;
  brand: string;
  countryOfOrigin: string;
}
