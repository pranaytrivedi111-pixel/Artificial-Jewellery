import React, { useState, useRef, useEffect } from 'react';
import {
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
} from 'lucide-react';
import { REVIEWS_LIST, ASSET_IMAGES } from '../data/productData';
import { ReviewItem } from '../types';

interface ReviewsSectionProps {
  customReviews?: ReviewItem[];
  productTitle?: string;
  ratingScore?: number;
  totalRatingsCount?: string;
  totalReviewsCount?: string;
  customCustomerMedia?: any;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  customReviews,
  productTitle,
  ratingScore = 4.8,
  totalRatingsCount,
  totalReviewsCount = '1,657 verified reviews',
}) => {
  const [reviews, setReviews] = useState<ReviewItem[]>(customReviews || REVIEWS_LIST);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (customReviews && customReviews.length > 0) {
      setReviews(customReviews);
      setActiveSlide(0);
    }
  }, [customReviews]);

  const sliderRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // New Review Form State
  const [author, setAuthor] = useState('');
  const [city, setCity] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !comment) return;

    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      author,
      city: city || 'New Delhi',
      state: 'India',
      rating,
      date: 'Just now',
      title: 'Amazing quality & royal festive shine',
      comment,
      verified: true,
      helpfulCount: 1,
      badge: 'Verified Buyer',
      userImage: '/girl_reviewer_1.jpg',
    };

    setReviews([newRev, ...reviews]);
    setIsWriteModalOpen(false);
    setAuthor('');
    setCity('');
    setRating(5);
    setComment('');
  };

  const scrollToSlide = (index: number) => {
    const total = reviews.length;
    const nextIdx = (index + total) % total;
    setActiveSlide(nextIdx);
    if (sliderRef.current) {
      const card = sliderRef.current.children[nextIdx] as HTMLElement;
      if (card) {
        sliderRef.current.scrollTo({
          left: card.offsetLeft - sliderRef.current.offsetLeft,
          behavior: 'smooth',
        });
      }
    }
  };

  const handleSliderScroll = () => {
    if (sliderRef.current) {
      const scrollLeft = sliderRef.current.scrollLeft;
      const firstCard = sliderRef.current.children[0] as HTMLElement;
      if (firstCard) {
        const cardWidth = firstCard.offsetWidth + 16;
        const newIdx = Math.round(scrollLeft / cardWidth);
        if (newIdx >= 0 && newIdx < reviews.length && newIdx !== activeSlide) {
          setActiveSlide(newIdx);
        }
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        scrollToSlide(activeSlide + 1);
      } else {
        scrollToSlide(activeSlide - 1);
      }
    }
  };

  return (
    <div id="customer-reviews" className="pt-4 sm:pt-5 pb-4 sm:pb-6 w-full">
      <div className="w-full">
        
        {/* Customer Reviews Breakdown Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200/80 p-5 sm:p-7 shadow-xs">
          <div className="max-w-3xl mx-auto md:flex md:items-center md:gap-12 justify-center">
            
            {/* Left Column: Aggregate score & Star distribution */}
            <div className="md:w-5/12 text-center md:text-left md:border-r md:border-gray-100 md:pr-10">
              <h2 className="font-serif text-[24px] sm:text-[28px] font-medium text-[#222222] tracking-tight mb-1 font-['Playfair_Display',Georgia,serif]">
                Customer Reviews
              </h2>

              <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                <div className="flex items-center text-[#F5A623] text-xl">
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                </div>
                <span className="text-[#222222] text-base font-bold">
                  {ratingScore} out of 5
                </span>
              </div>

              <p className="text-xs text-[#666666] mt-1.5 font-normal">
                {productTitle ? `Reviews for ${productTitle} • ` : ''}Based on {totalReviewsCount}
              </p>
            </div>

            {/* Right Column: Rating Breakdown Distribution Bars */}
            <div className="md:w-7/12 mt-5 md:mt-0 space-y-2 px-1">
              <div className="flex items-center gap-2.5 text-xs">
                <div className="flex items-center text-[#F5A623] text-sm tracking-tight w-20 shrink-0">
                  <span>★★★★★</span>
                </div>
                <div className="flex-1 h-3 bg-[#EDEDED] rounded-full overflow-hidden">
                  <div className="h-full bg-[#1C1C1C] rounded-full w-[82%]" />
                </div>
                <span className="w-10 text-right text-[11.5px] text-[#555555] font-normal shrink-0">
                  1,358
                </span>
              </div>

              <div className="flex items-center gap-2.5 text-xs">
                <div className="flex items-center text-[#F5A623] text-sm tracking-tight w-20 shrink-0">
                  <span>★★★★☆</span>
                </div>
                <div className="flex-1 h-3 bg-[#EDEDED] rounded-full overflow-hidden">
                  <div className="h-full bg-[#1C1C1C] rounded-full w-[14%]" />
                </div>
                <span className="w-10 text-right text-[11.5px] text-[#555555] font-normal shrink-0">
                  232
                </span>
              </div>

              <div className="flex items-center gap-2.5 text-xs">
                <div className="flex items-center text-[#F5A623] text-sm tracking-tight w-20 shrink-0">
                  <span>★★★☆☆</span>
                </div>
                <div className="flex-1 h-3 bg-[#EDEDED] rounded-full overflow-hidden">
                  <div className="h-full bg-[#1C1C1C] rounded-full w-[3%]" />
                </div>
                <span className="w-10 text-right text-[11.5px] text-[#555555] font-normal shrink-0">
                  51
                </span>
              </div>

              <div className="flex items-center gap-2.5 text-xs">
                <div className="flex items-center text-[#F5A623] text-sm tracking-tight w-20 shrink-0">
                  <span>★★☆☆☆</span>
                </div>
                <div className="flex-1 h-3 bg-[#EDEDED] rounded-full overflow-hidden">
                  <div className="h-full bg-[#1C1C1C] rounded-full w-[1%]" />
                </div>
                <span className="w-10 text-right text-[11.5px] text-[#555555] font-normal shrink-0">
                  12
                </span>
              </div>

              <div className="flex items-center gap-2.5 text-xs">
                <div className="flex items-center text-[#F5A623] text-sm tracking-tight w-20 shrink-0">
                  <span>★☆☆☆☆</span>
                </div>
                <div className="flex-1 h-3 bg-[#EDEDED] rounded-full overflow-hidden">
                  <div className="h-full bg-[#1C1C1C] rounded-full w-[0.5%]" />
                </div>
                <span className="w-10 text-right text-[11.5px] text-[#555555] font-normal shrink-0">
                  4
                </span>
              </div>
            </div>

          </div>

          {/* SLIDER / CAROUSEL CONTAINER FOR VERIFIED REVIEWS */}
          <div className="relative mt-6 pt-5 border-t border-gray-100 group">
            <div
              ref={sliderRef}
              onScroll={handleSliderScroll}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 snap-x snap-mandatory no-scrollbar scroll-smooth"
            >
              {reviews.map((rev) => {
                return (
                  <div
                    key={rev.id}
                    className="shrink-0 w-full sm:w-[calc(50%-8px)] snap-center rounded-2xl p-4.5 sm:p-5 bg-white border border-gray-200/90 hover:border-gray-300 shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      {/* Customer Info Header with Authentic AI Girl Reviewer Avatar */}
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0 shadow-2xs">
                            <img
                              src={rev.userImage || '/girl_reviewer_1.jpg'}
                              alt={rev.author}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover rounded-full"
                            />
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-[13px] sm:text-sm text-gray-900 truncate">
                                {rev.author}
                              </span>
                              {rev.verified && (
                                <span className="bg-[#2E7D32] text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 shrink-0">
                                  <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-0.5 font-medium">
                              <span className="truncate">{rev.city}, {rev.state}</span>
                              <span>•</span>
                              <span className="shrink-0">{rev.date}</span>
                            </div>
                          </div>
                        </div>

                        {/* 5 Stars */}
                        <div className="flex items-center text-[#F5A623] text-xs shrink-0 tracking-tight">
                          {'★'.repeat(rev.rating)}
                        </div>
                      </div>

                      {/* Review Title */}
                      {rev.title && (
                        <h4 className="font-bold text-xs sm:text-[13px] text-gray-900 mt-3 leading-snug">
                          {rev.title}
                        </h4>
                      )}

                      {/* Review Quote / Comment */}
                      <p className="text-xs text-gray-600 leading-relaxed mt-2">
                        "{rev.comment}"
                      </p>
                    </div>

                    {/* Bottom Footer: Purchased product & Helpful counter */}
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                      <span className="font-medium text-gray-600 truncate mr-2">
                        Verified Purchase
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setReviews((prev) =>
                            prev.map((r) =>
                              r.id === rev.id ? { ...r, helpfulCount: r.helpfulCount + 1 } : r
                            )
                          );
                        }}
                        className="hover:text-black font-semibold flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                      >
                        <ThumbsUp className="w-3 h-3" /> Helpful ({rev.helpfulCount})
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Carousel Navigation Bar (Arrows & Dots Placed Below Cards to Never Overlay Content) */}
            <div className="flex items-center justify-center gap-3 mt-2 sm:mt-3">
              <button
                onClick={() => scrollToSlide(activeSlide - 1)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-300 hover:border-black hover:bg-gray-50 text-gray-800 flex items-center justify-center transition-colors cursor-pointer active:scale-95 shadow-2xs"
                aria-label="Previous review"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5">
                {reviews.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => scrollToSlide(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      activeSlide === idx
                        ? 'w-6 bg-black'
                        : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => scrollToSlide(activeSlide + 1)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-300 hover:border-black hover:bg-gray-50 text-gray-800 flex items-center justify-center transition-colors cursor-pointer active:scale-95 shadow-2xs"
                aria-label="Next review"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Write a Review Modal */}
      {isWriteModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsWriteModalOpen(false)}
        >
          <div
            className="relative max-w-md w-full bg-white rounded-3xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-gray-900">
                Write a Customer Review
              </h3>
              <button
                onClick={() => setIsWriteModalOpen(false)}
                className="p-1 text-gray-400 hover:text-black rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddReview} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priyadarshini Mehta"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-black focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  City & State
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pune, Maharashtra"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-black focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setRating(s)}
                      className={`p-1 text-xl ${
                        s <= rating ? 'text-[#F5A623]' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Your Genuine Experience
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Share details about the gold plating, craftsmanship, lightweight comfort, packaging, or compliments received..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-black focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#FFD600] hover:bg-[#ebd000] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all shadow-xs"
              >
                Submit Verified Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
