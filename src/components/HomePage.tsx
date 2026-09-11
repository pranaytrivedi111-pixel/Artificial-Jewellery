/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Star,
  ShieldCheck,
  Award,
  Crown,
  Truck,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import {
  GENUINE_PRODUCTS,
  HOME_FAQS,
  HOME_REVIEWS,
} from '../data/homeCatalog';
import { BundleOption, ProductId } from '../types';

interface HomePageProps {
  onSelectProduct: (productId: ProductId) => void;
  onAddToCart?: (bundle: BundleOption) => void;
  onBuyNow?: (bundle: BundleOption) => void;
  onOpenTrackOrder?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectProduct,
}) => {
  // Dynamically derived from GENUINE_PRODUCTS so any new product page created automatically appears!
  const heroProducts = useMemo(() => {
    return GENUINE_PRODUCTS;
  }, []);

  const [selectedHeroIndex, setSelectedHeroIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const currentHeroProduct = heroProducts[selectedHeroIndex] || heroProducts[0];

  const thumbnailContainerRef = useRef<HTMLDivElement>(null);
  const thumbnailButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Sliding hero main tab: auto advances every 3.8 seconds when not hovered/paused
  useEffect(() => {
    if (isPaused || heroProducts.length <= 1) return;
    const interval = setInterval(() => {
      setSelectedHeroIndex((prev) => (prev + 1) % heroProducts.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [isPaused, heroProducts.length]);

  // Smoothly scroll the active thumbnail card horizontally inside its container ONLY
  // (Never calls window.scroll or scrollIntoView, so user page scroll position is never affected)
  useEffect(() => {
    const activeBtn = thumbnailButtonRefs.current[selectedHeroIndex];
    const container = thumbnailContainerRef.current;
    if (activeBtn && container) {
      const btnLeft = activeBtn.offsetLeft;
      const btnWidth = activeBtn.offsetWidth;
      const containerWidth = container.clientWidth;
      const targetScrollLeft = btnLeft - containerWidth / 2 + btnWidth / 2;
      container.scrollTo({
        left: Math.max(0, targetScrollLeft),
        behavior: 'smooth',
      });
    }
  }, [selectedHeroIndex]);

  // Manual scroll handler for thumbnail cards collection
  const handleScrollThumbnails = (direction: 'left' | 'right') => {
    if (!thumbnailContainerRef.current) return;
    const scrollAmount = direction === 'left' ? -180 : 180;
    thumbnailContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handlePrevHero = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPaused(true);
    setSelectedHeroIndex((prev) => (prev - 1 + heroProducts.length) % heroProducts.length);
  };

  const handleNextHero = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPaused(true);
    setSelectedHeroIndex((prev) => (prev + 1) % heroProducts.length);
  };

  // FAQ Accordion State (supports 2-column desktop view with independent item toggling)
  const [openFaqIndices, setOpenFaqIndices] = useState<number[]>([0]);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  // Why Qavelle (Trust Pillars) Mobile Slider State & Ref (Shows 2 cards only, other 2 in slider)
  const trustSliderRef = useRef<HTMLDivElement>(null);
  const [trustSlidePage, setTrustSlidePage] = useState<number>(0);

  const handleTrustScroll = () => {
    if (!trustSliderRef.current) return;
    const el = trustSliderRef.current;
    const scrollLeft = el.scrollLeft;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const page = maxScroll > 0 && scrollLeft > maxScroll / 2 ? 1 : 0;
    setTrustSlidePage(page);
  };

  const scrollTrustToPage = (page: number) => {
    if (!trustSliderRef.current) return;
    const el = trustSliderRef.current;
    const targetX = page === 0 ? 0 : el.scrollWidth - el.clientWidth;
    el.scrollTo({ left: targetX, behavior: 'smooth' });
    setTrustSlidePage(page);
  };

  // Customer Reviews Mobile Slider State & Ref (Shows 2 cards only, other 2 in slider)
  const reviewSliderRef = useRef<HTMLDivElement>(null);
  const [reviewSlidePage, setReviewSlidePage] = useState<number>(0);

  const handleReviewScroll = () => {
    if (!reviewSliderRef.current) return;
    const el = reviewSliderRef.current;
    const scrollLeft = el.scrollLeft;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const page = maxScroll > 0 && scrollLeft > maxScroll / 2 ? 1 : 0;
    setReviewSlidePage(page);
  };

  const scrollReviewToPage = (page: number) => {
    if (!reviewSliderRef.current) return;
    const el = reviewSliderRef.current;
    const targetX = page === 0 ? 0 : el.scrollWidth - el.clientWidth;
    el.scrollTo({ left: targetX, behavior: 'smooth' });
    setReviewSlidePage(page);
  };

  return (
    <div className="w-full bg-[#FAF9F5] text-gray-900 selection:bg-amber-100">
      {/* =========================================================================
          1. HERO SECTION: VICE-VERSA IMAGE COLLECTION & MAIN PRODUCT CARD
          - Top: Horizontally scrollable multiple cards to render more products
          - Bottom: Main sliding product card with prices, completely clean image (zero overlay)
          - Sliding hero main tab with auto-slide & pause on hover
          - Automatic inclusion of any newly created products
          ========================================================================= */}
      <section
        id="hero-vice-versa-showcase"
        className="pt-2 sm:pt-4 pb-4 sm:pb-8 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8"
      >
        {/* Clean Header */}
        <div className="mb-2.5 sm:mb-3.5 text-center">
          <h1
            className="text-lg sm:text-2xl lg:text-[26px] font-normal text-gray-950 tracking-tight leading-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Royal Handcrafted Jewellery
          </h1>
        </div>

        {/* 
            SCROLLABLE CARDS ABOVE (Image Collection)
            - Renders ALL products dynamically (auto-includes any new product)
            - Multiple cards visible at once
            - Horizontally scrollable with smooth scroll & optional chevron buttons
            - Hover or click immediately renders the selected product below
            - Zero text overlays on thumbnail images
        */}
        <div
          className="relative w-full max-w-[480px] sm:max-w-[580px] lg:max-w-3xl xl:max-w-4xl mx-auto mb-2.5 sm:mb-4 px-1"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Scroll Left Button */}
          <button
            type="button"
            onClick={() => handleScrollThumbnails('left')}
            className="hidden sm:flex absolute -left-3.5 lg:-left-5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-white/95 border border-stone-300 shadow-xs hover:bg-amber-50 hover:border-[#B3874B] text-gray-700 hover:text-[#B3874B] items-center justify-center transition-all cursor-pointer"
            aria-label="Scroll products left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Horizontal Scrollable Thumbnails Container */}
          <div
            ref={thumbnailContainerRef}
            className="flex items-center gap-2 sm:gap-2.5 px-1 py-1 w-full overflow-x-auto scroll-smooth no-scrollbar"
          >
            {heroProducts.map((prod, idx) => {
              const isSelected = selectedHeroIndex === idx;
              return (
                <button
                  key={prod.cardKey || `${prod.id}-${idx}`}
                  ref={(el) => (thumbnailButtonRefs.current[idx] = el)}
                  type="button"
                  onClick={() => {
                    setSelectedHeroIndex(idx);
                    setIsPaused(true);
                  }}
                  onMouseEnter={() => {
                    setSelectedHeroIndex(idx);
                    setIsPaused(true);
                  }}
                  className={`relative w-14 h-14 min-[375px]:w-15 min-[375px]:h-15 sm:w-16 sm:h-16 lg:w-[72px] lg:h-[72px] rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer shrink-0 flex items-center justify-center p-1 transition-all duration-200 ${
                    isSelected
                      ? 'ring-2 ring-[#B3874B] bg-white shadow-xs scale-105 z-10'
                      : 'bg-white/80 border border-stone-200/90 opacity-80 hover:opacity-100 hover:ring-1 hover:ring-stone-300 hover:scale-102'
                  }`}
                  aria-label={`Select ${prod.shortTitle || prod.title}`}
                  title={prod.shortTitle || prod.title}
                >
                  {/* Clean Thumbnail - Absolutely Zero Text Overlays on Image */}
                  <img
                    src={prod.image}
                    alt={prod.title}
                    referrerPolicy="no-referrer"
                    loading="eager"
                    className="w-full h-full object-contain rounded-xl sm:rounded-2xl"
                  />
                  {isSelected && (
                    <span className="absolute bottom-1 inset-x-2.5 sm:inset-x-3 h-0.5 bg-[#B3874B] rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Scroll Right Button */}
          <button
            type="button"
            onClick={() => handleScrollThumbnails('right')}
            className="hidden sm:flex absolute -right-3.5 lg:-right-5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-white/95 border border-stone-300 shadow-xs hover:bg-amber-50 hover:border-[#B3874B] text-gray-700 hover:text-[#B3874B] items-center justify-center transition-all cursor-pointer"
            aria-label="Scroll products right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 
            MAIN PRODUCT CARD (BELOW THE SCROLLABLE CARDS)
            - Auto-sliding product showcase
            - Zero text overlays on images (pure clean jewellery photo)
            - Displays category, badge, rating, price, discount cleanly in info section
            - Clickable to navigate to that product page
        */}
        <div
          onClick={() => onSelectProduct(currentHeroProduct.id)}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="group relative w-full max-w-[440px] sm:max-w-xl lg:max-w-3xl xl:max-w-4xl mx-auto bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-sm hover:shadow-md hover:border-amber-300 transition-all duration-300 cursor-pointer overflow-hidden select-none"
          title={`Click to view ${currentHeroProduct.title}`}
        >
          {/* Subtle Slide Navigation Buttons on Hero Card */}
          <button
            type="button"
            onClick={handlePrevHero}
            className="absolute left-2 sm:left-3 top-1/3 sm:top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 border border-stone-200 shadow-xs text-gray-700 hover:text-[#B3874B] hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            aria-label="Previous product slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNextHero}
            className="absolute right-2 sm:right-3 top-1/3 sm:top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 border border-stone-200 shadow-xs text-gray-700 hover:text-[#B3874B] hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            aria-label="Next product slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* MOBILE VIEW (Compact Single Fold Layout with Zero Text Overlay on Image) */}
          <div className="block lg:hidden p-3 sm:p-4">
            {/* Pristine Clean Image Container (Strictly ZERO Text/Badge/Rating Overlay on Image) */}
            <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full rounded-xl overflow-hidden bg-[#FAF8F5] p-2.5 sm:p-3.5 flex items-center justify-center">
              <img
                key={currentHeroProduct.id}
                src={currentHeroProduct.image}
                alt={currentHeroProduct.title}
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                loading="eager"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Product Details cleanly placed underneath the photo */}
            <div className="mt-2.5 px-0.5">
              <div className="flex items-center justify-between gap-1.5 flex-wrap mb-1">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#B3874B]">
                  {currentHeroProduct.category}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="bg-stone-100 text-stone-800 text-[9.5px] font-bold px-2 py-0.5 rounded-full border border-stone-200">
                    {currentHeroProduct.badge}
                  </span>
                  <div className="flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded-md border border-emerald-100">
                    <Star className="w-2.5 h-2.5 fill-emerald-600 text-emerald-600" />
                    <span>{currentHeroProduct.rating}</span>
                  </div>
                </div>
              </div>

              <h2 className="text-xs sm:text-sm font-semibold text-gray-950 group-hover:text-[#B3874B] transition-colors leading-snug line-clamp-1 mt-0.5">
                {currentHeroProduct.title}
              </h2>

              <div className="mt-1 flex items-baseline gap-2 flex-wrap">
                <span className="text-base sm:text-lg font-black text-gray-950">
                  ₹{currentHeroProduct.price}
                </span>
                <span className="text-xs text-gray-400 line-through font-normal">
                  ₹{currentHeroProduct.originalPrice}
                </span>
                <span className="text-xs font-bold text-[#B3874B]">
                  ({currentHeroProduct.discountPercent}% OFF)
                </span>
              </div>

              {/* Action Bar */}
              <div className="mt-2 w-full bg-[#111111] group-hover:bg-[#B3874B] text-white py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs">
                <span>View Product Details & Offers</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>

          {/* DESKTOP VIEW (Horizontal Size-Fit Layout with Zero Text Overlay on Image) */}
          <div className="hidden lg:grid lg:grid-cols-12 items-center p-5 xl:p-6 gap-6">
            {/* Left Col: Pristine Clean Main Product Photo (Strictly ZERO Text/Badge/Rating Overlay) */}
            <div className="lg:col-span-5 relative h-[280px] xl:h-[320px] rounded-2xl overflow-hidden bg-[#FAF8F5] p-4 flex items-center justify-center">
              <img
                key={currentHeroProduct.id}
                src={currentHeroProduct.image}
                alt={currentHeroProduct.title}
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                loading="eager"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Right Col: Product Information, Badges, Price & CTA */}
            <div className="lg:col-span-7 flex flex-col justify-between h-full py-1">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 flex-wrap">
                  <span className="text-[#B3874B] font-bold uppercase tracking-wider">
                    {currentHeroProduct.category}
                  </span>
                  <span className="text-stone-300">•</span>
                  <span className="bg-stone-100 text-stone-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-stone-200">
                    {currentHeroProduct.badge}
                  </span>
                  <span className="text-stone-300">•</span>
                  <div className="flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md font-bold text-xs border border-emerald-100">
                    <span>{currentHeroProduct.rating}</span>
                    <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                  </div>
                  <span className="text-gray-500 font-medium">
                    ({currentHeroProduct.reviewsCount.toLocaleString()} Royal Reviews)
                  </span>
                </div>

                <h2
                  className="text-lg xl:text-xl font-bold text-gray-950 group-hover:text-[#B3874B] transition-colors leading-snug mt-2"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {currentHeroProduct.title}
                </h2>

                <p className="text-xs text-gray-600 mt-1.5 leading-relaxed line-clamp-2">
                  {currentHeroProduct.subtitle}
                </p>

                {/* Highlights */}
                <div className="mt-3 grid grid-cols-2 gap-1.5 text-[11px] text-gray-700">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B3874B] shrink-0" />
                    <span className="truncate">24K Micro Gold Polish</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B3874B] shrink-0" />
                    <span className="truncate">Free Velvet Keepsake Box</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B3874B] shrink-0" />
                    <span className="truncate">Hypoallergenic & Skin Safe</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B3874B] shrink-0" />
                    <span className="truncate">Cash on Delivery Available</span>
                  </div>
                </div>
              </div>

              {/* Price Row & CTA */}
              <div className="mt-4 pt-3 border-t border-stone-200/80 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl xl:text-3xl font-black text-gray-950">
                      ₹{currentHeroProduct.price}
                    </span>
                    <span className="text-sm text-gray-400 line-through font-normal">
                      MRP ₹{currentHeroProduct.originalPrice}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#B3874B]">
                    {currentHeroProduct.discountPercent}% OFF • Special Royal Offer
                  </span>
                </div>

                <div className="bg-[#111111] group-hover:bg-[#B3874B] text-white px-5 py-2.5 rounded-xl text-xs xl:text-sm font-bold flex items-center gap-2 transition-colors shadow-xs shrink-0">
                  <span>View Product Details</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. ALL HANDCRAFTED MASTERPIECES (CATALOG GRID)
          - Desktop view: 8 cards in 2 rows of 4
          - Mobile view: 4 cards in 2 rows of 2
          - Zero overlay on images (no badges, no buttons obscuring jewelry photo)
          - Underneath: Title, Category, and Pricing
          ========================================================================= */}
      <section
        id="all-products-section"
        className="pt-2 sm:pt-4 pb-8 sm:pb-12 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8"
      >
        <div className="mb-3 sm:mb-4 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-1">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#B3874B]">
              Royal Selection
            </span>
            <h2
              className="text-base sm:text-xl lg:text-2xl font-normal text-gray-950 tracking-tight leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Explore All Authentic Masterpieces
            </h2>
          </div>
          <p className="text-xs text-gray-500 hidden sm:block">
            Click any set to view detailed 360° gallery & order with COD
          </p>
        </div>

        {/* 
            8-CARD GRID
            - Desktop: 4 cards in 1 row, 8 cards fit in one fold
            - Mobile: 2 cards in each row, 4 cards fit in one fold
            - No Details button
            - No Buy Now button
            - No overlay on images
        */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 lg:gap-4.5">
          {GENUINE_PRODUCTS.map((product) => {
            return (
              <div
                key={product.cardKey || product.id}
                onClick={() => onSelectProduct(product.id)}
                className="group w-full text-center select-none bg-white rounded-2xl p-2 sm:p-2.5 border border-stone-200/80 hover:border-amber-300 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between"
                title={`Click to view ${product.title}`}
              >
                {/* 
                    PRISTINE CLEAN IMAGE CONTAINER
                    Strictly Zero Overlay on images: No rating pill, No % OFF pill, No badges
                */}
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#F8F6F2] p-2 sm:p-3 flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    loading="eager"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Clean Product Info Below Image */}
                <div className="mt-2 px-1 flex flex-col items-center">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#B3874B] line-clamp-1">
                    {product.category}
                  </span>
                  <h3 className="text-xs sm:text-[13px] font-semibold text-gray-900 group-hover:text-[#B3874B] transition-colors leading-snug line-clamp-1 mt-0.5">
                    {product.title}
                  </h3>
                  <div className="mt-1 flex items-baseline justify-center gap-1.5 flex-wrap">
                    <span className="text-xs sm:text-sm font-extrabold text-gray-950">
                      ₹{product.price}
                    </span>
                    <span className="text-[10px] sm:text-xs text-gray-400 line-through font-normal">
                      ₹{product.originalPrice}
                    </span>
                    <span className="text-[10px] font-bold text-[#B3874B]">
                      ({product.discountPercent}% OFF)
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          5. "WHY QAVELLE?" THE ROYAL TRUST PILLARS
          - Mobile: Show 2 cards only, other 2 in slider with smooth snap scrolling & dots
          - Desktop: 4 cards in responsive grid
          ========================================================================= */}
      <section className="bg-white border-y border-gray-200/80 py-8 sm:py-14">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#B3874B] bg-amber-50 px-3.5 py-1 rounded-full border border-amber-200/60">
              The Royal Standard
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-gray-950 mt-2 font-serif">
              Why Indian Queens Choose QAVELLE
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto mt-1">
              Direct from master artisans to your doorstep — pure elegance with zero compromise.
            </p>
          </div>

          {/* 
              Mobile Slider (2 cards visible, other 2 in slider) & Desktop Grid 
          */}
          <div
            ref={trustSliderRef}
            onScroll={handleTrustScroll}
            className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6 overflow-x-auto sm:overflow-visible snap-x snap-mandatory scroll-smooth no-scrollbar px-0.5 py-1"
          >
            <div className="w-[calc(50%-5px)] shrink-0 snap-start sm:w-auto bg-[#FAF9F5] p-3.5 sm:p-5 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2.5 sm:mb-3">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h3 className="text-xs sm:text-sm font-black text-gray-950 mb-1 leading-snug">
                  100% Skin Safe
                </h3>
                <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed">
                  Lead, nickel & cadmium free. High-grade hypoallergenic brass alloy safe for sensitive skin.
                </p>
              </div>
            </div>

            <div className="w-[calc(50%-5px)] shrink-0 snap-start sm:w-auto bg-[#FAF9F5] p-3.5 sm:p-5 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-50 text-[#B3874B] flex items-center justify-center mb-2.5 sm:mb-3">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h3 className="text-xs sm:text-sm font-black text-gray-950 mb-1 leading-snug">
                  Anti-Tarnish Hallmark
                </h3>
                <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed">
                  18K/24K electro-microplating with long-lasting protective seal against oxidation.
                </p>
              </div>
            </div>

            <div className="w-[calc(50%-5px)] shrink-0 snap-start sm:w-auto bg-[#FAF9F5] p-3.5 sm:p-5 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-2.5 sm:mb-3">
                  <Crown className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h3 className="text-xs sm:text-sm font-black text-gray-950 mb-1 leading-snug">
                  Master Craftsmanship
                </h3>
                <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed">
                  Handcrafted Austrian cut crystals, royal Kundan pearls, and traditional temple motifs.
                </p>
              </div>
            </div>

            <div className="w-[calc(50%-5px)] shrink-0 snap-start sm:w-auto bg-[#FAF9F5] p-3.5 sm:p-5 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-2.5 sm:mb-3">
                  <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h3 className="text-xs sm:text-sm font-black text-gray-950 mb-1 leading-snug">
                  Free Express Air & COD
                </h3>
                <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed">
                  Fast 3–5 business day delivery across 26,000+ pin codes. 100% Cash On Delivery supported.
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Slider Navigation Controls (Slide 1 & Slide 2) */}
          <div className="flex sm:hidden items-center justify-center gap-3 mt-3.5">
            <button
              type="button"
              onClick={() => scrollTrustToPage(0)}
              className={`p-1.5 rounded-full border border-stone-300 text-gray-600 ${
                trustSlidePage === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-amber-50 hover:text-[#B3874B]'
              }`}
              aria-label="Previous 2 trust cards"
              disabled={trustSlidePage === 0}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scrollTrustToPage(0)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  trustSlidePage === 0 ? 'w-6 bg-[#B3874B]' : 'w-2 bg-stone-300'
                }`}
                aria-label="View first 2 cards"
              />
              <button
                type="button"
                onClick={() => scrollTrustToPage(1)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  trustSlidePage === 1 ? 'w-6 bg-[#B3874B]' : 'w-2 bg-stone-300'
                }`}
                aria-label="View remaining 2 cards"
              />
            </div>

            <button
              type="button"
              onClick={() => scrollTrustToPage(1)}
              className={`p-1.5 rounded-full border border-stone-300 text-gray-600 ${
                trustSlidePage === 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-amber-50 hover:text-[#B3874B]'
              }`}
              aria-label="Next 2 trust cards"
              disabled={trustSlidePage === 1}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. REAL VERIFIED CUSTOMER REVIEWS (Social Proof)
          - Mobile: Show 2 cards only, other 2 in slider with smooth snap scrolling & dots
          - Desktop: 4 cards in responsive grid
          ========================================================================= */}
      <section className="py-8 sm:py-14 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#B3874B]">
            Verified Testimonials
          </span>
          <h2 className="text-xl sm:text-3xl font-black text-gray-950 font-serif mt-1">
            Loved By Women Across India
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto mt-1">
            Real customer experiences from verified purchases on QAVELLE Store
          </p>
        </div>

        {/* 
            Mobile Slider (2 review cards visible, other 2 in slider) & Desktop Grid 
        */}
        <div
          ref={reviewSliderRef}
          onScroll={handleReviewScroll}
          className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6 overflow-x-auto sm:overflow-visible snap-x snap-mandatory scroll-smooth no-scrollbar px-0.5 py-1"
        >
          {HOME_REVIEWS.map((review) => (
            <div
              key={review.id}
              className="w-[calc(50%-5px)] shrink-0 snap-start sm:w-auto bg-white p-3.5 sm:p-5 rounded-2xl border border-gray-200/90 shadow-2xs flex flex-col justify-between"
            >
              <div>
                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Review Headline */}
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 mb-1 leading-snug line-clamp-2">
                  "{review.title}"
                </h4>

                {/* Review Comment */}
                <p className="text-[10.5px] sm:text-xs text-gray-600 leading-relaxed line-clamp-4">
                  {review.comment}
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-3 mt-3 border-t border-gray-100 flex flex-col min-[420px]:flex-row min-[420px]:items-center justify-between gap-1.5">
                <div>
                  <p className="text-[11px] sm:text-xs font-bold text-gray-900 line-clamp-1">{review.author}</p>
                  <p className="text-[9.5px] sm:text-[11px] text-gray-500 line-clamp-1">
                    {review.city}, {review.state}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0 w-fit">
                  <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  Verified Buyer
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Slider Navigation Controls for Reviews (Slide 1 & Slide 2) */}
        <div className="flex sm:hidden items-center justify-center gap-3 mt-3.5">
          <button
            type="button"
            onClick={() => scrollReviewToPage(0)}
            className={`p-1.5 rounded-full border border-stone-300 text-gray-600 ${
              reviewSlidePage === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-amber-50 hover:text-[#B3874B]'
            }`}
            aria-label="Previous 2 reviews"
            disabled={reviewSlidePage === 0}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => scrollReviewToPage(0)}
              className={`h-2 rounded-full transition-all duration-300 ${
                reviewSlidePage === 0 ? 'w-6 bg-[#B3874B]' : 'w-2 bg-stone-300'
              }`}
              aria-label="View first 2 reviews"
            />
            <button
              type="button"
              onClick={() => scrollReviewToPage(1)}
              className={`h-2 rounded-full transition-all duration-300 ${
                reviewSlidePage === 1 ? 'w-6 bg-[#B3874B]' : 'w-2 bg-stone-300'
              }`}
              aria-label="View remaining 2 reviews"
            />
          </div>

          <button
            type="button"
            onClick={() => scrollReviewToPage(1)}
            className={`p-1.5 rounded-full border border-stone-300 text-gray-600 ${
              reviewSlidePage === 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-amber-50 hover:text-[#B3874B]'
            }`}
            aria-label="Next 2 reviews"
            disabled={reviewSlidePage === 1}
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* =========================================================================
          7. PRECISE FAQ ACCORDION
          - Desktop view: 2 columns (md:grid-cols-2)
          - Mobile view: 1 column
          ========================================================================= */}
      <section className="bg-white border-t border-gray-200/80 py-10 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B3874B]">
              Frequently Asked Questions
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-950 font-serif mt-1">
              Everything You Need to Know
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto mt-1.5">
              Got questions? We have answers. Feel free to contact our WhatsApp support team anytime.
            </p>
          </div>

          {/* 2 Columns in Desktop View, 1 Column in Mobile View */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4.5 items-start">
            {HOME_FAQS.map((faq, idx) => {
              const isOpen = openFaqIndices.includes(idx);
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'border-amber-200/90 bg-white shadow-2xs'
                      : 'border-gray-200/80 bg-[#FAF9F5] hover:border-amber-200'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-4 py-3.5 sm:px-5 sm:py-4 text-left flex items-center justify-between gap-3 cursor-pointer hover:bg-amber-50/40 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180 text-[#B3874B]' : ''
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
