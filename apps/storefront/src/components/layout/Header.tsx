'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

const navLinks = [
  { label: 'Men', slug: 'men' },
  { label: 'Women', slug: 'women' },
  { label: 'Kids', slug: 'kids' },
  { label: 'Beauty', slug: 'beauty' },
  { label: 'Home & Living', slug: 'home-living' },
  { label: 'Sport', slug: 'sport' },
];

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const cartCount = useCartStore((s) => s.count);
  const wishlistCount = useWishlistStore((s) => s.count);
  const { isAuthenticated, user, logout } = useAuthStore();
  const openCart = useCartStore((s) => s.openCart);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-header">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center gap-4 h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-widest text-[#ff3f6c] shrink-0 mr-2"
          >
            myntra
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.slug}
                href={`/products?category=${link.slug}`}
                className="px-3 py-1.5 text-sm font-semibold text-gray-700 hover:text-[#ff3f6c] transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="flex-1 hidden sm:flex items-center bg-gray-50 border border-gray-200 rounded-md px-3 py-2 gap-2 max-w-xl mx-auto hover:border-gray-300 focus-within:border-[#ff3f6c] focus-within:ring-1 focus-within:ring-[#ff3f6c] transition-all"
          >
            <Search className="h-4 w-4 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search for products, brands and more"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent flex-1 text-sm text-gray-900 placeholder-gray-400 outline-none"
            />
          </form>

          {/* Right Icons */}
          <div className="flex items-center gap-1 ml-auto">
            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative flex flex-col items-center px-3 py-1 text-gray-700 hover:text-[#ff3f6c] transition-colors group"
            >
              <Heart className="h-5 w-5" />
              <span className="text-xs mt-0.5 hidden md:block font-medium">Wishlist</span>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#ff3f6c] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative flex flex-col items-center px-3 py-1 text-gray-700 hover:text-[#ff3f6c] transition-colors"
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="text-xs mt-0.5 hidden md:block font-medium">Bag</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#ff3f6c] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {/* User */}
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex flex-col items-center px-3 py-1 text-gray-700 hover:text-[#ff3f6c] transition-colors"
              >
                <User className="h-5 w-5" />
                <span className="text-xs mt-0.5 hidden md:block font-medium">
                  {isAuthenticated ? user?.name?.split(' ')[0] : 'Profile'}
                </span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 animate-fade-in z-50">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <Link
                        href="/account"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#ff3f6c]"
                      >
                        My Profile
                      </Link>
                      <Link
                        href="/account/orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#ff3f6c]"
                      >
                        My Orders
                      </Link>
                      <Link
                        href="/wishlist"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#ff3f6c]"
                      >
                        My Wishlist
                      </Link>
                      <hr className="my-1 border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm text-gray-600">Welcome to Myntra</p>
                        <p className="text-xs text-gray-400 mt-0.5">To access account & manage orders</p>
                      </div>
                      <Link
                        href="/auth/login"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm font-semibold text-[#ff3f6c] hover:bg-pink-50"
                      >
                        Login / Signup
                      </Link>
                      <hr className="my-1 border-gray-100" />
                      <Link
                        href="/account/orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Orders
                      </Link>
                      <Link
                        href="/wishlist"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Wishlist
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 text-gray-700 hover:text-[#ff3f6c] transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <form
          onSubmit={handleSearch}
          className="sm:hidden flex items-center bg-gray-50 border border-gray-200 rounded-md px-3 py-2 gap-2 mb-3"
        >
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search for products, brands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent flex-1 text-sm text-gray-900 placeholder-gray-400 outline-none"
          />
        </form>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white animate-fade-in">
          <nav className="max-w-screen-xl mx-auto px-4 py-3 flex flex-wrap gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.slug}
                href={`/products?category=${link.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-50 rounded-full hover:bg-pink-50 hover:text-[#ff3f6c] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
