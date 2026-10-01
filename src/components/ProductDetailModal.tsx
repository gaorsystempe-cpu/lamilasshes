import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  ShoppingBag,
  MessageCircle,
  Share2,
  Check,
  Truck,
  ShieldCheck,
  Sparkles,
  QrCode,
  Copy
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { UltraHdMagnifier } from './UltraHdMagnifier';
import { Product } from '../types/catalog';

interface ProductDetailContentProps {
  product: Product;
}

const ProductDetailContent: React.FC<ProductDetailContentProps> = ({ product }) => {
  const { closeProductModal, addToCart, settings, showToast } = useStore();

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0] : undefined
  );
  const [selectedSize, setSelectedSize] = useState(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [customNotes, setCustomNotes] = useState('');

  // Reset state when product changes
  useEffect(() => {
    setActiveImgIndex(0);
    setSelectedColor(product.colors && product.colors.length > 0 ? product.colors[0] : undefined);
    setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined);
    setQuantity(1);
    setCustomNotes('');
  }, [product.id]);

  const images = product.images?.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&auto=format&fit=crop&q=80'];

  const currentImage = images[activeImgIndex] || images[0];

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0;

  // Single Item Direct WhatsApp Order
  const handleDirectWhatsAppBuy = () => {
    let details = [];
    if (selectedColor) details.push(`Color: ${selectedColor.name}`);
    if (selectedSize) details.push(`Talla: ${selectedSize}`);
    if (customNotes) details.push(`Notas: "${customNotes}"`);

    const detailsStr = details.length > 0 ? `\n• Detalles: ${details.join(' | ')}` : '';

    const text = `¡Hola *${settings.storeName}*! 👋

Deseo adquirir el siguiente producto directamente:

📦 *${product.title}*
• SKU: ${product.sku}
• Cantidad: ${quantity}${detailsStr}
• Precio Unitario: ${settings.currencySymbol}${product.price.toFixed(2)}
*TOTAL: ${settings.currencySymbol}${(product.price * quantity).toFixed(2)}*

Quedo a la espera de sus datos de pago y confirmación de envío. ¡Muchas gracias!`;

    const cleanPhone = settings.whatsappNumber.replace(/\D/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col justify-end sm:justify-center p-0 sm:p-4 overflow-y-auto animate-fadeIn">
      {/* Mobile Slide-Up Bottom Sheet Card */}
      <div className="relative w-full max-w-2xl mx-auto bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-pink-200 overflow-hidden my-0 sm:my-6 max-h-[92vh] flex flex-col animate-slideUp">
        {/* Drag handle bar for mobile */}
        <div className="pt-3 pb-1 sm:hidden cursor-grab shrink-0" onClick={closeProductModal}>
          <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto" />
        </div>

        {/* Top Close Button */}
        <button
          onClick={closeProductModal}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100/90 hover:bg-slate-200 text-slate-700 transition-colors shadow-sm"
          title="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-5 sm:p-8 space-y-6">
          {/* Top Ultra HD Image Gallery */}
          <div className="flex flex-col gap-3">
            <UltraHdMagnifier
              src={currentImage}
              alt={product.title}
              title={product.title}
            />

            {/* Gallery Thumbnails */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImgIndex(idx)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      idx === activeImgIndex
                        ? 'border-[#064e3b] scale-105 shadow-sm'
                        : 'border-slate-200 opacity-70'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Vista ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-extrabold text-[#064e3b] uppercase tracking-wider">
                {product.category}
              </span>
              <span className="font-mono text-slate-400">SKU: {product.sku}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading leading-tight mb-2">
              {product.title}
            </h2>

            {/* Rating & Stock */}
            <div className="flex items-center gap-2 text-xs mb-4">
              <div className="flex items-center gap-1 text-amber-500 font-semibold font-mono">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                <span className="text-slate-400">({product.reviewsCount})</span>
              </div>
              <span className="text-slate-300">•</span>
              <span className={`font-semibold ${product.inStock ? 'text-emerald-700' : 'text-rose-600'}`}>
                {product.inStock ? `✓ ${product.stockCount} en stock` : 'Agotado'}
              </span>
            </div>

            {/* Pricing Module */}
            <div className="p-3.5 bg-pink-50/60 border border-pink-200 rounded-2xl mb-4 flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#064e3b] font-mono">
                {settings.currencySymbol}{product.price.toFixed(2)}
              </span>
              {product.compareAtPrice && (
                <span className="text-sm text-slate-400 line-through font-mono">
                  {settings.currencySymbol}{product.compareAtPrice.toFixed(2)}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="bg-rose-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded">
                  -{discountPercent}%
                </span>
              )}
            </div>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Variante: <span className="text-[#064e3b] font-normal">{selectedColor?.name}</span>
                </label>
                <div className="flex items-center gap-2">
                  {product.colors.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedColor(c)}
                      className={`p-1 rounded-full border-2 transition-all ${
                        selectedColor?.name === c.name ? 'border-[#064e3b] scale-110' : 'border-transparent'
                      }`}
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-slate-300 block"
                        style={{ backgroundColor: c.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Note */}
            <div className="mb-4">
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Nota o Requisito Especial:
              </label>
              <input
                type="text"
                placeholder="Ej: Empaque regalo, para cosmetóloga..."
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                className="w-full bg-slate-50 border border-pink-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#064e3b]"
              />
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-3 mb-6">
              <label className="text-xs font-bold text-slate-800">Cantidad:</label>
              <div className="flex items-center border border-pink-200 rounded-xl bg-pink-50/50 text-xs">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 font-bold text-slate-600"
                >
                  -
                </button>
                <span className="px-3 py-1 font-bold font-mono text-[#064e3b]">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 font-bold text-slate-600"
                >
                  +
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {product.description}
            </p>
          </div>

          {/* Action CTAs Mobile Pinned */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  addToCart(product, {
                    color: selectedColor,
                    size: selectedSize,
                    customNotes,
                    quantity
                  });
                }}
                disabled={!product.inStock}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs h-12 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-95"
              >
                <ShoppingBag className="w-4 h-4 text-pink-300" />
                <span>Agregar</span>
              </button>

              <button
                onClick={handleDirectWhatsAppBuy}
                disabled={!product.inStock}
                className="w-full bg-[#064e3b] hover:bg-[#042f2e] text-white font-bold text-xs h-12 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-95"
              >
                <MessageCircle className="w-4 h-4 text-pink-300" />
                <span>Pedir WhatsApp 📲</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProductDetailModal: React.FC = () => {
  const { selectedProduct } = useStore();

  if (!selectedProduct) return null;

  return <ProductDetailContent product={selectedProduct} />;
};
