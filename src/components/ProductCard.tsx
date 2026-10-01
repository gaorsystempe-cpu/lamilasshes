import React, { useState } from 'react';
import { Heart, Eye, ShoppingBag, Star, Check, Sparkles, MessageCircle } from 'lucide-react';
import { Product } from '../types/catalog';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    settings,
    addToCart,
    wishlist,
    toggleWishlist,
    openProductModal,
    openZoomLightbox
  } = useStore();

  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const isFavorite = wishlist.includes(product.id);
  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0;

  const mainImage =
    product.images && product.images.length > 0
      ? isHovered && product.images.length > 1
        ? product.images[1]
        : product.images[currentImgIndex]
      : 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80';

  return (
    <div
      className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Image Showcase Area */}
      <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden cursor-pointer">
        <img
          src={mainImage}
          alt={product.title}
          onClick={() => openProductModal(product)}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
          {product.isNew && (
            <span className="bg-slate-900 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md shadow-sm">
              NUEVO
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-rose-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-md shadow-sm">
              -{discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Favorite Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${
            isFavorite
              ? 'bg-rose-50 text-rose-600'
              : 'bg-white/80 text-slate-600 hover:text-rose-600 hover:bg-white'
          }`}
          title={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
          <button
            onClick={() => openProductModal(product)}
            className="flex-1 bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-semibold py-2 rounded-xl backdrop-blur-md transition-all flex items-center justify-center gap-1.5 shadow-md"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Vista Rápida</span>
          </button>
        </div>
      </div>

      {/* Content Metadata Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium text-slate-400">{product.category}</span>
            <div className="flex items-center gap-1 text-amber-500 font-semibold font-mono">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-400">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => openProductModal(product)}
            className="text-sm font-bold text-slate-900 hover:text-emerald-600 transition-colors line-clamp-2 cursor-pointer mb-2 font-heading"
          >
            {product.title}
          </h3>

          {/* Color Swatches Preview if available */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-[10px] text-slate-400">Colores:</span>
              {product.colors.slice(0, 4).map((c, i) => (
                <span
                  key={i}
                  className="w-3 h-3 rounded-full border border-slate-300 shadow-2xs inline-block"
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-[10px] text-slate-400">+{product.colors.length - 4}</span>
              )}
            </div>
          )}
        </div>

        {/* Footer Price & Add To Cart Button */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
          {/* Price Block */}
          <div>
            <div className="flex items-baseline gap-1.5 font-mono">
              <span className="text-base font-extrabold text-slate-900">
                {settings.currencySymbol}{product.price.toFixed(2)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  {settings.currencySymbol}{product.compareAtPrice.toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-600 font-medium">
              {product.inStock ? '✓ Stock disponible' : 'Agotado'}
            </span>
          </div>

          {/* Quick Add To Cart */}
          <button
            onClick={() => addToCart(product)}
            disabled={!product.inStock}
            className={`p-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center ${
              product.inStock
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm active:scale-95'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
            title="Añadir al Carrito"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
