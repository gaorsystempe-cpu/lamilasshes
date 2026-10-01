import React, { useState } from 'react';
import { SlidersHorizontal, ArrowUpDown, Check, Filter, RotateCcw, Search } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CategoryFilterBar: React.FC = () => {
  const {
    categories,
    activeCategory,
    setActiveCategory,
    selectedTag,
    setSelectedTag,
    sortBy,
    setSortBy,
    inStockOnly,
    setInStockOnly,
    priceRange,
    setPriceRange,
    searchQuery,
    setSearchQuery,
    settings,
    products
  } = useStore();

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Collect all unique tags
  const allTags = Array.from(
    new Set(products.flatMap(p => p.tags || []))
  );

  const resetFilters = () => {
    setActiveCategory('all');
    setSelectedTag('all');
    setSearchQuery('');
    setPriceRange([0, 2000]);
    setSortBy('featured');
    setInStockOnly(false);
  };

  const normActive = activeCategory.trim().toLowerCase();

  return (
    <div id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      {/* Category Tabs (Interactive Segmented Buttons) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none border-b border-pink-200">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-2 ${
            normActive === 'all'
              ? 'bg-[#064e3b] text-white shadow-md ring-2 ring-pink-300 scale-102'
              : 'bg-white text-slate-700 hover:bg-pink-50 border border-pink-200'
          }`}
        >
          <span>Todos los Productos</span>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${normActive === 'all' ? 'bg-pink-300 text-[#064e3b] font-extrabold' : 'bg-pink-100 text-[#064e3b]'}`}>
            {products.length}
          </span>
        </button>

        {categories.map((cat) => {
          const normCat = cat.name.trim().toLowerCase();
          const isActive = normActive === normCat || normActive === cat.id.toLowerCase() || normActive === cat.slug.toLowerCase();
          const count = products.filter(p => p.category.trim().toLowerCase() === normCat).length;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-2 ${
                isActive
                  ? 'bg-[#064e3b] text-white shadow-md ring-2 ring-pink-300 scale-102'
                  : 'bg-white text-slate-700 hover:bg-pink-50 border border-pink-200'
              }`}
            >
              <span>{cat.name}</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${isActive ? 'bg-pink-300 text-[#064e3b] font-extrabold' : 'bg-pink-100 text-[#064e3b]'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Secondary Controls Bar: Tags, Price, Sort & Filter Drawer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
        {/* Quick Tag Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-slate-400 font-medium mr-1 hidden sm:inline">Etiquetas:</span>
          <button
            onClick={() => setSelectedTag('all')}
            className={`px-2.5 py-1 rounded-xl font-bold transition-colors whitespace-nowrap ${
              selectedTag === 'all'
                ? 'bg-pink-200 text-[#064e3b]'
                : 'text-slate-600 hover:bg-pink-50'
            }`}
          >
            Todas
          </button>
          {allTags.slice(0, 5).map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? 'all' : tag)}
              className={`px-2.5 py-1 rounded-xl font-bold transition-colors whitespace-nowrap ${
                selectedTag === tag
                  ? 'bg-[#064e3b] text-white shadow-xs'
                  : 'text-slate-600 bg-pink-50 hover:bg-pink-100 border border-pink-100'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Right side: Sort Dropdown & Filter Trigger */}
        <div className="flex items-center gap-2 ml-auto">
          {/* In Stock Toggle */}
          <label className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer bg-white border border-pink-200 px-3 py-1.5 rounded-xl hover:bg-pink-50 transition-colors">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="accent-[#064e3b] rounded text-[#064e3b]"
            />
            <span>Solo En Stock</span>
          </label>

          {/* Sort Selector */}
          <div className="relative flex items-center bg-white border border-pink-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-bold">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#064e3b] mr-2 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent border-none outline-none font-bold cursor-pointer pr-2 text-slate-800"
            >
              <option value="featured">Destacados primero</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="rating">Mejor Valorados</option>
              <option value="newest">Más Recientes</option>
            </select>
          </div>

          {/* Filter Modal Drawer Button */}
          <button
            onClick={() => setIsFilterModalOpen(!isFilterModalOpen)}
            className="flex items-center gap-1.5 bg-white border border-pink-200 hover:border-[#064e3b] text-[#064e3b] text-xs font-bold px-3 py-1.5 rounded-xl transition-colors shadow-2xs"
          >
            <Filter className="w-3.5 h-3.5 text-[#064e3b]" />
            <span>Filtros</span>
          </button>

          {/* Reset Filters */}
          {(normActive !== 'all' || selectedTag !== 'all' || searchQuery || inStockOnly || priceRange[1] < 2000) && (
            <button
              onClick={resetFilters}
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-pink-50 transition-colors"
              title="Restablecer Filtros"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Expandable Advanced Filters Drawer */}
      {isFilterModalOpen && (
        <div className="mt-4 p-4 bg-white border border-pink-200 rounded-2xl shadow-lg transition-all animate-fadeIn">
          <div className="flex items-center justify-between border-b border-pink-100 pb-3 mb-4">
            <h3 className="text-sm font-bold text-[#064e3b] flex items-center gap-2 font-heading">
              <SlidersHorizontal className="w-4 h-4 text-[#064e3b]" />
              <span>Filtros Avanzados</span>
            </h3>
            <button
              onClick={() => setIsFilterModalOpen(false)}
              className="text-xs text-slate-500 hover:text-slate-800 underline"
            >
              Cerrar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            {/* Price Range Slider */}
            <div>
              <label className="block font-bold text-slate-800 mb-2">
                Rango de Precio Máximo: <span className="text-[#064e3b] font-mono font-extrabold">{settings.currencySymbol}{priceRange[1]}</span>
              </label>
              <input
                type="range"
                min="30"
                max="2000"
                step="25"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-full accent-[#064e3b] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                <span>{settings.currencySymbol}30</span>
                <span>{settings.currencySymbol}2,000+</span>
              </div>
            </div>

            {/* Tags Selection */}
            <div>
              <label className="block font-bold text-slate-800 mb-2">Filtrar por Etiqueta:</label>
              <div className="flex flex-wrap gap-1.5">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(selectedTag === tag ? 'all' : tag)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                      selectedTag === tag
                        ? 'bg-[#064e3b] text-white'
                        : 'bg-pink-50 text-slate-700 hover:bg-pink-100'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-col justify-between">
              <label className="block font-bold text-slate-800 mb-2">Disponibilidad:</label>
              <label className="flex items-center gap-2 text-slate-700 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="accent-[#064e3b] rounded"
                />
                <span>Mostrar solo productos en stock</span>
              </label>

              <button
                onClick={resetFilters}
                className="mt-4 w-full bg-pink-50 hover:bg-pink-100 text-[#064e3b] py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-pink-200"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restablecer Filtros</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
