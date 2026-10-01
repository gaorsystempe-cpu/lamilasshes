import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Heart,
  Settings,
  PhoneCall,
  X,
  Sparkle
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Header: React.FC = () => {
  const {
    settings,
    cart,
    wishlist,
    setIsCartOpen,
    searchQuery,
    setSearchQuery,
    setIsAdminOpen,
    isAdminAuthenticated,
    activeCategory,
    setActiveCategory
  } = useStore();

  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const normActive = activeCategory.trim().toLowerCase();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-pink-200/80 shadow-xs transition-all">
      {/* Top Announcement Bar in LAMI LASHES Green */}
      {settings.topAnnouncementBar?.active && (
        <div className="bg-[#064e3b] text-pink-100 text-xs font-medium py-2 px-4 text-center tracking-wide flex items-center justify-center gap-2">
          <Sparkle className="w-3.5 h-3.5 text-pink-300" />
          <span>{settings.topAnnouncementBar.text}</span>
          <a
            href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-pink-300 transition-colors shrink-0 whitespace-nowrap hidden sm:inline font-semibold"
          >
            Atención WhatsApp 📲
          </a>
        </div>
      )}

      {/* Primary Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* LAMI LASHES Brand Monogram & Wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setActiveCategory('all');
            setSearchQuery('');
          }}
          className="flex items-center gap-3 text-slate-900 hover:opacity-90 transition-opacity shrink-0"
        >
          {/* LAMI Monogram Square Box */}
          <div className="w-11 h-11 bg-[#fbcfe8] border-2 border-white rounded-lg flex items-center justify-center shadow-sm p-1 text-center shrink-0">
            <span className="font-heading text-[11px] font-bold text-[#064e3b] leading-tight tracking-tighter uppercase">
              L'A<br/>MI
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-extrabold font-heading tracking-wider text-[#064e3b] leading-none">
              LAMI LASHES
            </span>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-pink-600 font-sans-title mt-0.5">
              Professional Care®
            </span>
          </div>
        </a>

        {/* Clean navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-bold uppercase tracking-wider text-slate-700">
          <button
            onClick={() => {
              setActiveCategory('all');
              setSearchQuery('');
            }}
            className={`transition-colors whitespace-nowrap ${
              normActive === 'all' && !searchQuery
                ? 'text-[#064e3b] font-extrabold border-b-2 border-[#064e3b] pb-0.5'
                : 'hover:text-[#064e3b]'
            }`}
          >
            Catálogo
          </button>
          <button
            onClick={() => setActiveCategory('Laminado de Pestañas')}
            className={`transition-colors whitespace-nowrap ${
              normActive === 'laminado de pestañas'
                ? 'text-[#064e3b] font-extrabold border-b-2 border-[#064e3b] pb-0.5'
                : 'hover:text-[#064e3b]'
            }`}
          >
            Lash Lift
          </button>
          <button
            onClick={() => setActiveCategory('Cuidado de Cejas')}
            className={`transition-colors whitespace-nowrap ${
              normActive === 'cuidado de cejas'
                ? 'text-[#064e3b] font-extrabold border-b-2 border-[#064e3b] pb-0.5'
                : 'hover:text-[#064e3b]'
            }`}
          >
            Cejas
          </button>
          <button
            onClick={() => setActiveCategory('Sueros & Keratina')}
            className={`transition-colors whitespace-nowrap ${
              normActive === 'sueros & keratina'
                ? 'text-[#064e3b] font-extrabold border-b-2 border-[#064e3b] pb-0.5'
                : 'hover:text-[#064e3b]'
            }`}
          >
            Sueros
          </button>
        </nav>

        {/* Actions & Shopping Cart */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search */}
          <div className="relative">
            {isSearchExpanded ? (
              <div className="flex items-center bg-pink-50/80 rounded-xl px-3 py-1.5 w-48 sm:w-60 border border-pink-200 transition-all">
                <Search className="w-4 h-4 text-pink-400 shrink-0 mr-2" />
                <input
                  type="text"
                  placeholder="Buscar productos Lami..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="bg-transparent border-none outline-none text-xs text-slate-800 w-full"
                />
                <button
                  onClick={() => {
                    setIsSearchExpanded(false);
                    setSearchQuery('');
                  }}
                  className="text-pink-400 hover:text-pink-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSearchExpanded(true)}
                className="p-2 text-slate-600 hover:text-[#064e3b] hover:bg-pink-50 rounded-xl transition-colors"
                title="Buscar productos"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Wishlist button */}
          <button
            onClick={() => setActiveCategory('all')}
            className="p-2 text-slate-600 hover:text-rose-600 hover:bg-pink-50 rounded-xl transition-colors relative"
            title="Mis Favoritos"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Admin Toggle */}
          <button
            onClick={() => setIsAdminOpen(true)}
            className={`p-2 rounded-xl transition-colors flex items-center gap-1 text-xs font-semibold ${
              isAdminAuthenticated
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'text-slate-600 hover:text-[#064e3b] hover:bg-pink-50'
            }`}
            title="Panel Administrativo"
          >
            <Settings className="w-5 h-5" />
            <span className="hidden md:inline">
              {isAdminAuthenticated ? 'Admin Activo' : 'Admin'}
            </span>
          </button>

          {/* Shopping Cart Button in LAMI Green */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="bg-[#064e3b] hover:bg-[#042f2e] text-white px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm active:scale-95 whitespace-nowrap"
          >
            <ShoppingBag className="w-4 h-4 text-pink-300" />
            <span className="hidden sm:inline">Carrito</span>
            <span className="bg-pink-300 text-[#064e3b] text-xs font-extrabold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
              {totalCartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
