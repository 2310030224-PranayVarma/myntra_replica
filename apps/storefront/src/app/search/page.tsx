'use client';

import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { ProductGrid } from '@/components/product/ProductGrid';
import { SortDropdown } from '@/components/product/SortDropdown';
import { mockProducts } from '@/lib/mockData';
import { useState, Suspense } from 'react';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [sortBy, setSortBy] = useState('recommended');

  const results = mockProducts.filter((p) => {
    if (!query) return false;
    const q = query.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.name.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const sorted = [...results].sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':
        return (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price);
      case 'price_desc':
        return (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price);
      case 'rating':
        return (b.averageRating ?? 0) - (a.averageRating ?? 0);
      default:
        return 0;
    }
  });

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      {/* Search header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-gray-500 mb-2">
          <Search className="h-4 w-4" />
          <span className="text-sm">Search results for</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">&ldquo;{query}&rdquo;</h1>
        <p className="text-sm text-gray-500 mt-1">
          {sorted.length} {sorted.length === 1 ? 'result' : 'results'} found
        </p>
      </div>

      {query && sorted.length > 0 && (
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-gray-500">Showing {sorted.length} products</span>
          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>
      )}

      {!query ? (
        <div className="text-center py-16">
          <Search className="h-16 w-16 text-gray-200 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-700">Enter a search term</h2>
          <p className="text-gray-400 text-sm mt-2">
            Search for products, brands, categories and more
          </p>
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-16">
          <Search className="h-16 w-16 text-gray-200 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-gray-800 mb-2">No results found</h2>
          <p className="text-gray-500 text-sm mb-6">
            We couldn&apos;t find anything matching &ldquo;{query}&rdquo;. Try checking your spelling or use more general terms.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {['Dresses', 'Jeans', 'Shirts', 'Shoes'].map((term) => (
              <a
                key={term}
                href={`/search?q=${term}`}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-pink-50 hover:text-[#ff3f6c] transition-colors"
              >
                {term}
              </a>
            ))}
          </div>
        </div>
      ) : (
        <ProductGrid products={sorted} columns={4} />
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-screen-xl mx-auto px-4 py-20 text-center text-gray-400">Searching...</div>}>
      <SearchContent />
    </Suspense>
  );
}
