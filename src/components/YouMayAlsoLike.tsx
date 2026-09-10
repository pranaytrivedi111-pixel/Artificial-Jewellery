import React from 'react';
import {
  JHUMKA_MATCHING_VARIANTS,
  CHOKER_MATCHING_VARIANTS,
  COMBO5_MATCHING_VARIANTS,
  ELEGANT_EVERYDAY_MATCHING_VARIANTS,
  RADHIKA_GREEN_AD_MATCHING_VARIANTS,
  ALLURE_GOLD_SET_MATCHING_VARIANTS,
} from '../data/productData';
import { ProductId } from '../types';

interface YouMayAlsoLikeProps {
  activeProductId?: ProductId;
  onSwitchProduct?: (productId: ProductId) => void;
  onAddToCartItem?: (item: { title: string; price: number }) => void;
}

const PRODUCT_SLUGS: Record<ProductId, string> = {
  'allure-gold-set': '/products/royal-elegant-gold-plated-jewellery-set',
  'radhika-green-ad': '/products/radhika-anant-ambani-inspired-green-ad-necklace-set',
  'elegant-everyday-5': '/products/elegant-everyday-necklace-set-combo-of-5',
  'choker': '/products/rhodium-plated-austrian-diamond-choker-set',
  'necklace-combo-5': '/products/shimmering-pack-of-5-necklace-pendant-combo',
  'jhumka': '/products/gold-plated-fancy-jhumka-earrings-set-of-6',
};

const getTargetSlug = (productId?: ProductId): string => {
  if (productId && PRODUCT_SLUGS[productId]) {
    return PRODUCT_SLUGS[productId];
  }
  return '/';
};

export const YouMayAlsoLike: React.FC<YouMayAlsoLikeProps> = ({
  activeProductId = 'jhumka',
  onSwitchProduct,
}) => {
  const products =
    activeProductId === 'allure-gold-set'
      ? ALLURE_GOLD_SET_MATCHING_VARIANTS
      : activeProductId === 'radhika-green-ad'
      ? RADHIKA_GREEN_AD_MATCHING_VARIANTS
      : activeProductId === 'elegant-everyday-5'
      ? ELEGANT_EVERYDAY_MATCHING_VARIANTS
      : activeProductId === 'necklace-combo-5'
      ? COMBO5_MATCHING_VARIANTS
      : activeProductId === 'choker'
      ? CHOKER_MATCHING_VARIANTS
      : JHUMKA_MATCHING_VARIANTS;

  const handleProductClick = (
    e: React.MouseEvent,
    item: (typeof products)[0]
  ) => {
    if (item.productId && onSwitchProduct) {
      e.preventDefault();
      onSwitchProduct(item.productId as ProductId);
    }
  };

  return (
    <section
      id="you-may-also-like"
      className="py-10 sm:py-14 bg-white border-t border-gray-100"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Centered Serif Section Header */}
        <div className="text-center mb-7 sm:mb-9">
          <h2
            className="text-2xl sm:text-3xl lg:text-[34px] font-normal text-gray-900 tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            You May Also Like
          </h2>
        </div>

        {/* Product Cards Grid: Responsive 4 items (2x2 on mobile, 4 in a row on desktop) */}
        <div
          className={`grid gap-3.5 sm:gap-6 mx-auto ${
            products.length >= 4
              ? 'grid-cols-2 md:grid-cols-4 max-w-5xl'
              : products.length >= 3
              ? 'grid-cols-2 md:grid-cols-3 max-w-3xl'
              : 'grid-cols-2 max-w-xl sm:max-w-2xl'
          }`}
        >
          {products.map((product) => {
            const targetSlug = getTargetSlug(product.productId as ProductId);

            return (
              <div key={product.id} className="w-full flex flex-col items-center">
                <a
                  href={targetSlug}
                  onClick={(e) => handleProductClick(e, product)}
                  className="group block w-full text-center cursor-pointer select-none"
                  title={`View ${product.title}`}
                >
                  {/* Clean Image Frame with Rounded Corners (Zero text overlay) */}
                  <div className="relative aspect-square w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#F8F6F2] shadow-xs group-hover:shadow-md transition-all duration-300 p-2 flex items-center justify-center">
                    {/* Clean Product Photograph */}
                    <img
                      src={product.image}
                      alt={product.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  </div>

                  {/* Title below Image in elegant Serif font (2-line clamped with ellipsis) */}
                  <h3
                    className="mt-3 sm:mt-4 font-normal text-xs sm:text-base text-gray-900 leading-snug line-clamp-2 px-1 group-hover:text-amber-900 transition-colors h-8 sm:h-11"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {product.title}
                  </h3>

                  {/* Centered Price Row with discount pill below the photo */}
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-1 sm:mt-1.5 flex-wrap">
                    <span className="text-sm sm:text-lg font-semibold text-gray-950">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] sm:text-sm text-gray-400 line-through font-normal">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                    {product.discountPercent && (
                      <span className="text-[10px] sm:text-xs font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                        {product.discountPercent}% OFF
                      </span>
                    )}
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
