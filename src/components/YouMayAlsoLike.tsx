import React from 'react';
import { GENUINE_PRODUCTS, GenuineProduct } from '../data/homeCatalog';
import { ProductId } from '../types';

interface YouMayAlsoLikeProps {
  activeProductId?: ProductId;
  onSwitchProduct?: (productId: ProductId, customSlug?: string) => void;
  onAddToCartItem?: (item: { title: string; price: number }) => void;
}

const PRODUCT_SLUGS: Record<ProductId, string> = {
  'combo-2-pendants': '/products/combo-of-2-aesthetic-daily-wear-pendants-stylish-pastel-pink-panna-green-locket-with-sleek-chain',
  'trendy-alloy-set': '/products/trendy-alloy-gold-plated-jewellery-set',
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
  // Curated recommendations excluding the current active product to avoid repetition
  const displayProducts: GenuineProduct[] = React.useMemo(() => {
    return GENUINE_PRODUCTS.filter((p) => p.id !== activeProductId);
  }, [activeProductId]);

  const handleProductClick = (
    e: React.MouseEvent,
    product: GenuineProduct
  ) => {
    if (product.id && onSwitchProduct) {
      e.preventDefault();
      onSwitchProduct(product.id, product.slug);
      try {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      } catch (err) {
        window.scrollTo(0, 0);
      }
    }
  };

  return (
    <section
      id="you-may-also-like"
      className="py-12 sm:py-16 bg-white border-t border-gray-100"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Centered Serif Section Header */}
        <div className="text-center mb-8 sm:mb-11">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#B3874B] block mb-1.5">
            Curated Royal Treasury
          </span>
          <h2
            className="text-2xl sm:text-3xl lg:text-[34px] font-normal text-gray-900 tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            You May Also Like
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-lg mx-auto mt-2 font-light">
            Every handcrafted heritage piece in our royal jewelry collection
          </p>
        </div>

        {/* Product Cards Grid: Show EVERY product in the store (2 columns on mobile, 4 columns on desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {displayProducts.map((product) => {
            const isCurrent = product.id === activeProductId;
            const targetSlug = product.slug || getTargetSlug(product.id);

            return (
              <div
                key={product.cardKey || `${product.id}-${product.slug}`}
                className="w-full flex flex-col items-center"
              >
                <a
                  href={targetSlug}
                  onClick={(e) => handleProductClick(e, product)}
                  className={`group flex flex-col w-full text-center cursor-pointer select-none rounded-2xl sm:rounded-3xl p-2 sm:p-3 transition-all duration-300 ${
                    isCurrent
                      ? 'bg-amber-50/40 border border-amber-200/90 shadow-xs'
                      : 'bg-transparent hover:bg-stone-50/80 border border-transparent hover:border-stone-200/80'
                  }`}
                  title={`View ${product.title}`}
                >
                  {/* Clean Image Frame with Rounded Corners (Zero text overlay on the image) */}
                  <div className="relative aspect-square w-full rounded-xl sm:rounded-2xl overflow-hidden bg-[#F8F6F2] group-hover:bg-[#f3efe8] transition-colors duration-300 p-2 sm:p-3 flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain rounded-xl sm:rounded-2xl group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                  </div>

                  {/* Badges / Category Tag below image (never on image) */}
                  <div className="mt-2.5 flex items-center justify-center gap-1.5 flex-wrap">
                    {isCurrent ? (
                      <span className="text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-full">
                        Currently Viewing
                      </span>
                    ) : (
                      <span className="text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider text-stone-700 bg-stone-100 px-2 py-0.5 rounded-full">
                        {product.tag || product.category}
                      </span>
                    )}
                  </div>

                  {/* Title below Image in elegant Serif font (2-line clamped with ellipsis) */}
                  <h3
                    className="mt-1.5 font-normal text-xs sm:text-[14.5px] text-gray-900 leading-snug line-clamp-2 px-1 group-hover:text-[#B3874B] transition-colors h-8 sm:h-11 font-serif"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {product.title}
                  </h3>

                  {/* Star Rating snippet */}
                  <div className="flex items-center justify-center gap-1 mt-1 text-[10.5px] sm:text-xs text-amber-700 font-medium">
                    <span>★ {product.rating}</span>
                    <span className="text-gray-400">
                      ({product.reviewsCount.toLocaleString('en-IN')})
                    </span>
                  </div>

                  {/* Centered Price Row with discount pill below */}
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-1 sm:mt-1.5 flex-wrap">
                    <span className="text-sm sm:text-base font-bold text-gray-950 font-mono">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] sm:text-xs text-gray-400 line-through font-normal font-mono">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                    {product.discountPercent && (
                      <span className="text-[9.5px] sm:text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-1.5 py-0.2 rounded">
                        {product.discountPercent}% OFF
                      </span>
                    )}
                  </div>

                  {/* View Details Action Link */}
                  <div className="mt-2.5 pt-2 border-t border-gray-100/80 w-full flex items-center justify-center">
                    <span className="text-[11px] sm:text-xs font-semibold text-[#B3874B] group-hover:text-[#8d6735] flex items-center gap-1 transition-colors">
                      <span>View Piece</span>
                      <span className="transition-transform group-hover:translate-x-0.5">&rarr;</span>
                    </span>
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
