import React from 'react';
import { Star, Plus, CheckCircle2 } from 'lucide-react';
import { RELATED_PRODUCTS } from '../data/productData';

interface RelatedProductsProps {
  onAddToCartItem: (item: { title: string; price: number }) => void;
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({ onAddToCartItem }) => {
  return (
    <section className="py-8 bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-widest">
              QAVELLE Heritage Collection
            </span>
            <h3 className="text-lg sm:text-xl font-black text-gray-900">
              Complete the Royal Look • Matching Women's Jewelry
            </h3>
          </div>
          <span className="text-xs text-gray-500 hidden sm:inline font-medium">
            Handcrafted Necklaces, Chokers & Bangles
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {RELATED_PRODUCTS.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="relative aspect-square bg-gray-100 rounded-t-2xl sm:rounded-t-3xl overflow-hidden">
                <img
                  src={prod.image}
                  alt={prod.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-t-2xl sm:rounded-t-3xl"
                />
              </div>

              <div className="p-3 flex flex-col justify-between flex-1 min-w-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-1 text-[11px] text-gray-600 mb-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-gray-900">{prod.rating}</span>
                    <span>({prod.reviews})</span>
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-gray-900 line-clamp-2 leading-snug break-words">
                    {prod.title}
                  </h4>
                </div>

                <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between gap-1 flex-wrap">
                  <div className="flex items-baseline gap-1">
                    <span className="font-black text-sm text-black">₹{prod.price}</span>
                    <span className="text-[10px] text-gray-400 line-through">
                      ₹{prod.originalPrice}
                    </span>
                  </div>
                  <button
                    onClick={() => onAddToCartItem({ title: prod.title, price: prod.price })}
                    className="p-1.5 bg-[#FFC107] hover:bg-amber-400 text-black rounded-lg transition-colors shadow-2xs"
                    title="Add to Cart"
                    aria-label={`Add ${prod.title} to cart`}
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
