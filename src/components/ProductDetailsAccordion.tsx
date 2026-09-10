import React from 'react';
import {
  Users,
  Award,
  RotateCcw,
  Truck
} from 'lucide-react';

export const ProductDetailsAccordion: React.FC = () => {
  return (
    <div className="py-2 sm:py-3 w-full">
      {/* "Why QAVELLE ?" Section */}
      <div className="rounded-2xl bg-[#FFFDF6] border border-[#F4EEDC] p-3.5 sm:p-4 lg:p-5 relative shadow-2xs">
        {/* Section Heading with Yellow Brush Underline */}
        <div className="mb-3">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-black tracking-tight inline-block relative">
            Why QAVELLE ?
            {/* Hand-drawn yellow underline SVG */}
            <svg
              className="absolute -bottom-2 left-0 w-full h-2.5 text-[#FFD600] overflow-visible"
              viewBox="0 0 140 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 6C35 2 95 1 138 7"
                stroke="#FFD600"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M12 8C50 4 100 3.5 130 8"
                stroke="#FFE57F"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </h3>
        </div>

        {/* 4 Pastel Cards Grid (Stacked on mobile, 2-column on sm/desktop) */}
        <div className="space-y-2.5 sm:space-y-0 sm:grid sm:grid-cols-2 gap-2.5 lg:gap-3 mt-3">
          {/* Card 1: Happy Customers */}
          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#EDF7FF] border border-[#D4EAFC] shadow-2xs">
            <div className="w-11 h-11 rounded-xl bg-white/90 border border-blue-100 flex items-center justify-center text-gray-800 shrink-0 shadow-2xs">
              <Users className="w-6 h-6 text-gray-800 stroke-[1.75]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-black">Happy Customers</h4>
              <p className="text-xs text-gray-700 mt-0.5">
                More than <strong className="text-[#388E3C] font-extrabold">15 Lakh+</strong> users have trusted us
              </p>
            </div>
          </div>

          {/* Card 2: 100% Original & Certified */}
          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#F8F2FF] border border-[#ECDDFD] shadow-2xs">
            <div className="w-11 h-11 rounded-xl bg-white/90 border border-purple-100 flex items-center justify-center text-gray-800 shrink-0 shadow-2xs">
              <Award className="w-6 h-6 text-gray-800 stroke-[1.75]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-black">100% Original & Certified</h4>
              <p className="text-xs text-gray-700 mt-0.5">
                Certified by top labs in India.
              </p>
            </div>
          </div>

          {/* Card 3: Return & Exchange */}
          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#F0FAF2] border border-[#D3F2D9] shadow-2xs">
            <div className="w-11 h-11 rounded-xl bg-white/90 border border-emerald-100 flex items-center justify-center text-gray-800 shrink-0 shadow-2xs">
              <RotateCcw className="w-6 h-6 text-gray-800 stroke-[1.75]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-black">Return & Exchange</h4>
              <p className="text-xs text-gray-700 mt-0.5">
                Easy 7-day return & exchange process.
              </p>
            </div>
          </div>

          {/* Card 4: Free Shipping */}
          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#FFF2EE] border border-[#FEDCCE] shadow-2xs">
            <div className="w-11 h-11 rounded-xl bg-white/90 border border-orange-100 flex items-center justify-center text-gray-800 shrink-0 shadow-2xs">
              <Truck className="w-6 h-6 text-gray-800 stroke-[1.75]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-black">Free Shipping</h4>
              <p className="text-xs text-gray-700 mt-0.5">
                Free shipping all over India.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
