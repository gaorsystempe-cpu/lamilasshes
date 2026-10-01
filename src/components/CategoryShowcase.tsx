import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, Layers, ArrowRight, Check } from 'lucide-react';

export const CategoryShowcase: React.FC = () => {
  const { categories, activeCategory, setActiveCategory, products } = useStore();

  const normActive = activeCategory.trim().toLowerCase();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold font-heading text-[#064e3b] uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-pink-600" />
            <span>Colecciones & Categorías Especializadas</span>
          </h2>
          <p className="text-xs text-slate-500">
            Explora las líneas de productos profesionales LAMI LASHES®
          </p>
        </div>

        {normActive !== 'all' && (
          <button
            onClick={() => setActiveCategory('all')}
            className="text-xs text-[#064e3b] font-extrabold bg-pink-100 hover:bg-pink-200 px-3 py-1.5 rounded-xl transition-all border border-pink-200 flex items-center gap-1 shrink-0"
          >
            <span>Ver Todo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Visual Category Showcase Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* All Products Visual Card */}
        <div
          onClick={() => {
            setActiveCategory('all');
            const catalogEl = document.getElementById('catalog-section');
            if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`relative group overflow-hidden rounded-2xl cursor-pointer border-2 transition-all duration-300 shadow-sm hover:shadow-md ${
            normActive === 'all'
              ? 'border-[#064e3b] ring-4 ring-pink-300 scale-[1.02]'
              : 'border-pink-200 hover:border-[#064e3b]'
          }`}
        >
          <div className="h-28 sm:h-36 bg-gradient-to-tr from-[#064e3b] via-[#042f2e] to-pink-900 p-4 flex flex-col justify-between relative overflow-hidden text-white">
            <div className="flex justify-between items-start z-10">
              <span className="text-[10px] font-extrabold font-mono uppercase bg-pink-300 text-[#064e3b] px-2 py-0.5 rounded-full shadow-xs">
                {products.length} productos
              </span>
              {normActive === 'all' && (
                <span className="bg-white text-[#064e3b] p-1 rounded-full shadow-xs">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </span>
              )}
            </div>

            <div className="z-10">
              <h3 className="text-xs sm:text-sm font-extrabold font-heading uppercase text-white leading-tight">
                Catálogo Completo
              </h3>
              <p className="text-[10px] text-pink-200 line-clamp-1 mt-0.5">
                Ver todos los productos LAMI LASHES®
              </p>
            </div>

            {/* Decorative Monogram Glow */}
            <div className="absolute -bottom-4 -right-4 text-pink-500/20 font-heading font-black text-6xl select-none pointer-events-none">
              L'A
            </div>
          </div>
        </div>

        {/* Dynamic Categories */}
        {categories.map((cat) => {
          const normCat = cat.name.trim().toLowerCase();
          const isActive = normActive === normCat || normActive === cat.id.toLowerCase() || normActive === cat.slug.toLowerCase();
          const count = products.filter(p => p.category.trim().toLowerCase() === normCat).length;

          return (
            <div
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.name);
                const catalogEl = document.getElementById('catalog-section');
                if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`relative group overflow-hidden rounded-2xl cursor-pointer border-2 transition-all duration-300 shadow-sm hover:shadow-md ${
                isActive
                  ? 'border-[#064e3b] ring-4 ring-pink-300 scale-[1.02]'
                  : 'border-pink-200 hover:border-[#064e3b]'
              }`}
            >
              <div className="h-28 sm:h-36 relative p-4 flex flex-col justify-between overflow-hidden">
                {/* Background Image with Dark Gradient Overlay */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-slate-900/30" />

                {/* Top Badge */}
                <div className="flex justify-between items-start z-10">
                  <span className="text-[10px] font-extrabold font-mono uppercase bg-white/90 text-[#064e3b] px-2 py-0.5 rounded-full shadow-xs backdrop-blur-xs">
                    {count} items
                  </span>
                  {isActive && (
                    <span className="bg-[#064e3b] text-white p-1 rounded-full shadow-xs border border-pink-300">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  )}
                </div>

                {/* Bottom Category Info */}
                <div className="z-10">
                  <h3 className="text-xs sm:text-sm font-extrabold font-heading text-white leading-tight drop-shadow-sm">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] text-pink-200 line-clamp-1 mt-0.5 font-medium">
                    {cat.description || 'Productos profesionales'}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
