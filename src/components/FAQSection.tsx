import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import {
  FAQS_LIST,
  PRODUCT_DETAILS,
  CHOKER_PRODUCT_DETAILS,
  COMBO5_PRODUCT_DETAILS,
} from '../data/productData';
import { ProductId } from '../types';

interface FAQSectionProps {
  activeProductId?: ProductId;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ activeProductId = 'jhumka' }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const isCombo5 = activeProductId === 'necklace-combo-5';
  const isChoker = activeProductId === 'choker';
  const currentProduct = isCombo5
    ? COMBO5_PRODUCT_DETAILS
    : isChoker
    ? CHOKER_PRODUCT_DETAILS
    : PRODUCT_DETAILS;

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="py-10 bg-gray-50 border-t border-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-8">
          <span className="bg-amber-100 text-amber-900 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Help & Guidance
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1.5">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Learn more about authenticity, energization rituals, sizing, and delivery
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-2.5">
          {FAQS_LIST.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 font-bold text-xs sm:text-sm text-gray-900 hover:text-amber-800 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold flex items-center justify-center shrink-0">
                      Q{idx + 1}
                    </span>
                    <span>{faq.question}</span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-gray-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/50">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* WhatsApp Astrologer Support Card */}
        <div className="mt-8 p-4 rounded-xl bg-white border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-gray-900">
                Have Questions About This {isChoker ? 'Bridal Choker Set' : 'Jhumka Set'}?
              </h4>
              <p className="text-[11px] text-gray-500">Our customer support team is ready to help you on WhatsApp</p>
            </div>
          </div>
          <a
            href={`https://wa.me/917982438137?text=${encodeURIComponent(
              `Hi QAVELLE, I would like to know more about the ${currentProduct.title}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};
