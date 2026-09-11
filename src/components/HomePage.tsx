/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  Sparkles,
  Star,
  ShieldCheck,
  Award,
  Crown,
  Truck,
  ArrowRight,
  Heart,
  Search,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import {
  GENUINE_PRODUCTS,
  HOME_CATEGORIES,
  HOME_PROMO_SLIDES,
  HOME_FAQS,
  HOME_REVIEWS,
  GenuineProduct,
} from '../data/homeCatalog';
import {
  BUNDLE_OPTIONS,
  CHOKER_BUNDLE_OPTIONS,
  ELEGANT_EVERYDAY_BUNDLE_OPTIONS,
  RADHIKA_GREEN_AD_BUNDLE_OPTIONS,
  SHIMMERING_BUNDLE_OPTIONS,
  ALLURE_GOLD_SET_BUNDLE_OPTIONS,
  TRENDY_ALLOY_SET_BUNDLE_OPTIONS,
} from '../data/productData';
import { BundleOption, ProductId } from '../types';

interface HomePageProps {
  onSelectProduct: (productId: ProductId) => void;
  onAddToCart: (bundle: BundleOption) => void;
  onBuyNow: (bundle: BundleOption) => void;
  onOpenTrackOrder?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectProduct,
  onAddToCart,
  onBuyNow,
}) => {
  // Active Hero Slide Index
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  // Active Category Filter
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  // Search Query for Collection
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Wishlisted product IDs
  const [wishlistedIds, setWishlistedIds] = useState<string[]>([]);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Auto-play luxury hero slider with hover pause
  const [isSliderPaused, setIsSliderPaused] = useState(false);

  useEffect(() => {
    if (isSliderPaused) return;
    const timer = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % HOME_PROMO_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isSliderPaused]);

  const handlePrevHero = () => {
    setActiveHeroIndex((prev) => (prev - 1 + HOME_PROMO_SLIDES.length) % HOME_PROMO_SLIDES.length);
  };

  const handleNextHero = () => {
    setActiveHeroIndex((prev) => (prev + 1) % HOME_PROMO_SLIDES.length);
  };

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlistedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getBundleForProduct = (productId: ProductId): BundleOption => {
    switch (productId) {
      case 'trendy-alloy-set':
        return TRENDY_ALLOY_SET_BUNDLE_OPTIONS[0];
      case 'allure-gold-set':
        return ALLURE_GOLD_SET_BUNDLE_OPTIONS[0];
      case 'radhika-green-ad':
        return RADHIKA_GREEN_AD_BUNDLE_OPTIONS[0];
      case 'elegant-everyday-5':
        return ELEGANT_EVERYDAY_BUNDLE_OPTIONS[0];
      case 'choker':
        return CHOKER_BUNDLE_OPTIONS[0];
      case 'necklace-combo-5':
        return SHIMMERING_BUNDLE_OPTIONS[0];
      case 'jhumka':
      default:
        return BUNDLE_OPTIONS[0];
    }
  };

  const filteredProducts = useMemo(() => {
    return GENUINE_PRODUCTS.filter((prod) => {
      const matchesSearch =
        searchQuery === '' ||
        prod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.category.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeCategoryFilter === 'all') return true;
      if (activeCategoryFilter === 'trendy-alloy') return prod.id === 'trendy-alloy-set';
      if (activeCategoryFilter === 'allure-set') return prod.id === 'allure-gold-set';
      if (activeCategoryFilter === 'combo-5') return prod.category === 'Combo Deals';
      if (activeCategoryFilter === 'choker-royal') return prod.id === 'choker';
      if (activeCategoryFilter === 'ambani-set') return prod.id === 'radhika-green-ad';
      if (activeCategoryFilter === 'jhumka-set') return prod.id === 'jhumka';
      if (activeCategoryFilter === 'shimmering-pack') return prod.id === 'necklace-combo-5';
      return true;
    });
  }, [searchQuery, activeCategoryFilter]);

  const activeSlide = HOME_PROMO_SLIDES[activeHeroIndex] || HOME_PROMO_SLIDES[0];
  const activeSlideProduct = GENUINE_PRODUCTS.find((p) => p.id === activeSlide.productId) || GENUINE_PRODUCTS[0];

  return (
    <div className="w-full bg-[#FAF9F5] text-gray-900 selection:bg-amber-100">
      {/* =========================================================================
          LUXURY SMOOTH PRODUCT HERO SLIDER
          Featuring all products with elegant slide controls, pristine typography & zero text overlay
          ========================================================================= */}
      <section
        id="hero-slider-section"
        onMouseEnter={() => setIsSliderPaused(true)}
        onMouseLeave={() => setIsSliderPaused(false)}
        className="relative bg-white border-b border-gray-200/80 pt-6 sm:pt-9 md:pt-11 pb-8 sm:pb-12 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* LEFT COLUMN: Clean Typography, Offer details & CTAs */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-4 sm:space-y-5 transition-all duration-500">
              {/* Royal Collection Tag & Slide Counter */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#B3874B]">
                  <Sparkles className="w-4 h-4 text-[#B3874B]" />
                  <span>{activeSlide.badge || 'Qavelle Royal Jewellery • Direct From Artisans'}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 bg-stone-100 px-2.5 py-0.5 rounded-full">
                  <span>Product {activeHeroIndex + 1} of {HOME_PROMO_SLIDES.length}</span>
                </div>
              </div>

              {/* Main Headline */}
              <h1
                key={`title-${activeSlide.id}`}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black text-gray-950 font-serif leading-[1.18] tracking-tight transition-opacity duration-300"
              >
                {activeSlide.title}
              </h1>

              {/* Subtitle / Craft Story */}
              <p
                key={`sub-${activeSlide.id}`}
                className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-xl transition-opacity duration-300"
              >
                {activeSlide.subtitle}
              </p>

              {/* Verified Star Rating */}
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <div className="flex items-center gap-1 bg-[#1E8E3E] text-white text-xs font-black px-2 py-0.5 rounded-md shadow-2xs">
                  <span>{activeSlideProduct.rating}</span>
                  <Star className="w-3 h-3 fill-white text-white" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-900">
                  {activeSlideProduct.reviewsCount.toLocaleString('en-IN')} Verified Customer Reviews
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Certified Authentic
                </span>
              </div>

              {/* Pricing & Value Details (Cleanly situated outside the image) */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-[#FAF9F5] border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
                    {activeSlide.price}
                  </span>
                  <span className="text-sm text-gray-400 font-normal">
                    MRP <span className="line-through">{activeSlide.originalPrice}</span>
                  </span>
                  <span className="bg-[#B3874B] text-white text-[11px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wide">
                    {activeSlideProduct.discountPercent}% OFF
                  </span>
                </div>
                <span className="text-xs font-bold text-gray-700">
                  Includes Free Velvet Keepsake Box
                </span>
              </div>

              {/* Craftsmanship Checklist */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs text-gray-700">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#B3874B] shrink-0" />
                  <span>100% Skin Safe & Hypoallergenic</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#B3874B] shrink-0" />
                  <span>Anti-Tarnish Micro-Plating</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#B3874B] shrink-0" />
                  <span>Free Express Air Shipping</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#B3874B] shrink-0" />
                  <span>Cash On Delivery (COD)</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onSelectProduct(activeSlide.productId)}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#111111] hover:bg-black text-white text-sm font-bold px-6 py-3.5 rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer"
                >
                  <span>Explore Product Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onBuyNow(getBundleForProduct(activeSlide.productId))}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#B3874B] hover:bg-[#9E733B] text-white text-sm font-bold px-6 py-3.5 rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Instant Buy Now (COD)</span>
                </button>
              </div>

              {/* Slider Dots Indicator */}
              <div className="flex items-center gap-2 pt-2">
                {HOME_PROMO_SLIDES.map((_, idx) => (
                  <button
                    key={`dot-${idx}`}
                    type="button"
                    onClick={() => setActiveHeroIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === activeHeroIndex
                        ? 'w-7 bg-[#B3874B]'
                        : 'w-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN: Pure, Clean Product Image (Zero Text Overlays) */}
            <div className="lg:col-span-5 flex flex-col items-center relative">
              <div
                onClick={() => onSelectProduct(activeSlide.productId)}
                className="group relative w-full aspect-square max-w-[460px] mx-auto rounded-2xl bg-[#F8F7F4] border border-stone-200/90 overflow-hidden cursor-pointer shadow-xs hover:shadow-md transition-all duration-300 flex items-center justify-center p-4"
                title={`Click to view ${activeSlide.title}`}
              >
                {/* Clean Genuine Simple Hero Image */}
                <img
                  key={`hero-img-${activeSlide.id}`}
                  src={activeSlide.image}
                  alt={activeSlide.title}
                  className="w-full h-full object-contain transition-all duration-500 group-hover:scale-[1.02]"
                  referrerPolicy="no-referrer"
                  loading="eager"
                />

                {/* Left / Right Slider Navigation Arrows */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevHero();
                  }}
                  aria-label="Previous Slide"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white text-gray-800 shadow-md flex items-center justify-center border border-gray-200/80 transition-all hover:scale-105 active:scale-95 cursor-pointer z-10"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextHero();
                  }}
                  aria-label="Next Slide"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white text-gray-800 shadow-md flex items-center justify-center border border-gray-200/80 transition-all hover:scale-105 active:scale-95 cursor-pointer z-10"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Switcher: Quick Access to All Genuine Products in the Slider */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Featured Royal Collection ({HOME_PROMO_SLIDES.length} Authentic Masterpieces)
              </p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrevHero}
                  aria-label="Previous Slide"
                  className="p-1 rounded-md text-gray-500 hover:text-gray-900 hover:bg-stone-100 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextHero}
                  aria-label="Next Slide"
                  className="p-1 rounded-md text-gray-500 hover:text-gray-900 hover:bg-stone-100 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-2.5">
              {HOME_PROMO_SLIDES.map((slide, idx) => {
                const isCurrent = idx === activeHeroIndex;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setActiveHeroIndex(idx)}
                    className={`flex flex-col sm:flex-row items-center gap-2 p-2 rounded-xl border text-left transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-amber-50/80 border-[#B3874B] ring-1 ring-[#B3874B] shadow-xs'
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-stone-50 overflow-hidden shrink-0 flex items-center justify-center p-0.5 border border-stone-200/50">
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="min-w-0 flex-1 text-center sm:text-left">
                      <h4 className="text-[11px] font-bold text-gray-900 truncate leading-tight">
                        {slide.title}
                      </h4>
                      <p className="text-[10px] font-semibold text-[#B3874B]">
                        {slide.price}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          3. CATEGORIES & QUICK FILTER BAR
          Clean circular avatars without text overlay on photos
          ========================================================================= */}
      <section className="bg-white border-b border-gray-200/80 py-6 sm:py-7">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">
                Explore By Category
              </h3>
              <p className="text-base sm:text-lg font-extrabold text-gray-950 font-serif">
                Handcrafted Royal Sets
              </p>
            </div>
            {activeCategoryFilter !== 'all' && (
              <button
                onClick={() => setActiveCategoryFilter('all')}
                className="text-xs font-bold text-[#B3874B] hover:text-[#9E733B] cursor-pointer"
              >
                Reset Filter
              </button>
            )}
          </div>

          <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-2 no-scrollbar">
            {HOME_CATEGORIES.map((cat) => {
              const isSelected = activeCategoryFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategoryFilter(cat.id);
                    const el = document.getElementById('bestsellers-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex flex-col items-center shrink-0 group cursor-pointer focus:outline-none"
                >
                  <div
                    className={`relative w-15 h-15 sm:w-18 sm:h-18 rounded-full p-0.5 transition-all duration-300 ${
                      isSelected
                        ? 'ring-2 ring-[#B3874B] ring-offset-2 scale-105 shadow-sm'
                        : 'ring-1 ring-gray-200 group-hover:ring-amber-400 group-hover:scale-102'
                    }`}
                  >
                    <img
                      src={cat.image}
                      alt={cat.label}
                      className="w-full h-full object-cover rounded-full"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span
                    className={`text-[11px] sm:text-xs font-bold mt-2 text-center transition-colors whitespace-nowrap ${
                      isSelected ? 'text-[#B3874B] font-extrabold' : 'text-gray-700 group-hover:text-black'
                    }`}
                  >
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. THE CURATED COLLECTION (Best Sellers & Iconic Sets)
          Simple luxury listing style matching "You May Also Like"
          Strictly Clean Image Rendering: Zero Text Overlays on photos
          ========================================================================= */}
      <section id="bestsellers-section" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Serif Section Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#B3874B] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Direct From Artisans • Hallmark Standard</span>
          </div>
          <h2
            className="text-2xl sm:text-3xl lg:text-[36px] font-normal text-gray-950 tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Best Sellers & Iconic Sets
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-lg mx-auto mt-2">
            Certified authentic handcrafted jewelry sets with verified Indian customer ratings
          </p>

          {/* Quick Search & Filter Count */}
          <div className="mt-5 max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bestsellers by name or style..."
              className="w-full pl-9 pr-8 py-2 text-xs rounded-full border border-stone-300 focus:outline-none focus:border-[#B3874B] bg-white shadow-2xs text-center"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Product Cards Grid: Simple, elegant, matching You May Also Like layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => {
            const bundle = getBundleForProduct(product.id);
            const isWishlisted = wishlistedIds.includes(product.id);

            return (
              <div key={product.id} className="w-full flex flex-col items-center">
                <div className="group block w-full text-center select-none bg-white rounded-2xl sm:rounded-3xl p-2.5 sm:p-3.5 border border-stone-200/70 hover:border-amber-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full">
                  <div>
                    {/* Clean Image Frame with Rounded Corners (Zero text overlay) */}
                    <a
                      href={product.slug}
                      onClick={(e) => {
                        e.preventDefault();
                        onSelectProduct(product.id);
                      }}
                      className="relative aspect-square w-full rounded-xl sm:rounded-2xl overflow-hidden bg-[#F8F6F2] shadow-2xs group-hover:shadow-xs transition-all duration-300 p-2 sm:p-3 flex items-center justify-center block cursor-pointer"
                      title={`View ${product.title}`}
                    >
                      {/* Clean Product Photograph */}
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />

                      {/* Subtle Discount Pill */}
                      <span className="absolute top-2.5 right-2.5 bg-[#B3874B] text-white text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                        {product.discountPercent}% OFF
                      </span>

                      {/* Verified Rating Pill */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-0.5 bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                        <span>{product.rating}</span>
                        <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      </div>

                      {/* Discreet Wishlist Button */}
                      <button
                        type="button"
                        onClick={(e) => toggleWishlist(product.id, e)}
                        className={`absolute bottom-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                          isWishlisted
                            ? 'bg-rose-50 text-rose-600 border border-rose-200'
                            : 'bg-white/90 hover:bg-white text-gray-600 hover:text-black border border-gray-200'
                        }`}
                        aria-label="Add to Wishlist"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`}
                        />
                      </button>
                    </a>

                    {/* Clean Product Title and Price Below Frame */}
                    <div className="mt-3 px-1 flex flex-col items-center">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#B3874B] mb-0.5">
                        {product.category}
                      </span>
                      <a
                        href={product.slug}
                        onClick={(e) => {
                          e.preventDefault();
                          onSelectProduct(product.id);
                        }}
                        className="cursor-pointer"
                        title={product.title}
                      >
                        <h3
                          className="text-xs sm:text-[13px] font-semibold text-gray-900 group-hover:text-[#B3874B] transition-colors leading-snug line-clamp-2"
                        >
                          {product.title}
                        </h3>
                      </a>
                      <div className="mt-1.5 flex items-baseline justify-center gap-1.5">
                        <span className="text-sm sm:text-base font-extrabold text-gray-950">
                          ₹{product.price}
                        </span>
                        <span className="text-xs text-gray-400 line-through font-normal">
                          ₹{product.originalPrice}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Clean Simple Action Buttons */}
                  <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectProduct(product.id)}
                      className="flex-1 bg-stone-50 hover:bg-stone-100 text-gray-900 text-[11px] font-bold py-2 rounded-xl transition-colors cursor-pointer border border-stone-200"
                    >
                      Details
                    </button>
                    <button
                      type="button"
                      onClick={() => onBuyNow(bundle)}
                      className="flex-1 bg-[#111111] hover:bg-black text-white text-[11px] font-bold py-2 rounded-xl transition-colors cursor-pointer shadow-2xs"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          5. "WHY QAVELLE?" THE ROYAL TRUST PILLARS
          Mathematical spacing, high typographic contrast
          ========================================================================= */}
      <section className="bg-white border-y border-gray-200/80 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#B3874B] bg-amber-50 px-3.5 py-1 rounded-full border border-amber-200/60">
              The Royal Standard
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-950 mt-2.5 font-serif">
              Why Indian Queens Choose QAVELLE
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto mt-1">
              Direct from master artisans to your doorstep — pure elegance with zero compromise.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-[#FAF9F5] p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-gray-950 mb-1">
                100% Skin Safe
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Lead, nickel & cadmium free. High-grade hypoallergenic brass alloy safe for sensitive skin.
              </p>
            </div>

            <div className="bg-[#FAF9F5] p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#B3874B] flex items-center justify-center mb-3">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-gray-950 mb-1">
                Anti-Tarnish Hallmark
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                18K/24K electro-microplating with long-lasting protective seal against oxidation.
              </p>
            </div>

            <div className="bg-[#FAF9F5] p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-3">
                <Crown className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-gray-950 mb-1">
                Master Craftsmanship
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Handcrafted Austrian cut crystals, royal Kundan pearls, and traditional temple motifs.
              </p>
            </div>

            <div className="bg-[#FAF9F5] p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-gray-950 mb-1">
                Free Express Air & COD
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Fast 3–5 business day delivery across 26,000+ pin codes. 100% Cash On Delivery supported.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. REAL VERIFIED CUSTOMER REVIEWS (Social Proof)
          ========================================================================= */}
      <section className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#B3874B]">
            Verified Testimonials
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-950 font-serif mt-1">
            Loved By Women Across India
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto mt-1">
            Real customer experiences from verified purchases on QAVELLE Store
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {HOME_REVIEWS.slice(0, 3).map((review) => (
            <div
              key={review.id}
              className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs flex flex-col justify-between"
            >
              <div>
                {/* Rating */}
                <div className="flex items-center gap-1 mb-2.5">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Review Headline */}
                <h4 className="text-sm font-bold text-gray-900 mb-1.5 leading-snug">
                  "{review.title}"
                </h4>

                {/* Review Comment */}
                <p className="text-xs text-gray-600 leading-relaxed">
                  {review.comment}
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-900">{review.author}</p>
                  <p className="text-[11px] text-gray-500">
                    {review.city}, {review.state}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified Buyer
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          7. PRECISE FAQ ACCORDION
          ========================================================================= */}
      <section className="bg-white border-t border-gray-200/80 py-10 sm:py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B3874B]">
              Frequently Asked Questions
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-950 font-serif mt-1">
              Everything You Need to Know
            </h2>
          </div>

          <div className="space-y-3">
            {HOME_FAQS.slice(0, 5).map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-gray-200 overflow-hidden transition-all bg-[#FAF9F5]"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full px-4 py-3.5 sm:px-5 sm:py-4 text-left flex items-center justify-between gap-3 cursor-pointer hover:bg-amber-50/50 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-bold text-gray-900">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 text-xs text-gray-600 leading-relaxed border-t border-stone-200/60 bg-white">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. CONFIDENCE REASSURANCE BANNER
          ========================================================================= */}
      <section className="bg-[#111111] text-white py-8 sm:py-10 border-t border-amber-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/10 text-[#B3874B] mb-3">
            <Crown className="w-6 h-6" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-serif text-white mb-2">
            One Purchase. One Promise. Crafted For The Queen In You.
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 max-w-lg mx-auto mb-5 leading-relaxed">
            Every piece arrives in a plush velvet jewelry box with our certificate of hallmark quality.
            Enjoy 100% Cash On Delivery and a 7-day hassle-free replacement guarantee.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                const el = document.getElementById('bestsellers-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-[#B3874B] hover:bg-[#9E733B] text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              Shop All Products
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. FIXED WHATSAPP CHAT BUTTON (HOMEPAGE ONLY)
          Fixed in bottom right with pulse animation and generic prefilled message
          ========================================================================= */}
      <aside
        aria-label="WhatsApp Support"
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40"
      >
        <a
          href={`https://wa.me/917982438137?text=${encodeURIComponent(
            "Hi QAVELLE! I am browsing your online store and would like to know more about your jewelry collection."
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          id="fixed-whatsapp-home-button"
          aria-label="Chat with QAVELLE on WhatsApp"
          title="Chat with us on WhatsApp (+91 7982438137)"
          className="group relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-lg hover:shadow-xl shadow-emerald-950/20 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
        >
          {/* Animated Pulse Aura */}
          <span
            className="absolute -inset-1 rounded-full bg-[#25D366] opacity-75 animate-ping pointer-events-none"
            aria-hidden="true"
          />
          <span
            className="absolute -inset-0.5 rounded-full bg-[#25D366] opacity-40 animate-pulse pointer-events-none"
            aria-hidden="true"
          />

          {/* Authentic WhatsApp SVG Icon */}
          <svg
            viewBox="0 0 24 24"
            className="w-7 h-7 sm:w-8 sm:h-8 fill-current relative z-10 transition-transform duration-300 group-hover:scale-110"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>

          {/* Clean Desktop Hover Tooltip */}
          <span className="hidden sm:group-hover:flex absolute right-full mr-3 top-1/2 -translate-y-1/2 items-center px-3 py-1.5 bg-gray-950/95 text-white text-xs font-medium rounded-lg shadow-xl whitespace-nowrap pointer-events-none transition-all z-20">
            Chat with us on WhatsApp
            <span className="absolute left-full top-1/2 -translate-y-1/2 -ml-1 border-4 border-transparent border-l-gray-950/95" />
          </span>
        </a>
      </aside>
    </div>
  );
};
