import React, { useState } from 'react';
import {
  ShoppingBag,
  Menu,
  X,
  Search,
  Package,
  Heart,
  Crown,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { ASSET_IMAGES } from '../data/productData';
import { GENUINE_PRODUCTS } from '../data/homeCatalog';
import { ProductId } from '../types';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenTrackOrder?: () => void;
  wishlistCount?: number;
  onToggleWishlist?: () => void;
  isWishlisted?: boolean;
  onNavigateHome?: () => void;
  onSelectProduct?: (productId: ProductId) => void;
  currentView?: 'home' | 'product';
  activeProductId?: ProductId;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenTrackOrder,
  wishlistCount = 0,
  onToggleWishlist,
  isWishlisted = false,
  onNavigateHome,
  onSelectProduct,
  currentView = 'home',
  activeProductId,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');

  const searchResults = headerSearchQuery.trim()
    ? GENUINE_PRODUCTS.filter(
        (p) =>
          p.title.toLowerCase().includes(headerSearchQuery.toLowerCase()) ||
          p.subtitle.toLowerCase().includes(headerSearchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(headerSearchQuery.toLowerCase())
      )
    : [];

  const handleProductClick = (id: ProductId) => {
    if (onSelectProduct) {
      onSelectProduct(id);
    }
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setHeaderSearchQuery('');
  };

  return (
    <>
      <header
        id="main-header"
        className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-2xs transition-all"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Left: Mobile Menu Toggle + Brand Logo */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-1.5 text-gray-700 hover:text-black rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <a
                href="/"
                onClick={(e) => {
                  if (onNavigateHome) {
                    e.preventDefault();
                    onNavigateHome();
                  }
                }}
                className="flex items-center group select-none active:opacity-85 transition-opacity cursor-pointer py-1"
                title="QAVELLE – Crafted For The Queen In You"
              >
                <img
                  src={ASSET_IMAGES.brandLogo}
                  alt="QAVELLE – Crafted For The Queen In You"
                  className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                  referrerPolicy="no-referrer"
                />
              </a>
            </div>

            {/* Middle: Desktop Navigation Links (Astrotalk Store inspired) */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              <button
                onClick={onNavigateHome}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  currentView === 'home'
                    ? 'text-amber-800 bg-amber-50'
                    : 'text-gray-700 hover:text-black hover:bg-gray-50'
                }`}
              >
                Home
              </button>

              <button
                onClick={() => handleProductClick('radhika-green-ad')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                  activeProductId === 'radhika-green-ad' && currentView === 'product'
                    ? 'text-amber-800 bg-amber-50'
                    : 'text-gray-700 hover:text-black hover:bg-gray-50'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                Ambani Set
              </button>

              <button
                onClick={() => handleProductClick('elegant-everyday-5')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                  activeProductId === 'elegant-everyday-5' && currentView === 'product'
                    ? 'text-amber-800 bg-amber-50'
                    : 'text-gray-700 hover:text-black hover:bg-gray-50'
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                Combo of 5
              </button>

              <button
                onClick={() => handleProductClick('choker')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeProductId === 'choker' && currentView === 'product'
                    ? 'text-amber-800 bg-amber-50'
                    : 'text-gray-700 hover:text-black hover:bg-gray-50'
                }`}
              >
                Royal Choker
              </button>

              <button
                onClick={() => handleProductClick('jhumka')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeProductId === 'jhumka' && currentView === 'product'
                    ? 'text-amber-800 bg-amber-50'
                    : 'text-gray-700 hover:text-black hover:bg-gray-50'
                }`}
              >
                Gold Jhumkas
              </button>

              <button
                onClick={() => handleProductClick('necklace-combo-5')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeProductId === 'necklace-combo-5' && currentView === 'product'
                    ? 'text-amber-800 bg-amber-50'
                    : 'text-gray-700 hover:text-black hover:bg-gray-50'
                }`}
              >
                Shimmering 5
              </button>
            </nav>

            {/* Right Action Icons: Search, Track Order, Wishlist, Cart */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search Toggle Button */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-gray-700 hover:text-black hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                aria-label="Search Products"
                title="Search Jewellery"
              >
                <Search className="w-5 h-5 stroke-[2]" />
              </button>

              {/* Track Order Button */}
              {onOpenTrackOrder && (
                <button
                  type="button"
                  onClick={onOpenTrackOrder}
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-gray-700 hover:text-black hover:bg-gray-100 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  title="Track Your Order"
                >
                  <Package className="w-4 h-4 text-amber-700" />
                  <span>Track Order</span>
                </button>
              )}

              {/* Wishlist Button */}
              {onToggleWishlist && (
                <button
                  type="button"
                  onClick={onToggleWishlist}
                  className="p-2 text-gray-700 hover:text-black hover:bg-gray-100 rounded-full transition-colors cursor-pointer relative"
                  aria-label="Wishlist"
                >
                  <Heart
                    className={`w-5 h-5 stroke-[2] ${
                      isWishlisted ? 'fill-rose-500 text-rose-500' : ''
                    }`}
                  />
                  {wishlistCount > 0 && (
                    <span className="absolute top-1 right-1 bg-rose-500 text-white font-bold text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </button>
              )}

              {/* Shopping Bag Icon with Badge */}
              <button
                onClick={onOpenCart}
                id="header-cart-button"
                className="relative p-2 text-gray-800 hover:text-black hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5 stroke-[2]" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#FFD600] text-black font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-black shadow-xs">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Live Search Drawer / Dropdown */}
        {isSearchOpen && (
          <div className="border-t border-gray-100 bg-white px-4 py-3 shadow-md animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="max-w-3xl mx-auto relative">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  autoFocus
                  value={headerSearchQuery}
                  onChange={(e) => setHeaderSearchQuery(e.target.value)}
                  placeholder="Search for necklace sets, combo of 5, choker, jhumkas..."
                  className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                />
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setHeaderSearchQuery('');
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black text-xs font-bold p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Instant Search Results */}
              {searchResults.length > 0 && (
                <div className="mt-2.5 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden divide-y divide-gray-100 max-h-80 overflow-y-auto">
                  {searchResults.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleProductClick(p.id)}
                      className="p-2.5 sm:p-3 hover:bg-amber-50/40 flex items-center gap-3 cursor-pointer transition-colors"
                    >
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-11 h-11 sm:w-12 sm:h-12 object-cover rounded-lg border border-gray-100"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-gray-100 text-gray-700">
                            {p.tag}
                          </span>
                          <span className="text-xs font-black text-gray-900">₹{p.price}</span>
                          <span className="text-[10px] text-gray-400 line-through">
                            ₹{p.originalPrice}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-gray-900 truncate mt-0.5">
                          {p.title}
                        </h4>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-300">
            <div>
              {/* Drawer Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <img
                  src={ASSET_IMAGES.brandLogo}
                  alt="QAVELLE"
                  className="h-9 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 text-gray-500 hover:text-black rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="p-3 space-y-1">
                <button
                  onClick={() => {
                    if (onNavigateHome) onNavigateHome();
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between ${
                    currentView === 'home'
                      ? 'bg-amber-50 text-amber-800'
                      : 'text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <span>Home</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>

                <div className="pt-2 pb-1 px-3 text-[10px] font-black uppercase tracking-wider text-gray-400">
                  Featured Products
                </div>

                {GENUINE_PRODUCTS.map((prod) => (
                  <button
                    key={prod.id}
                    onClick={() => handleProductClick(prod.id)}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2.5"
                  >
                    <img
                      src={prod.image}
                      alt={prod.shortTitle}
                      className="w-8 h-8 rounded-lg object-cover border border-gray-200"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 truncate">
                      <p className="font-bold text-gray-900 truncate">{prod.shortTitle}</p>
                      <p className="text-[10px] text-emerald-700 font-extrabold">₹{prod.price}</p>
                    </div>
                  </button>
                ))}

                {onOpenTrackOrder && (
                  <div className="pt-3">
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onOpenTrackOrder();
                      }}
                      className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold text-gray-800 bg-gray-50 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <Package className="w-4 h-4 text-amber-700" />
                      <span>Track Your Order</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Footer with Support */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/70">
              <p className="text-[11px] font-bold text-gray-800">Need Help with Your Order?</p>
              <p className="text-[10px] text-gray-500 mt-0.5">WhatsApp support: +91 7982438137</p>
              <a
                href="https://wa.me/917982438137"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2.5 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
