import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  MessageCircle,
  Tag,
  Truck,
  Store,
  ShieldCheck,
  Check,
  CreditCard,
  MapPin,
  User,
  Phone,
  FileText
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
    cartSubtotal,
    cartDiscount,
    settings,
    submitOrderToWhatsApp,
    showToast
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  // Delivery Method: 'delivery' or 'pickup'
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');

  // Customer Checkout Details
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(
    settings.paymentMethods?.[0]?.name || 'Yape / Plin'
  );
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCartOpen) return null;

  const storeAddress = settings.address || 'Av. Primavera 120, Surco, Lima';

  // Calculate Shipping Fee based on Delivery Method
  const shippingFee = deliveryMethod === 'pickup'
    ? 0
    : (cartSubtotal >= settings.freeShippingThreshold || cartSubtotal === 0 ? 0 : settings.shippingFee);

  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + shippingFee);

  const freeShippingNeeded = Math.max(0, settings.freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, (cartSubtotal / settings.freeShippingThreshold) * 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    const res = applyCouponCode(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  const handleWhatsAppCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName || !customerPhone) {
      showToast('⚠️ Por favor ingresa tu Nombre y Teléfono');
      return;
    }

    if (deliveryMethod === 'delivery' && !customerAddress) {
      showToast('⚠️ Ingresa tu dirección para el envío a domicilio');
      return;
    }

    const finalAddress = deliveryMethod === 'pickup'
      ? `Recojo en Tienda LAMI LASHES® (${storeAddress})`
      : customerAddress;

    setIsSubmitting(true);
    try {
      const { whatsappUrl } = await submitOrderToWhatsApp({
        customerName,
        customerPhone,
        customerAddress: finalAddress,
        deliveryCity: deliveryCity || 'Lima',
        paymentMethod: `${paymentMethod} [${deliveryMethod === 'pickup' ? 'Recojo en Tienda' : 'Envío Delivery'}]`,
        notes: orderNotes
      });

      // Clear cart & close drawer after sending
      clearCart();
      setIsCartOpen(false);

      // Open WhatsApp window
      window.open(whatsappUrl, '_blank');
      showToast('📲 ¡Pedido confirmado! Abriendo WhatsApp...');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-pink-200">
          
          {/* Top App Header */}
          <div className="p-4 sm:p-5 bg-[#064e3b] text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-pink-300" />
              <h2 className="text-base font-bold font-heading">Tu Carrito LAMI LASHES®</h2>
              <span className="text-xs bg-pink-300 text-[#064e3b] font-extrabold px-2 py-0.5 rounded-full font-mono">
                {cart.reduce((s, i) => s + i.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-pink-200 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
            
            {/* Free Shipping Progress Bar (Delivery mode) */}
            {deliveryMethod === 'delivery' && (
              <div className="bg-pink-50 border border-pink-200 rounded-2xl p-3 text-xs text-slate-700">
                <div className="flex items-center justify-between mb-1 font-medium">
                  <span className="flex items-center gap-1.5 text-[#064e3b] font-bold">
                    <Truck className="w-4 h-4 text-pink-600" />
                    {freeShippingNeeded === 0
                      ? '¡Felicidades! Tienes ENVÍO GRATIS 🎉'
                      : `Faltan ${settings.currencySymbol}${freeShippingNeeded.toFixed(2)} para Envío GRATIS`}
                  </span>
                  <span className="font-mono text-pink-600 font-bold">{Math.round(freeShippingProgress)}%</span>
                </div>
                <div className="w-full bg-pink-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#064e3b] h-2 transition-all duration-500 rounded-full"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Cart Items List */}
            {cart.length > 0 ? (
              <div className="space-y-3 divide-y divide-pink-100">
                {cart.map(item => (
                  <div key={item.id} className="pt-3 first:pt-0 flex gap-3 items-center">
                    <img
                      src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&auto=format&fit=crop&q=80'}
                      alt={item.product.title}
                      className="w-16 h-16 rounded-xl object-cover bg-slate-100 border border-pink-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {item.product.title}
                      </h4>

                      <div className="text-[11px] text-slate-500 mt-0.5 flex flex-wrap gap-1">
                        {item.selectedColor && (
                          <span className="inline-flex items-center gap-1">
                            Color: <span className="font-medium text-[#064e3b]">{item.selectedColor.name}</span>
                          </span>
                        )}
                        {item.selectedSize && (
                          <span>| Talla: <span className="font-medium text-[#064e3b]">{item.selectedSize}</span></span>
                        )}
                      </div>

                      {item.customNotes && (
                        <p className="text-[10px] text-pink-700 bg-pink-50 px-1.5 py-0.5 rounded mt-1 truncate">
                          Nota: {item.customNotes}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-pink-200 rounded-lg bg-pink-50/50 text-xs">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-0.5 text-slate-600 hover:bg-pink-200 rounded-l font-bold"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 font-bold font-mono text-[#064e3b]">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-0.5 text-slate-600 hover:bg-pink-200 rounded-r font-bold"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <span className="text-xs font-extrabold text-[#064e3b] font-mono">
                          {settings.currencySymbol}{(item.unitPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                      title="Quitar del carrito"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-40 text-[#064e3b]" />
                <p className="text-sm font-bold text-slate-700">Tu carrito está vacío</p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                  Puedes seleccionar varios productos de nuestro catálogo y agregarlos al carrito antes de confirmar tu pedido.
                </p>
              </div>
            )}

            {cart.length > 0 && (
              <>
                {/* Coupon Code Section */}
                <div className="pt-3 border-t border-pink-200">
                  <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-pink-600" />
                    <span>¿Tienes un Cupón de Descuento?</span>
                  </label>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-300 px-3 py-2 rounded-xl text-xs">
                      <span className="font-bold text-emerald-800">
                        ✓ Cupón {appliedCoupon.code} ({appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.discountValue}%` : `${settings.currencySymbol}${appliedCoupon.discountValue}`})
                      </span>
                      <button
                        onClick={removeCoupon}
                        className="text-xs text-rose-600 hover:underline font-bold"
                      >
                        Quitar
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Ej: LAMI10"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="flex-1 uppercase bg-pink-50/50 border border-pink-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-[#064e3b] font-mono"
                      />
                      <button
                        type="submit"
                        className="bg-[#064e3b] text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-colors shrink-0"
                      >
                        Aplicar
                      </button>
                    </form>
                  )}
                  {couponError && <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>}
                </div>

                {/* Delivery Method Selection Toggle */}
                <div className="pt-3 border-t border-pink-200 space-y-2">
                  <label className="block text-xs font-bold text-[#064e3b] uppercase tracking-wider">
                    Método de Entrega:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('delivery')}
                      className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                        deliveryMethod === 'delivery'
                          ? 'border-[#064e3b] bg-pink-50/80 shadow-xs ring-1 ring-[#064e3b]'
                          : 'border-pink-200 bg-white text-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Truck className="w-4 h-4 text-[#064e3b]" />
                        <span className="text-[10px] font-bold text-[#064e3b] bg-pink-200 px-1.5 py-0.2 rounded">
                          {shippingFee === 0 ? 'GRATIS' : `${settings.currencySymbol}${settings.shippingFee}`}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-slate-900">Envío / Delivery</span>
                      <span className="text-[10px] text-slate-500">Entrega a domicilio</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('pickup')}
                      className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                        deliveryMethod === 'pickup'
                          ? 'border-[#064e3b] bg-pink-50/80 shadow-xs ring-1 ring-[#064e3b]'
                          : 'border-pink-200 bg-white text-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Store className="w-4 h-4 text-[#064e3b]" />
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                          GRATIS
                        </span>
                      </div>
                      <span className="text-xs font-bold text-slate-900">Recojo en Tienda</span>
                      <span className="text-[10px] text-slate-500 truncate">{storeAddress.split(',')[0]}</span>
                    </button>
                  </div>
                </div>

                {/* Customer Details Form */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-[#064e3b]" />
                    <span>Datos del Cliente</span>
                  </h3>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Laura Morales"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-pink-50/40 border border-pink-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#064e3b]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Teléfono / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="987 654 321"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full bg-pink-50/40 border border-pink-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#064e3b] font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Ciudad / Distrito
                      </label>
                      <input
                        type="text"
                        placeholder="Lima, Surco"
                        value={deliveryCity}
                        onChange={(e) => setDeliveryCity(e.target.value)}
                        className="w-full bg-pink-50/40 border border-pink-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#064e3b]"
                      />
                    </div>
                  </div>

                  {deliveryMethod === 'delivery' ? (
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Dirección de Entrega Exacta *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Av. Primavera 123, Dpto 402"
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        className="w-full bg-pink-50/40 border border-pink-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#064e3b]"
                      />
                    </div>
                  ) : (
                    <div className="p-3 bg-pink-50 border border-pink-200 rounded-xl text-xs text-slate-700">
                      <p className="font-bold text-[#064e3b] mb-0.5">📍 Dirección de Tienda LAMI LASHES®:</p>
                      <p className="text-[11px] leading-snug">{storeAddress}</p>
                      <p className="text-[10px] text-slate-500 mt-1">Horario: {settings.openingHours || 'Lun - Sáb: 9am - 7pm'}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Método de Pago Preferido:
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full bg-pink-50/40 border border-pink-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#064e3b] font-medium"
                    >
                      {(settings.paymentMethods || []).map(pm => (
                        <option key={pm.id} value={pm.name}>{pm.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Notas Adicionales (Opcional):
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Empaque listo para regalo, llamar al llegar..."
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      className="w-full bg-pink-50/40 border border-pink-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#064e3b]"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Subtotal & WhatsApp Confirmation */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 bg-pink-50/80 border-t border-pink-200 space-y-3">
              {/* Financial Breakdown */}
              <div className="space-y-1 text-xs text-slate-600 font-mono">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{settings.currencySymbol}{cartSubtotal.toFixed(2)}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-pink-700 font-bold">
                    <span>Descuento:</span>
                    <span>-{settings.currencySymbol}{cartDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Envío / Delivery:</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-emerald-700 font-extrabold">GRATIS</span>
                    ) : (
                      `${settings.currencySymbol}${shippingFee.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-[#064e3b] pt-2 border-t border-pink-200">
                  <span>TOTAL A PAGAR:</span>
                  <span className="font-mono">{settings.currencySymbol}{cartTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Confirm & Redirect to WhatsApp */}
              <button
                onClick={handleWhatsAppCheckout}
                disabled={isSubmitting}
                className="w-full bg-[#064e3b] hover:bg-[#042f2e] text-white font-bold text-xs sm:text-sm py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                <MessageCircle className="w-5 h-5 text-pink-300" />
                <span>Confirmar Pedido por WhatsApp 📲</span>
              </button>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span className="flex items-center gap-1 text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#064e3b]" />
                  Atención directa & stock reservado
                </span>
                <button
                  onClick={clearCart}
                  className="text-slate-400 hover:text-rose-600 transition-colors"
                >
                  Vaciar Carrito
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
