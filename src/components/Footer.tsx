import React from 'react';
import { MessageCircle, ShieldCheck, Truck, Clock, MapPin, Mail, Phone } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { settings, setActiveCategory } = useStore();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xl font-bold text-white tracking-tight">
              <span className="bg-emerald-600 text-white text-xs font-extrabold px-2.5 py-1 rounded-lg">
                NEXO
              </span>
              <span className="font-heading">{settings.storeName}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {settings.tagline}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Garantía Oficial & Atención Directa</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-heading">
              Categorías
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveCategory('Relojes & Accesorios')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Relojes & Accesorios
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveCategory('Calzado Urbano')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Calzado Urbano
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveCategory('Cuero & Mochilas')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Cuero & Mochilas
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveCategory('Audio & Gadgets HD')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Audio & Gadgets HD
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Hours */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-heading">
              Contacto & Atención
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{settings.openingHours}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{settings.contactEmail}</span>
              </li>
            </ul>
          </div>

          {/* Col 4: WhatsApp Direct */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-heading">
              Pedidos Directos
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              Atención inmediata y personalizada para resolver tus dudas o tomar tu pedido.
            </p>
            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Chatear por WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Bottom Copyright & Payment Methods */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {settings.storeName}. Todos los derechos reservados.</p>
          <div className="flex items-center gap-3">
            <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-1 rounded font-mono">Yape / Plin</span>
            <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-1 rounded font-mono">BCP / BBVA</span>
            <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-1 rounded font-mono">Contra Entrega</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
