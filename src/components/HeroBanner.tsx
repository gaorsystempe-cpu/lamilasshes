import React from 'react';
import { ArrowRight, MessageCircle, Sparkles, ShieldCheck, Truck, Zap } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const HeroBanner: React.FC = () => {
  const { settings, setActiveCategory } = useStore();

  return (
    <section className="relative overflow-hidden my-6 mx-4 sm:mx-6 lg:mx-8">
      {/* Outer Blush Pink Frame inspired by the Canva template */}
      <div className="bg-[#fbcfe8]/70 p-4 sm:p-8 rounded-3xl border border-pink-300/80 shadow-md">
        {/* Inner White Luxury Product Card */}
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-pink-200/60 shadow-xl text-center max-w-4xl mx-auto flex flex-col items-center justify-center relative overflow-hidden">
          
          {/* Decorative Corner Accents */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#064e3b]/30 m-4 rounded-tl-lg pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#064e3b]/30 m-4 rounded-br-lg pointer-events-none" />

          {/* L'A MI Logo Square Box */}
          <div className="w-20 h-20 bg-[#fbcfe8] border-2 border-white rounded-xl shadow-md p-2 flex items-center justify-center mb-6">
            <div className="border border-[#064e3b]/40 w-full h-full rounded-lg flex items-center justify-center text-center p-1">
              <span className="font-heading text-sm font-bold text-[#064e3b] leading-tight tracking-tighter uppercase">
                L'A<br/>MI
              </span>
            </div>
          </div>

          {/* Main Display Headline from Template */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-heading text-[#064e3b] uppercase leading-tight mb-3">
            PRODUCT CATALOG
          </h1>

          {/* Horizontal Line Divider */}
          <div className="w-32 sm:w-48 h-[1.5px] bg-[#064e3b]/40 my-4" />

          {/* Brand Subtitle */}
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#064e3b] tracking-wide uppercase">
            LAMI LASHES
          </h2>
          <p className="text-xs sm:text-sm font-bold tracking-[0.25em] text-pink-600 uppercase font-sans-title mt-1 mb-6">
            Professional Care®
          </p>

          <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed mb-8">
            Catálogo oficial de productos profesionales para laminado de pestañas, cejas, sueros de keratina, Lash Botox y herramientas de precisión.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => {
                setActiveCategory('all');
                const catalogEl = document.getElementById('catalog-section');
                if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-[#064e3b] hover:bg-[#042f2e] text-white px-7 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-[#064e3b]/30 flex items-center gap-2 active:scale-95"
            >
              <span>Ver Catálogo Interactivo</span>
              <ArrowRight className="w-4 h-4 text-pink-300" />
            </button>

            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent('¡Hola LAMI LASHES! Vengo desde el catálogo web y deseo solicitar un pedido.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-pink-100 hover:bg-pink-200 text-[#064e3b] border border-pink-300 px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-[#064e3b]" />
              <span>Pedidos WhatsApp Directo</span>
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-8 pt-6 border-t border-pink-100 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#064e3b]" />
              <span>Envío Gratis desde {settings.currencySymbol}{settings.freeShippingThreshold}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#064e3b]" />
              <span>100% Productos Originales LAMI LASHES®</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
