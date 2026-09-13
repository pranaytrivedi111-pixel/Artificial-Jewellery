import React from 'react';
import { GENUINE_PRODUCTS, GenuineProduct } from '../data/homeCatalog';
import { ProductId } from '../types';

interface YouMayAlsoLikeProps {
  activeProductId?: ProductId;
  onSwitchProduct?: (productId: ProductId, customSlug?: string) => void;
  onAddToCartItem?: (item: { title: string; price: number }) => void;
}

const PRODUCT_SLUGS: Record<ProductId, string> = {
  'white-enamel-handbag-earrings':
    '/products/suyug-high-grade-u-shaped-white-enemel-handbag-drop-earrings-for-women-and-girls',
  'emerald-snake-pendant':
    '/products/gold-plated-stainless-steel-cubic-zirconia-pendant-green-emerald-anti-tarnish-gold-plated-stainless-steel-flat-snake-chain-necklace-green-waterproof-chain-layering-pendant-gifts-for-women-and-girls',
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
      className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 border-t border-gray-100"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 sm:mb-8 gap-2">
        <div>
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#B3874B]">
            Curated Royal Treasury
          </span>
          <h2
            className="text-base sm:text-xl lg:text-2xl font-normal text-gray-950 tracking-tight leading-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            You May Also Like
          </h2>
        </div>
        <p className="text-xs text-gray-500 hidden sm:block">
          Click any set to view detailed 360° gallery & order with COD
        </p>
      </div>

      {/* 
          PRODUCT CARDS GRID: 
          Exclusively identical to the "Explore All Authentic Masterpieces" product cards:
          - 4 cards per row on desktop (grid-cols-4)
          - 2 cards per row on mobile (grid-cols-2)
          - Pristine clean image with zero overlays/badges
          - Clean uppercase category tracking
          - Single-line title with hover golden transition
          - High-contrast price with strike-through MRP and discount percentage
      */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 lg:gap-4.5">
        {displayProducts.map((product) => {
          const targetSlug = product.slug || getTargetSlug(product.id);

          return (
            <a
              key={product.cardKey || `${product.id}-${product.slug}`}
              href={targetSlug}
              onClick={(e) => handleProductClick(e, product)}
              className="group w-full text-center select-none bg-white rounded-2xl p-2 sm:p-2.5 border border-stone-200/80 hover:border-amber-300 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between"
              title={`Click to view ${product.title}`}
            >
              {/* Pristine Clean Image Container: Zero overlay badges */}
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#F8F6F2] p-2 sm:p-3 flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-contain rounded-xl transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
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
            </a>
          );
        })}
      </div>
    </section>
  );
};
