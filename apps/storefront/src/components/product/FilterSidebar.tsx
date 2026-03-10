'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Star } from 'lucide-react';
import type { FilterState } from '@/types';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onClearFilters: () => void;
}

const categories = [
  { label: 'Women', value: 'women' },
  { label: 'Men', value: 'men' },
  { label: 'Kids', value: 'kids' },
  { label: 'Beauty', value: 'beauty' },
  { label: 'Home & Living', value: 'home-living' },
  { label: 'Sport', value: 'sport' },
];

const brands = [
  'H&M', 'Zara', 'Mango', 'Nike', 'Adidas', 'Puma',
  'US Polo Assn.', 'Allen Solly', 'Arrow', 'Peter England',
  'Levis', 'Wrangler', 'Roadster', 'HRX',
];

const priceRanges = [
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 – ₹1,000', min: 500, max: 1000 },
  { label: '₹1,000 – ₹2,000', min: 1000, max: 2000 },
  { label: '₹2,000 – ₹5,000', min: 2000, max: 5000 },
  { label: 'Above ₹5,000', min: 5000, max: undefined },
];

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="text-sm font-bold text-gray-800 uppercase tracking-wide">
          {title}
        </span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

export function FilterSidebar({
  filters,
  onFilterChange,
  onClearFilters,
}: FilterSidebarProps) {
  const toggleCategory = (value: string) => {
    const newCategories = filters.categories.includes(value)
      ? filters.categories.filter((c) => c !== value)
      : [...filters.categories, value];
    onFilterChange({ categories: newCategories, page: 1 });
  };

  const toggleBrand = (value: string) => {
    const newBrands = filters.brands.includes(value)
      ? filters.brands.filter((b) => b !== value)
      : [...filters.brands, value];
    onFilterChange({ brands: newBrands, page: 1 });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.priceMin !== undefined ||
    filters.priceMax !== undefined ||
    filters.ratings !== undefined;

  return (
    <aside className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-xs font-semibold text-[#ff3f6c] hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Categories */}
      <FilterSection title="Categories">
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat.value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat.value)}
                onChange={() => toggleCategory(cat.value)}
                className="w-4 h-4 rounded border-gray-300 text-[#ff3f6c] focus:ring-[#ff3f6c] cursor-pointer"
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                {cat.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Brand */}
      <FilterSection title="Brand">
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="w-4 h-4 rounded border-gray-300 text-[#ff3f6c] focus:ring-[#ff3f6c] cursor-pointer"
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                {brand}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="space-y-2">
          {priceRanges.map((range) => {
            const isSelected =
              filters.priceMin === range.min && filters.priceMax === range.max;
            return (
              <label key={range.label} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="radio"
                  name="price-range"
                  checked={isSelected}
                  onChange={() =>
                    onFilterChange({
                      priceMin: range.min,
                      priceMax: range.max,
                      page: 1,
                    })
                  }
                  className="w-4 h-4 border-gray-300 text-[#ff3f6c] focus:ring-[#ff3f6c] cursor-pointer"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                  {range.label}
                </span>
              </label>
            );
          })}
          {(filters.priceMin !== undefined || filters.priceMax !== undefined) && (
            <button
              onClick={() => onFilterChange({ priceMin: undefined, priceMax: undefined, page: 1 })}
              className="text-xs text-[#ff3f6c] hover:underline mt-1"
            >
              Clear price filter
            </button>
          )}
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Customer Rating" defaultOpen={false}>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="rating"
                checked={filters.ratings === rating}
                onChange={() => onFilterChange({ ratings: rating, page: 1 })}
                className="w-4 h-4 border-gray-300 text-[#ff3f6c] focus:ring-[#ff3f6c] cursor-pointer"
              />
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-600">{rating}</span>
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-gray-500">& above</span>
              </div>
            </label>
          ))}
          {filters.ratings !== undefined && (
            <button
              onClick={() => onFilterChange({ ratings: undefined, page: 1 })}
              className="text-xs text-[#ff3f6c] hover:underline mt-1"
            >
              Clear rating filter
            </button>
          )}
        </div>
      </FilterSection>
    </aside>
  );
}
