import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star, Truck, RefreshCw, Shield, Headphones } from 'lucide-react';
import { ProductGrid } from '@/components/product/ProductGrid';
import { RecommendationCarousel } from '@/components/product/RecommendationCarousel';
import { mockCategories, featuredProducts, mockProducts } from '@/lib/mockData';

const heroBanners = [
  {
    id: 1,
    title: 'New Season Arrivals',
    subtitle: 'Discover the latest trends in fashion',
    cta: 'Shop Now',
    href: '/products',
    gradient: 'from-rose-400 via-pink-500 to-purple-600',
  },
  {
    id: 2,
    title: 'Summer Collection',
    subtitle: 'Up to 60% off on summer styles',
    cta: 'Explore Deals',
    href: '/products?sortBy=discount',
    gradient: 'from-orange-400 via-pink-400 to-rose-500',
  },
];

const features = [
  { icon: Truck, title: 'Free Delivery', desc: 'On orders above ₹999' },
  { icon: RefreshCw, title: 'Easy Returns', desc: '30-day hassle-free returns' },
  { icon: Shield, title: 'Secure Payment', desc: '100% secure transactions' },
  { icon: Headphones, title: '24/7 Support', desc: 'Always here to help' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className={`bg-gradient-to-r ${heroBanners[0].gradient} py-24 px-8`}
        >
          <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="text-white flex-1">
              <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
                New Arrival 2024
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-4">
                Discover Your
                <br />
                <span className="text-yellow-300">Style Story</span>
              </h1>
              <p className="text-lg text-white/80 mb-8 max-w-md">
                Shop the latest fashion trends. From casual wear to ethnic wear — find everything you love.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/products?category=women"
                  className="bg-white text-[#ff3f6c] font-bold px-8 py-3 rounded-full hover:bg-pink-50 transition-colors shadow-lg"
                >
                  Shop Women
                </Link>
                <Link
                  href="/products?category=men"
                  className="bg-transparent border-2 border-white text-white font-bold px-8 py-3 rounded-full hover:bg-white/10 transition-colors"
                >
                  Shop Men
                </Link>
              </div>
            </div>

            <div className="flex-1 hidden md:flex justify-center gap-4">
              {[
                'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=500&fit=crop',
                'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=300&h=450&fit=crop',
              ].map((src, i) => (
                <div
                  key={i}
                  className={`relative overflow-hidden rounded-2xl shadow-2xl ${
                    i === 0 ? 'w-56 h-72' : 'w-44 h-60 mt-12'
                  }`}
                >
                  <Image
                    src={src}
                    alt={`Fashion ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 0px, 224px"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Promo Strip */}
        <div className="bg-gray-900 text-white py-2.5 text-center text-sm font-medium tracking-wide">
          🎉 FREE SHIPPING on orders above ₹999 &nbsp;|&nbsp; USE CODE: <span className="text-yellow-300 font-bold">MYNTRA20</span> for 20% off
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-gray-100 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-[#ff3f6c]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{title}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-screen-xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
          <Link
            href="/products"
            className="flex items-center gap-1 text-sm font-semibold text-[#ff3f6c] hover:underline"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {mockCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group flex flex-col items-center gap-3"
            >
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-pink-100 to-rose-200 shadow-card group-hover:shadow-card-hover transition-all duration-300">
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 33vw, 16vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">
                    👗
                  </div>
                )}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              </div>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-[#ff3f6c] transition-colors text-center">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
              <p className="text-sm text-gray-500 mt-1">Handpicked styles just for you</p>
            </div>
            <Link
              href="/products"
              className="flex items-center gap-1 text-sm font-semibold text-[#ff3f6c] hover:underline"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ProductGrid products={featuredProducts} columns={4} />
        </div>
      </section>

      {/* Banner Grid */}
      <section className="max-w-screen-xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/products?category=women"
            className="relative h-64 rounded-2xl overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-400" />
            <Image
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=400&fit=crop"
              alt="Women Fashion"
              fill
              className="object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
              <h3 className="text-white font-bold text-2xl">Women's Fashion</h3>
              <p className="text-white/80 text-sm mt-1">Up to 50% off</p>
              <span className="inline-flex items-center gap-1 text-white text-sm font-semibold mt-3 group-hover:underline">
                Shop Now <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>

          <Link
            href="/products?category=men"
            className="relative h-64 rounded-2xl overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600" />
            <Image
              src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&h=400&fit=crop"
              alt="Men Fashion"
              fill
              className="object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
              <h3 className="text-white font-bold text-2xl">Men's Fashion</h3>
              <p className="text-white/80 text-sm mt-1">New arrivals every week</p>
              <span className="inline-flex items-center gap-1 text-white text-sm font-semibold mt-3 group-hover:underline">
                Shop Now <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Recommendations Carousel */}
      <section className="max-w-screen-xl mx-auto px-4 py-12 border-t border-gray-100">
        <RecommendationCarousel
          products={mockProducts}
          title="Trending Right Now"
        />
      </section>

      {/* Trust Badges */}
      <section className="bg-gray-900 text-white py-12">
        <div className="max-w-screen-xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-2">Why Shop with Myntra?</h2>
          <p className="text-gray-400 text-sm mb-8">India&apos;s leading fashion destination</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '5000+', label: 'Premium Brands' },
              { value: '10M+', label: 'Happy Customers' },
              { value: '30 Days', label: 'Easy Returns' },
              { value: '100%', label: 'Authentic Products' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-extrabold text-[#ff3f6c]">{stat.value}</p>
                <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
