'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useCart } from '@/hooks/useCart';
import { formatPrice, calcDiscountPercent } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export function CartDrawer() {
  const { isOpen, items, total, count, closeCart } = useCartStore();
  const { removeFromCart, updateQuantity } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') closeCart();
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 flex flex-col shadow-2xl animate-slide-in-right"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-[#ff3f6c]" />
            <h2 className="text-lg font-bold text-gray-900">My Bag</h2>
            {count > 0 && (
              <span className="bg-[#ff3f6c] text-white text-xs font-bold rounded-full px-2 py-0.5">
                {count}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4 px-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <ShoppingBag className="h-16 w-16 text-gray-200 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Your bag is empty</h3>
              <p className="text-sm text-gray-400 mb-6">Add items to it now</p>
              <Button onClick={closeCart} variant="outline">
                Shop Now
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const itemPrice = item.product.discountPrice ?? item.product.price;
                const discountPct = item.product.discountPrice
                  ? calcDiscountPercent(item.product.price, item.product.discountPrice)
                  : null;
                const primaryImage =
                  item.product.images.find((img) => img.isPrimary) ||
                  item.product.images[0];

                return (
                  <div
                    key={item.id}
                    className="flex gap-4 bg-gray-50 rounded-lg p-3"
                  >
                    {/* Image */}
                    <Link
                      href={`/products/${item.product.slug}`}
                      onClick={closeCart}
                      className="shrink-0"
                    >
                      <div className="relative w-20 h-28 bg-gray-100 rounded overflow-hidden">
                        {primaryImage ? (
                          <Image
                            src={primaryImage.url}
                            alt={item.product.name}
                            fill
                            className="object-cover object-top"
                            sizes="80px"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-pink-100 to-rose-200 flex items-center justify-center">
                            <ShoppingBag className="h-8 w-8 text-pink-300" />
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-700 uppercase truncate">
                        {item.product.brand}
                      </p>
                      <p className="text-sm text-gray-600 mt-0.5 line-clamp-2 leading-snug">
                        {item.product.name}
                      </p>

                      {(item.size || item.color) && (
                        <div className="flex gap-3 mt-1">
                          {item.size && (
                            <span className="text-xs text-gray-500">Size: {item.size}</span>
                          )}
                          {item.color && (
                            <span className="text-xs text-gray-500">Color: {item.color}</span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm font-bold text-gray-900">
                          {formatPrice(itemPrice)}
                        </span>
                        {item.product.discountPrice && (
                          <>
                            <span className="text-xs text-gray-400 line-through">
                              {formatPrice(item.product.price)}
                            </span>
                            <span className="text-xs text-[#ff3f6c] font-semibold">
                              {discountPct}% OFF
                            </span>
                          </>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-gray-200 rounded overflow-hidden">
                          <button
                            onClick={() =>
                              item.quantity > 1
                                ? updateQuantity(item.id, item.quantity - 1)
                                : removeFromCart(item.id)
                            }
                            className="px-2.5 py-1 hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="h-3.5 w-3.5 text-gray-600" />
                          </button>
                          <span className="px-3 py-1 text-sm font-semibold bg-white min-w-[32px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2.5 py-1 hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="h-3.5 w-3.5 text-gray-600" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 px-5 py-4 space-y-3 bg-white">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Subtotal ({count} items)</span>
              <span className="font-bold text-gray-900">{formatPrice(total)}</span>
            </div>
            <p className="text-xs text-green-600 bg-green-50 rounded px-3 py-1.5">
              🎉 Free shipping on orders above ₹999
            </p>
            <Link href="/cart" onClick={closeCart}>
              <Button variant="outline" fullWidth>
                View Full Cart
              </Button>
            </Link>
            <Link href="/checkout" onClick={closeCart}>
              <Button fullWidth>
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
