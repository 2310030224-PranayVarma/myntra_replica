'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import type { Product } from '@/types';
import { calcDiscountPercent, formatPrice } from '@/lib/utils';
import { WishlistButton } from './WishlistButton';
import { Badge } from '@/components/ui/Badge';
import { ShoppingBag, Star } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart, isAddingToCart } = useCart();

  const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
  const secondaryImage = product.images[1];

  const discountPercent =
    product.discountPrice
      ? calcDiscountPercent(product.price, product.discountPrice)
      : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ productId: product.id, quantity: 1 });
  };

  return (
    <div
      className="group relative bg-white rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Wishlist Button */}
      <div className="absolute top-2 right-2 z-10">
        <WishlistButton product={product} />
      </div>

      {/* Discount Badge */}
      {discountPercent && (
        <div className="absolute top-2 left-2 z-10">
          <Badge variant="discount">{discountPercent}% OFF</Badge>
        </div>
      )}

      {/* Image */}
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
          {primaryImage ? (
            <Image
              src={
                isHovered && secondaryImage
                  ? secondaryImage.url
                  : primaryImage.url
              }
              alt={primaryImage.alt || product.name}
              fill
              className="object-cover object-top transition-all duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-pink-100 to-rose-200 flex items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-pink-300" />
            </div>
          )}

          {/* Add to Cart Overlay */}
          <div
            className={`absolute bottom-0 left-0 right-0 bg-white/95 py-2.5 text-center transition-all duration-300 ${
              isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
            }`}
          >
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || product.stock === 0}
              className="text-sm font-semibold text-gray-800 hover:text-[#ff3f6c] transition-colors disabled:opacity-50"
            >
              {product.stock === 0 ? 'Out of Stock' : 'ADD TO BAG'}
            </button>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <Link href={`/products/${product.slug}`} className="block p-3">
        <p className="text-xs font-bold text-gray-700 uppercase tracking-wide truncate">
          {product.brand}
        </p>
        <p className="text-sm text-gray-500 mt-0.5 line-clamp-2 leading-snug">
          {product.name}
        </p>

        {/* Price */}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className="text-sm font-bold text-gray-900">
            {formatPrice(product.discountPrice ?? product.price)}
          </span>
          {product.discountPrice && (
            <>
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.price)}
              </span>
              <span className="text-xs font-semibold text-[#ff3f6c]">
                ({discountPercent}% OFF)
              </span>
            </>
          )}
        </div>

        {/* Rating */}
        {product.averageRating && product.reviewCount ? (
          <div className="flex items-center gap-1 mt-1.5">
            <div className="flex items-center gap-0.5 bg-green-600 text-white text-xs px-1.5 py-0.5 rounded">
              <span>{product.averageRating.toFixed(1)}</span>
              <Star className="h-2.5 w-2.5 fill-current" />
            </div>
            <span className="text-xs text-gray-400">({product.reviewCount})</span>
          </div>
        ) : null}
      </Link>
    </div>
  );
}
