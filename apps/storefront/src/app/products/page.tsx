'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal, X } from 'lucide-react';
import { ProductGrid } from '@/components/product/ProductGrid';
import { FilterSidebar } from '@/components/product/FilterSidebar';
import { SortDropdown } from '@/components/product/SortDropdown';
import { mockProducts } from '@/lib/mockData';
import type { FilterState } from '@/types';

const DEFAULT_FILTERS: FilterState = {
  categories: [],
  brands: [],
  priceMin: undefined,
  priceMax: undefined,
  ratings: undefined,
  sortBy: 'recommended',
  page: 1,
};

function ProductsContent() {
  const searchParams = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [filters, setFilters] = useState<FilterState>(() => {
    const category = searchParams.get('category');
    return {
      ...DEFAULT_FILTERS,
      categories: category ? [category] : [],
    };
  });

  const searchQuery = searchParams.get('search') || '';

  // Filter products client-side using mock data
  const filteredProducts = mockProducts.filter((product) => {
    if (filters.categories.length > 0 && !filters.categories.includes(product.category.slug)) {
      return false;
    }
    if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
      return false;
    }
    const effectivePrice = product.discountPrice ?? product.price;
    if (filters.priceMin !== undefined && effectivePrice < filters.priceMin) return false;
    if (filters.priceMax !== undefined && effectivePrice > filters.priceMax) return false;
    if (filters.ratings && (product.averageRating ?? 0) < filters.ratings) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (
        !product.name.toLowerCase().includes(q) &&
        !product.brand.toLowerCase().includes(q) &&
        !product.description.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    return true;
  });

  // Sort
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filters.sortBy) {
      case 'price_asc':
        return (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price);
      case 'price_desc':
        return (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price);
      case 'rating':
        return (b.averageRating ?? 0) - (a.averageRating ?? 0);
      case 'newest':
        return b.id.localeCompare(a.id);
      case 'discount': {
        const discA = a.discountPrice ? ((a.price - a.discountPrice) / a.price) * 100 : 0;
        const discB = b.discountPrice ? ((b.price - b.discountPrice) / b.price) * 100 : 0;
        return discB - discA;
      }
      default:
        return 0;
    }
  });

  const handleFilterChange = (updated: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const activeCategory = filters.categories[0];
  const pageTitle = activeCategory
    ? activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)
    : searchQuery
    ? `Search: "${searchQuery}"`
    : 'All Products';

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 mb-4">
        <span>Home</span>
        <span className="mx-2">/</span>
        <span className="font-medium text-gray-800">{pageTitle}</span>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{pageTitle}</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {sortedProducts.length} items
          </p>
        </div>

        <div className="flex items-center gap-3">
          <SortDropdown
            value={filters.sortBy}
            onChange={(v) => handleFilterChange({ sortBy: v, page: 1 })}
          />
          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden flex items-center gap-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-md px-3 py-2 hover:border-gray-400 transition-colors"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {(filters.categories.length + filters.brands.length) > 0 && (
              <span className="bg-[#ff3f6c] text-white text-xs rounded-full px-1.5 py-0.5">
                {filters.categories.length + filters.brands.length}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </aside>

        {/* Products */}
        <main className="flex-1 min-w-0">
          <ProductGrid products={sortedProducts} columns={3} />
        </main>
      </div>

      {/* Mobile Filter Drawer */}
      {showMobileFilters && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 p-5 overflow-y-auto lg:hidden animate-slide-in-right">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900">Filters</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
            <button
              onClick={() => setShowMobileFilters(false)}
              className="w-full mt-6 bg-[#ff3f6c] text-white font-semibold py-3 rounded-lg hover:bg-[#e6385f] transition-colors"
            >
              Apply Filters ({sortedProducts.length} items)
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="max-w-screen-xl mx-auto px-4 py-20 text-center text-gray-400">Loading products...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
