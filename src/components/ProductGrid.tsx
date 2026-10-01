import React from 'react';
import { ProductCard } from './ProductCard';
import { useStore } from '../context/StoreContext';
import { SearchX, Filter, RotateCcw } from 'lucide-react';

export const ProductGrid: React.FC = () => {
  const {
    products,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    selectedTag,
    setSelectedTag,
    priceRange,
    setPriceRange,
    sortBy,
    inStockOnly
  } = useStore();

  const normActive = activeCategory.trim().toLowerCase();

  // Filter products according to active filters
  let filtered = products.filter(product => {
    // Normalized category match
    if (normActive !== 'all') {
      const normProdCat = product.category.trim().toLowerCase();
      if (normProdCat !== normActive) {
        return false;
      }
    }

    // Search query match
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = product.title.toLowerCase().includes(q);
      const matchCategory = product.category.toLowerCase().includes(q);
      const matchDescription = product.description.toLowerCase().includes(q);
      const matchTags = product.tags.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchCategory && !matchDescription && !matchTags) {
        return false;
      }
    }

    // Tag filter
    if (selectedTag !== 'all') {
      if (!product.tags.includes(selectedTag)) {
        return false;
      }
    }

    // Price range
    if (product.price > priceRange[1]) {
      return false;
    }

    // Stock
    if (inStockOnly && !product.inStock) {
      return false;
    }

    return true;
  });

  // Sorting
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    // Default featured
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#064e3b] tracking-tight flex items-center gap-2">
            <span>{activeCategory === 'all' ? 'Catálogo Completo' : activeCategory}</span>
            <span className="text-xs font-mono font-extrabold text-[#064e3b] bg-pink-200 px-2.5 py-0.5 rounded-full">
              {filtered.length} {filtered.length === 1 ? 'producto' : 'productos'}
            </span>
          </h2>
          {searchQuery && (
            <p className="text-xs text-slate-500 mt-1">
              Búsqueda: <span className="font-semibold text-slate-800">"{searchQuery}"</span>
            </p>
          )}
        </div>

        {/* Clear Filters CTA if filtered category or tag is active */}
        {(normActive !== 'all' || selectedTag !== 'all' || searchQuery) && (
          <button
            onClick={() => {
              setActiveCategory('all');
              setSelectedTag('all');
              setSearchQuery('');
            }}
            className="text-xs text-pink-700 bg-pink-100 hover:bg-pink-200 font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Ver Todo el Catálogo</span>
          </button>
        )}
      </div>

      {/* Grid of Product Cards */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty Search Results */
        <div className="bg-white border border-pink-200 rounded-3xl p-10 text-center max-w-lg mx-auto my-8 shadow-sm">
          <SearchX className="w-12 h-12 text-pink-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1 font-heading">No se encontraron productos</h3>
          <p className="text-xs text-slate-500 mb-5 leading-relaxed">
            No hay productos registrados en esta categoría o con los filtros aplicados.
          </p>
          <button
            onClick={() => {
              setActiveCategory('all');
              setSelectedTag('all');
              setSearchQuery('');
              setPriceRange([0, 2000]);
            }}
            className="bg-[#064e3b] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Mostrar Todos los Productos</span>
          </button>
        </div>
      )}
    </section>
  );
};
