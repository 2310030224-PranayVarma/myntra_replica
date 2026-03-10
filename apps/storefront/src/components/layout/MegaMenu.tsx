'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

const megaMenuData = {
  Women: {
    'Western Wear': ['Dresses', 'Tops', 'T-Shirts', 'Jeans', 'Trousers', 'Skirts', 'Shorts'],
    'Indian & Fusion Wear': ['Kurtas & Suits', 'Sarees', 'Lehengas', 'Kurtis', 'Salwar Suits'],
    'Plus Size': ['Tops', 'Dresses', 'Kurtis', 'Jeans'],
    'Sports & Active Wear': ['Sports Shoes', 'Sports Tops', 'Sports Bras', 'Tracksuits'],
  },
  Men: {
    'Topwear': ['T-Shirts', 'Casual Shirts', 'Formal Shirts', 'Sweatshirts', 'Jackets & Coats'],
    'Bottomwear': ['Jeans', 'Casual Trousers', 'Formal Trousers', 'Shorts', 'Track Pants'],
    'Sports': ['Sports Shoes', 'Sports Shorts', 'Sports Tops', 'Sports Jackets'],
    'Footwear': ['Casual Shoes', 'Sports Shoes', 'Formal Shoes', 'Boots'],
  },
  Kids: {
    'Boys': ['T-Shirts', 'Shirts', 'Jeans', 'Track Pants', 'Sports Shoes'],
    'Girls': ['Dresses', 'Tops', 'Jeans', 'Leggings', 'Footwear'],
    'Infants': ['Bodysuits', 'Rompers', 'Sets', 'Footwear'],
    'Sports': ['Sports Shoes', 'Track Suits', 'Shorts'],
  },
};

export function MegaMenu() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  return (
    <div className="hidden lg:flex items-center gap-1 relative">
      {Object.entries(megaMenuData).map(([category, subcategories]) => (
        <div
          key={category}
          className="relative"
          onMouseEnter={() => setActiveMenu(category)}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:text-[#ff3f6c] transition-colors">
            {category}
            <ChevronDown className="h-3.5 w-3.5" />
          </button>

          {activeMenu === category && (
            <div className="absolute top-full left-0 w-[600px] bg-white shadow-2xl border-t-2 border-[#ff3f6c] p-6 z-50 animate-fade-in">
              <div className="grid grid-cols-4 gap-6">
                {Object.entries(subcategories).map(([subcat, items]) => (
                  <div key={subcat}>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                      {subcat}
                    </h4>
                    <ul className="space-y-1.5">
                      {items.map((item) => (
                        <li key={item}>
                          <Link
                            href={`/products?category=${category.toLowerCase()}&subcategory=${item.toLowerCase().replace(/\s+/g, '-')}`}
                            className="text-sm text-gray-600 hover:text-[#ff3f6c] transition-colors"
                          >
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link
                  href={`/products?category=${category.toLowerCase()}`}
                  className="text-sm font-semibold text-[#ff3f6c] hover:underline"
                >
                  View All {category} →
                </Link>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
