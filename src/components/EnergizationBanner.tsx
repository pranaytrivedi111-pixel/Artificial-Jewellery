import React from 'react';
import { ShieldCheck, Sparkles, Box, CheckCircle2, Award } from 'lucide-react';

export const EnergizationBanner: React.FC = () => {
  return (
    <section className="py-8 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* QAVELLE Quality Craftsmanship Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-gradient-to-br from-amber-50 via-yellow-50/50 to-white p-5 sm:p-8 rounded-2xl border border-amber-200 shadow-xs mb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-[#FFD600] text-black font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
              <Sparkles className="w-3.5 h-3.5 fill-black" /> QAVELLE Heritage Guarantee
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-gray-950 leading-snug">
              Why QAVELLE Handcrafted Jewelry Delivers Timeless Elegance
            </h3>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              Crafted for the queen in you. Unlike ordinary marketplace imitation jewelry that tarnishes quickly, every single QAVELLE piece is manufactured with anti-tarnish micro plating and hand-finished by master artisans.
            </p>
            <div className="space-y-2 pt-2 text-xs text-gray-800">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                <span><strong>Artisan Hand-Inspection:</strong> Hand-inspected for high precision filigree, pearl droplet fastening, and zero sharp edges.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                <span><strong>Multi-Layer Anti-Tarnish Coating:</strong> Long-lasting lustrous antique gold finish designed for Indian climatic conditions.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                <span><strong>Featherlight All-Day Comfort:</strong> Ergonomically balanced weight distribution so you can dance and celebrate with zero ear lobe strain.</span>
              </div>
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden shadow-md border border-amber-200 aspect-4/3 flex items-center justify-center bg-white">
            <img
              src="/UGC.png"
              alt="Handcrafted Jhumka Set in Hand"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain rounded-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
              <span className="text-white font-bold text-xs">
                Handcrafted Precision by Master Karigars
              </span>
            </div>
          </div>
        </div>

        {/* Luxury Packaging Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-gray-900 text-white p-5 sm:p-8 rounded-2xl shadow-md border border-gray-800">
          <div className="order-2 md:order-1 relative rounded-xl overflow-hidden shadow-md aspect-4/3 flex items-center justify-center bg-black">
            <img
              src="/Cinematic.png"
              alt="Complete 6-Pair Royal Antique Gold Jhumka Collection on Silk"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain rounded-xl"
            />
          </div>

          <div className="order-1 md:order-2 space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-[#FFD600] text-black font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" /> 100% Quality Inspected
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
              Royal Presentation Packaging &amp; Authenticity Guarantee
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Every parcel comes secured in protective packaging suitable for personal safekeeping or gifting to loved ones on weddings, festivals, and special celebrations.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-2.5 bg-gray-800 rounded-lg border border-gray-700">
                <Box className="w-4 h-4 text-[#FFD600] mb-1" />
                <h5 className="font-bold text-xs text-white">Gift-Ready Box</h5>
                <p className="text-[10px] text-gray-400">Shockproof &amp; Elegant</p>
              </div>
              <div className="p-2.5 bg-gray-800 rounded-lg border border-gray-700">
                <ShieldCheck className="w-4 h-4 text-[#FFD600] mb-1" />
                <h5 className="font-bold text-xs text-white">Quality Guarantee</h5>
                <p className="text-[10px] text-gray-400">7-Day Return &amp; Exchange</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
