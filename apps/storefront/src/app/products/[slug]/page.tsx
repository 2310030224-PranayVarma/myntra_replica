'use client';

import { useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { Star, Truck, RefreshCw, Shield, Package, Heart, Share2 } from 'lucide-react';
import { ProductGallery } from '@/components/product/ProductGallery';
import { RecommendationCarousel } from '@/components/product/RecommendationCarousel';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { WishlistButton } from '@/components/product/WishlistButton';
import { Badge } from '@/components/ui/Badge';
import { mockProducts } from '@/lib/mockData';
import { formatPrice, calcDiscountPercent } from '@/lib/utils';

export default function ProductPage() {
  const params = useParams<{ slug: string }>();
  const product = mockProducts.find((p) => p.slug === params.slug);

  if (!product) notFound();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = ['Black', 'White', 'Navy', 'Red', 'Pink'];

  const discountPercent = product.discountPrice
    ? calcDiscountPercent(product.price, product.discountPrice)
    : null;

  const relatedProducts = mockProducts.filter(
    (p) => p.id !== product.id && p.category.slug === product.category.slug
  );

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 mb-6 flex flex-wrap gap-1">
        <a href="/" className="hover:text-[#ff3f6c] transition-colors">Home</a>
        <span>/</span>
        <a href="/products" className="hover:text-[#ff3f6c] transition-colors">Products</a>
        <span>/</span>
        <a
          href={`/products?category=${product.category.slug}`}
          className="hover:text-[#ff3f6c] transition-colors"
        >
          {product.category.name}
        </a>
        <span>/</span>
        <span className="text-gray-800 font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Gallery */}
        <div>
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Product Details */}
        <div className="space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-base font-bold text-gray-800 uppercase tracking-wide">
                {product.brand}
              </p>
              <h1 className="text-xl font-semibold text-gray-600 mt-1">{product.name}</h1>
            </div>
            <div className="flex items-center gap-2">
              <WishlistButton product={product} size="md" />
              <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                <Share2 className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Rating */}
          {product.averageRating && product.reviewCount && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-green-600 text-white text-sm px-2.5 py-1 rounded font-semibold">
                <span>{product.averageRating.toFixed(1)}</span>
                <Star className="h-3.5 w-3.5 fill-current" />
              </div>
              <span className="text-sm text-gray-500">
                {product.reviewCount.toLocaleString()} Ratings &amp; Reviews
              </span>
            </div>
          )}

          <hr className="border-gray-100" />

          {/* Price */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(product.discountPrice ?? product.price)}
            </span>
            {product.discountPrice && (
              <>
                <span className="text-base text-gray-400 line-through">
                  {formatPrice(product.price)}
                </span>
                <Badge variant="discount" className="text-sm px-2 py-1">
                  {discountPercent}% OFF
                </Badge>
              </>
            )}
          </div>
          <p className="text-xs text-gray-400">inclusive of all taxes</p>

          {/* Colors */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Color{selectedColor ? `: ${selectedColor}` : ''}
            </p>
            <div className="flex gap-2 flex-wrap">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-3 py-1.5 text-sm rounded-md border-2 transition-all ${
                    selectedColor === color
                      ? 'border-[#ff3f6c] text-[#ff3f6c] font-semibold bg-pink-50'
                      : 'border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-700">
                Select Size{selectedSize ? `: ${selectedSize}` : ''}
              </p>
              <button className="text-xs font-semibold text-[#ff3f6c] hover:underline">
                Size Guide
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 text-sm rounded-full border-2 font-semibold transition-all ${
                    selectedSize === size
                      ? 'border-[#ff3f6c] text-[#ff3f6c] bg-pink-50'
                      : 'border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart */}
          <div className="flex gap-4 pt-2">
            <AddToCartButton
              productId={product.id}
              size={selectedSize || undefined}
              color={selectedColor || undefined}
              disabled={product.stock === 0}
              label={product.stock === 0 ? 'OUT OF STOCK' : 'ADD TO BAG'}
              fullWidth
            />
            <WishlistButton product={product} size="md" className="w-12 h-12 flex items-center justify-center border-2 border-gray-200 rounded-full" />
          </div>

          {product.stock > 0 && product.stock < 10 && (
            <p className="text-xs text-orange-500 font-semibold">
              ⚡ Only {product.stock} left in stock!
            </p>
          )}

          {/* Delivery Info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Truck className="h-4 w-4 text-[#ff3f6c] shrink-0" />
              <div>
                <span className="font-semibold text-gray-800">Free Delivery</span>
                <span className="text-gray-500"> on orders above ₹999</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <RefreshCw className="h-4 w-4 text-[#ff3f6c] shrink-0" />
              <div>
                <span className="font-semibold text-gray-800">30-Day Returns</span>
                <span className="text-gray-500"> hassle-free return policy</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Shield className="h-4 w-4 text-[#ff3f6c] shrink-0" />
              <span className="font-semibold text-gray-800">100% Authentic</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-2">
              Product Description
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full capitalize"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <section className="mt-16 border-t border-gray-100 pt-10">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Ratings &amp; Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Rating summary */}
          <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl p-6">
            <p className="text-5xl font-extrabold text-gray-900">
              {product.averageRating?.toFixed(1) || 'N/A'}
            </p>
            <div className="flex gap-1 my-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.round(product.averageRating || 0)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500">{product.reviewCount} ratings</p>
          </div>

          {/* Sample reviews */}
          <div className="md:col-span-2 space-y-4">
            {[
              { name: 'Priya S.', rating: 5, comment: 'Absolutely love this! The fabric quality is amazing and the fit is perfect. Will definitely buy more.' },
              { name: 'Rahul M.', rating: 4, comment: 'Good quality product. Delivery was fast. Sizing runs a bit small, so consider sizing up.' },
              { name: 'Ananya K.', rating: 5, comment: 'Beautiful product, exactly as shown in pictures. Great value for money!' },
            ].map((review, i) => (
              <div key={i} className="border border-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-800">{review.name}</span>
                  <div className="flex items-center gap-1 bg-green-600 text-white text-xs px-1.5 py-0.5 rounded">
                    <span>{review.rating}</span>
                    <Star className="h-3 w-3 fill-current" />
                  </div>
                </div>
                <p className="text-sm text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 border-t border-gray-100 pt-10">
          <RecommendationCarousel
            products={relatedProducts}
            title="Similar Products"
          />
        </section>
      )}
    </div>
  );
}
