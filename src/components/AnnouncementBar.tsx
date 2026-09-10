import React from 'react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div id="announcement-bar" className="bg-black text-white text-[10px] min-[360px]:text-[11px] sm:text-xs md:text-sm py-1.5 sm:py-2 px-2 sm:px-3 text-center font-medium tracking-tight sm:tracking-normal overflow-hidden">
      <div className="max-w-4xl mx-auto flex items-center justify-center whitespace-nowrap overflow-hidden text-ellipsis">
        <span>Prepaid Order Offer — Flat ₹100 OFF with Auto-Applied Coupon <strong className="text-[#FFD600] font-mono tracking-wider font-bold">QVL100</strong></span>
      </div>
    </div>
  );
};
