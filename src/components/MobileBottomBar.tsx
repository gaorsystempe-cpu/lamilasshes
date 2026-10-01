import React, { useState } from 'react';
import { Home, Grid, ShoppingBag, Settings, Search, X, ChevronRight, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const MobileBottomBar: React.FC = () => {
  const {
    cart,
    categories,
    activeCategory,
    setActiveCategory,
    setIsCartOpen,
    setIsAdminOpen,
    isAdminAuthenticated,
    setSearchQuery,
    products
  } = useStore();

  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(12);
      } catch (e) {
        // Ignore if unsupported
      }
    }
  };

  const normActive = activeCategory.trim().toLowerCase();

  return (
    <>
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-pink-200/80 shadow-lg px-2 pb-safe">
        <div className="max-w-md mx-auto grid grid-cols-4 items-center h-16">
          {/* Tab 1: Inicio Catálogo */}
          <button
            onClick={() => {
              triggerHaptic();
              setActiveCategory('all');
              setSearchQuery('');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center py-1 transition-all ${
              normActive === 'all'
                ? 'text-[#064e3b] font-extrabold scale-105'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight mt-1">Inicio</span>
          </button>

          {/* Tab 2: Categorías Sheet Trigger */}
          <button
            onClick={() => {
              triggerHaptic();
              setIsCategorySheetOpen(true);
            }}
            className={`flex flex-col items-center justify-center py-1 transition-all ${
              normActive !== 'all'
                ? 'text-[#064e3b] font-extrabold scale-105'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Grid className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight mt-1">Categorías</span>
          </button>

          {/* Tab 3: Carrito con Badge */}
          <button
            onClick={() => {
              triggerHaptic();
              setIsCartOpen(true);
            }}
            className="flex flex-col items-center justify-center py-1 text-slate-400 hover:text-[#064e3b] relative transition-all"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-pink-500 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {totalCartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium tracking-tight mt-1">Carrito</span>
          </button>

          {/* Tab 4: Admin Panel Mobile View */}
          <button
            onClick={() => {
              triggerHaptic();
              setIsAdminOpen(true);
            }}
            className={`flex flex-col items-center justify-center py-1 transition-all ${
              isAdminAuthenticated
                ? 'text-amber-600 font-extrabold'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight mt-1">
              {isAdminAuthenticated ? 'Admin ★' : 'Admin'}
            </span>
          </button>
        </div>
      </div>

      {/* Category Mobile Selector Sheet */}
      {isCategorySheetOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex flex-col justify-end animate-fadeIn">
          <div className="flex-1" onClick={() => setIsCategorySheetOpen(false)} />
          <div className="w-full bg-white rounded-t-3xl shadow-2xl border-t border-pink-200 overflow-hidden flex flex-col max-h-[85vh] animate-slideUp">
            <div className="pt-3 pb-1 cursor-grab" onClick={() => setIsCategorySheetOpen(false)}>
              <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto" />
            </div>

            <div className="px-5 py-3 border-b border-pink-100 flex items-center justify-between">
              <h3 className="text-base font-extrabold font-heading text-[#064e3b]">
                Seleccionar Categoría
              </h3>
              <button
                onClick={() => setIsCategorySheetOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-2 overflow-y-auto pb-safe">
              {/* All Category Button */}
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setIsCategorySheetOpen(false);
                  const catalogEl = document.getElementById('catalog-section');
                  if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  normActive === 'all'
                    ? 'border-[#064e3b] bg-pink-50 font-extrabold text-[#064e3b]'
                    : 'border-pink-100 text-slate-800 hover:bg-pink-50/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#064e3b] text-white flex items-center justify-center text-xs font-bold font-heading">
                    ALL
                  </div>
                  <div>
                    <p className="text-xs font-bold">Todos los Productos</p>
                    <p className="text-[10px] text-slate-400 font-mono">{products.length} ítems en total</p>
                  </div>
                </div>
                {normActive === 'all' && <Check className="w-5 h-5 text-[#064e3b]" />}
              </button>

              {/* Individual Categories */}
              {categories.map((cat) => {
                const normCat = cat.name.trim().toLowerCase();
                const isActive = normActive === normCat;
                const count = products.filter(p => p.category.trim().toLowerCase() === normCat).length;

                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.name);
                      setIsCategorySheetOpen(false);
                      const catalogEl = document.getElementById('catalog-section');
                      if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      isActive
                        ? 'border-[#064e3b] bg-pink-50 font-extrabold text-[#064e3b] ring-1 ring-[#064e3b]'
                        : 'border-pink-100 text-slate-800 hover:bg-pink-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-10 h-10 rounded-xl object-cover shrink-0 border border-pink-200"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate">{cat.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{count} productos</p>
                      </div>
                    </div>
                    {isActive ? (
                      <Check className="w-5 h-5 text-[#064e3b] shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
