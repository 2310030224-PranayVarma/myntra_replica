'use client';

import { Heart } from 'lucide-react';
import type { Product } from '@/types';
import { useWishlist } from '@/hooks/useWishlist';

interface WishlistButtonProps {
  product: Product;
  size?: 'sm' | 'md';
  className?: string;
}

export function WishlistButton({ product, size = 'sm', className = '' }: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist, isLoading } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
      }}
      disabled={isLoading}
      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      className={`rounded-full bg-white/90 hover:bg-white shadow-sm transition-all duration-200 disabled:opacity-50 ${
        size === 'sm' ? 'p-1.5' : 'p-2'
      } ${className}`}
    >
      <Heart
        className={`transition-colors duration-200 ${
          size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'
        } ${inWishlist ? 'fill-[#ff3f6c] text-[#ff3f6c]' : 'text-gray-500 hover:text-[#ff3f6c]'}`}
      />
    </button>
  );
}
