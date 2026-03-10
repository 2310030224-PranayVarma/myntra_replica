'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { useWishlistStore } from '@/store/wishlistStore';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';
import { formatPrice, calcDiscountPercent } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function WishlistPage() {
  const { items } = useWishlistStore();
  const { toggleWishlist } = useWishlist();
  const { addToCart, isAddingToCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-16 text-center">
        <Heart className="h-20 w-20 text-gray-200 mx-auto mb-5" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Your wishlist is empty</h1>
        <p className="text-gray-500 text-sm mb-8">
          Save items you like to your wishlist. Review them anytime and easily move them to your bag.
        </p>
        <Link href="/products">
          <Button size="lg">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-sm text-gray-500 mt-1">{items.length} items saved</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items.map((item) => {
          const product = item.product;
          const primaryImage =
            product.images.find((img) => img.isPrimary) || product.images[0];
          const discountPct = product.discountPrice
            ? calcDiscountPercent(product.price, product.discountPrice)
            : null;

          return (
            <div
              key={item.id}
              className="group bg-white rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              {/* Remove from Wishlist */}
              <div className="absolute top-2 right-2 z-10 relative">
                <button
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 shadow-sm hover:bg-white transition-colors"
                >
                  <Heart className="h-4 w-4 fill-[#ff3f6c] text-[#ff3f6c]" />
                </button>
              </div>

              {/* Image */}
              <Link href={`/products/${product.slug}`} className="block relative">
                {discountPct && (
                  <div className="absolute top-2 left-2 z-10">
                    <Badge variant="discount">{discountPct}% OFF</Badge>
                  </div>
                )}
                <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                  {primaryImage ? (
                    <Image
                      src={primaryImage.url}
                      alt={product.name}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-pink-100 to-rose-200 flex items-center justify-center">
                      <ShoppingBag className="h-12 w-12 text-pink-300" />
                    </div>
                  )}
                </div>
              </Link>

              {/* Info */}
              <div className="p-3">
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wide truncate">
                  {product.brand}
                </p>
                <p className="text-sm text-gray-500 mt-0.5 line-clamp-2 leading-snug">
                  {product.name}
                </p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-sm font-bold text-gray-900">
                    {formatPrice(product.discountPrice ?? product.price)}
                  </span>
                  {product.discountPrice && (
                    <span className="text-xs text-gray-400 line-through">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => addToCart({ productId: product.id, quantity: 1 })}
                  disabled={isAddingToCart}
                  className="w-full mt-3 py-2 text-xs font-bold text-[#ff3f6c] border border-[#ff3f6c] rounded hover:bg-[#ff3f6c] hover:text-white transition-colors disabled:opacity-50"
                >
                  MOVE TO BAG
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
