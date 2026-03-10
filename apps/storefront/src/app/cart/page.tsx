'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, Tag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useCart } from '@/hooks/useCart';
import { formatPrice, calcDiscountPercent } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default function CartPage() {
  const { items, total, count } = useCartStore();
  const { removeFromCart, updateQuantity } = useCart();

  const savings = items.reduce((acc, item) => {
    if (item.product.discountPrice) {
      return acc + (item.product.price - item.product.discountPrice) * item.quantity;
    }
    return acc;
  }, 0);

  const shipping = total > 999 ? 0 : 49;
  const finalTotal = total + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-20 w-20 text-gray-200 mx-auto mb-5" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Your bag is empty</h1>
        <p className="text-gray-500 text-sm mb-8">
          Add items to it now.
        </p>
        <Link href="/products">
          <Button size="lg">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">My Bag</h1>
      <p className="text-sm text-gray-500 mb-8">{count} items in your bag</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {/* Coupon */}
          <div className="border border-dashed border-[#ff3f6c] rounded-lg px-4 py-3 flex items-center gap-3 bg-pink-50">
            <Tag className="h-4 w-4 text-[#ff3f6c] shrink-0" />
            <input
              type="text"
              placeholder="Enter coupon code"
              className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
            />
            <button className="text-sm font-bold text-[#ff3f6c] hover:underline shrink-0">
              Apply
            </button>
          </div>

          {items.map((item) => {
            const itemPrice = item.product.discountPrice ?? item.product.price;
            const discountPct = item.product.discountPrice
              ? calcDiscountPercent(item.product.price, item.product.discountPrice)
              : null;
            const primaryImage =
              item.product.images.find((img) => img.isPrimary) || item.product.images[0];

            return (
              <div
                key={item.id}
                className="bg-white border border-gray-100 rounded-xl p-4 flex gap-4 shadow-card hover:shadow-card-hover transition-shadow"
              >
                {/* Image */}
                <Link href={`/products/${item.product.slug}`} className="shrink-0">
                  <div className="relative w-28 h-36 bg-gray-100 rounded-lg overflow-hidden">
                    {primaryImage ? (
                      <Image
                        src={primaryImage.url}
                        alt={item.product.name}
                        fill
                        className="object-cover object-top"
                        sizes="112px"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-pink-100 to-rose-200 flex items-center justify-center">
                        <ShoppingBag className="h-10 w-10 text-pink-300" />
                      </div>
                    )}
                  </div>
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                        {item.product.brand}
                      </p>
                      <Link href={`/products/${item.product.slug}`}>
                        <p className="text-sm text-gray-600 mt-0.5 hover:text-[#ff3f6c] transition-colors line-clamp-2">
                          {item.product.name}
                        </p>
                      </Link>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {(item.size || item.color) && (
                    <div className="flex gap-4 mt-2">
                      {item.size && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          Size: {item.size}
                        </span>
                      )}
                      {item.color && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          Color: {item.color}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <span className="text-base font-bold text-gray-900">
                      {formatPrice(itemPrice)}
                    </span>
                    {item.product.discountPrice && (
                      <>
                        <span className="text-sm text-gray-400 line-through">
                          {formatPrice(item.product.price)}
                        </span>
                        <span className="text-xs font-bold text-[#ff3f6c]">
                          {discountPct}% OFF
                        </span>
                      </>
                    )}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() =>
                          item.quantity > 1
                            ? updateQuantity(item.id, item.quantity - 1)
                            : removeFromCart(item.id)
                        }
                        className="px-3 py-1.5 hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="h-3.5 w-3.5 text-gray-600" />
                      </button>
                      <span className="px-4 py-1.5 text-sm font-bold bg-white min-w-[40px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1.5 hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5 text-gray-600" />
                      </button>
                    </div>
                    <span className="text-sm font-semibold text-gray-700">
                      Total: {formatPrice(itemPrice * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-card sticky top-24">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">
              Price Details
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-700">
                <span>Price ({count} items)</span>
                <span>{formatPrice(total + savings)}</span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>− {formatPrice(savings)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-700">
                <span>Delivery Charges</span>
                {shipping === 0 ? (
                  <span className="text-green-600 font-semibold">FREE</span>
                ) : (
                  <span>{formatPrice(shipping)}</span>
                )}
              </div>
              <hr className="border-gray-100" />
              <div className="flex justify-between font-bold text-gray-900 text-base">
                <span>Total Amount</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
              {savings > 0 && (
                <p className="text-green-600 text-xs font-semibold bg-green-50 rounded-lg px-3 py-2">
                  🎉 You&apos;re saving {formatPrice(savings)} on this order!
                </p>
              )}
            </div>

            <Link href="/checkout" className="block mt-5">
              <Button fullWidth size="lg">
                Place Order <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
