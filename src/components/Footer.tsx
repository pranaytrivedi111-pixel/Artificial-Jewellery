import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { IndiaPaymentsStrip } from './PaymentLogos';
import {
  ASSET_IMAGES,
  PRODUCT_DETAILS,
  CHOKER_PRODUCT_DETAILS,
  COMBO5_PRODUCT_DETAILS,
  RADHIKA_GREEN_AD_PRODUCT_DETAILS,
  ALLURE_GOLD_SET_PRODUCT_DETAILS,
  ELEGANT_EVERYDAY_PRODUCT_DETAILS,
} from '../data/productData';
import { ProductId } from '../types';
import { sanitizeText } from '../utils/brandSanitizer';

interface FooterProps {
  activeProductId?: ProductId;
}

export const Footer: React.FC<FooterProps> = ({ activeProductId = 'jhumka' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const currentProduct =
    activeProductId === 'allure-gold-set'
      ? ALLURE_GOLD_SET_PRODUCT_DETAILS
      : activeProductId === 'radhika-green-ad'
      ? RADHIKA_GREEN_AD_PRODUCT_DETAILS
      : activeProductId === 'elegant-everyday-5'
      ? ELEGANT_EVERYDAY_PRODUCT_DETAILS
      : activeProductId === 'necklace-combo-5'
      ? COMBO5_PRODUCT_DETAILS
      : activeProductId === 'choker'
      ? CHOKER_PRODUCT_DETAILS
      : PRODUCT_DETAILS;
  const cleanTitle = sanitizeText(currentProduct.title);
  const whatsappUrl =
    'https://wa.me/917982438137?text=' +
    encodeURIComponent(`Hi QAVELLE, I would like to know more about the ${cleanTitle}`);

  return (
    <footer className="bg-white text-gray-900 pt-5 sm:pt-6 pb-20 sm:pb-20 lg:pb-12 border-t border-gray-100">
      <div className="max-w-xl lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 xl:gap-10 items-start">
          {/* Left Column: Brand Wordmark Logo & Contact Icons */}
          <div className="lg:col-span-4 mb-5 lg:mb-0">
            {/* Brand Logo with Queen Theme */}
            <div className="mb-2">
              <img
                src={ASSET_IMAGES.brandLogo}
                alt="QAVELLE – Crafted For The Queen In You"
                className="h-12 sm:h-14 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Circular Action Icons: Subtle Grey Instagram & WhatsApp just below Qavelle logo */}
            <div className="flex items-center gap-2 mt-2.5">
              {/* Instagram Button */}
              <a
                href="https://www.instagram.com/by_qavelle?stkn=MmFwa3E4bHZuanV4"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 border border-gray-200 flex items-center justify-center transition-all cursor-pointer active:scale-95 group"
                aria-label="Follow QAVELLE on Instagram (@by_qavelle)"
                title="Follow on Instagram"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current group-hover:scale-105 transition-transform" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* WhatsApp Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 border border-gray-200 flex items-center justify-center transition-all cursor-pointer active:scale-95 group"
                aria-label="Chat with QAVELLE on WhatsApp (7982438137)"
                title="Chat on WhatsApp"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current group-hover:scale-105 transition-transform" aria-hidden="true">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.42 0-2.82-.37-4.05-1.08l-.29-.17-3.12.82.83-3.04-.19-.3a8.132 8.132 0 0 1-1.25-4.46c0-4.54 3.7-8.24 8.24-8.24zm4.8 11.63c-.26-.13-1.56-.77-1.8-.86-.24-.09-.42-.13-.6.13-.18.26-.69.86-.84 1.04-.16.18-.31.2-.57.07-.26-.13-1.1-.41-2.09-1.3-.78-.69-1.3-1.55-1.45-1.81-.16-.26-.02-.4.11-.53.12-.12.26-.31.4-.47.13-.15.18-.26.26-.44.09-.18.04-.33-.02-.47-.07-.13-.6-1.45-.82-1.99-.22-.52-.44-.45-.6-.46-.16-.01-.33-.01-.51-.01-.18 0-.47.07-.72.33-.25.26-.95.93-.95 2.27 0 1.34.98 2.63 1.11 2.81.14.18 1.93 2.95 4.67 4.14.65.28 1.16.45 1.56.58.66.21 1.26.18 1.73.11.53-.08 1.56-.64 1.78-1.26.22-.61.22-1.14.15-1.26-.06-.11-.24-.18-.5-.31z" />
                </svg>
              </a>
            </div>

            <div className="mt-3">
              <p className="text-xs text-gray-600 leading-relaxed inline">
                India's premier royal ethnic jewelry brand. Handcrafted designer jhumkas, bridal diamond chokers, and heritage accessories fit for royalty.{' '}
              </p>
              <button
                type="button"
                onClick={() => setIsExpanded((prev) => !prev)}
                onMouseEnter={() => setIsExpanded(true)}
                className="lg:hidden inline-flex items-center gap-1 text-xs font-bold text-[#B3874B] hover:text-amber-800 underline underline-offset-2 ml-1 cursor-pointer transition-colors"
                aria-expanded={isExpanded}
              >
                <span>{isExpanded ? 'Read less' : 'Read more...'}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Right Column: Exact Paragraphs in Sequence (always visible on desktop, expands on mobile) */}
          <div
            className={`lg:col-span-8 space-y-4 text-[13.5px] sm:text-[14px] text-[#222222] leading-[1.65] font-normal transition-all duration-300 ${
              isExpanded
                ? 'block mt-4 pt-3.5 border-t border-gray-100 lg:mt-0 lg:pt-0 lg:border-t-0'
                : 'hidden lg:block'
            }`}
          >
            <p>
              QAVELLE is India's most trusted destination for handcrafted traditional and contemporary ethnic jewelry. We specialise in authentic Oxidised Gold Jhumkas, Temple Jewelry, Royal Peacock motif earrings, and festive sets crafted with premium anti-tarnish alloy.
            </p>

            <p>
              Every pair is hand-inspected for high precision craftsmanship, skin safety, and durable lustrous polish before shipping.
            </p>

            <p>
              Whether you want everyday lightweight ethnic earrings, bridal temple jhumkas, or festive celebration jewelry combos, QAVELLE has a curated collection across every traditional category.
            </p>

            <p>
              Trusted by thousands of happy customers across India. Anti-tarnish guarantee. 7-day return & exchange policy. Fast delivery nationwide. And if you need any help, our support team is available Monday to Saturday, 10AM - 7PM.
            </p>
          </div>
        </div>

        {/* 100% Secure Payment Partners Strip */}
        <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <svg className="w-4 h-4 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>100% Secure & Encrypted Payments via Official Gateways:</span>
          </div>
          <IndiaPaymentsStrip compact={true} />
        </div>

        {/* Copyright */}
        <div className="mt-3.5 pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 gap-2">
          <span>© {new Date().getFullYear()} QAVELLE Inc. All rights reserved.</span>
          <span>100% Handcrafted Heritage Royal Jewelry</span>
        </div>
      </div>
    </footer>
  );
};
