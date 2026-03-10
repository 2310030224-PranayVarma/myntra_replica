'use client';

import Link from 'next/link';
import { User, Package, Heart, MapPin, CreditCard, LogOut, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

const menuItems = [
  { icon: Package, label: 'My Orders', href: '/account/orders', desc: 'Check your order status' },
  { icon: Heart, label: 'My Wishlist', href: '/wishlist', desc: 'Your saved items' },
  { icon: MapPin, label: 'My Addresses', href: '/account/addresses', desc: 'Manage delivery addresses' },
  { icon: CreditCard, label: 'Payment Methods', href: '/account/payments', desc: 'Saved cards & UPI IDs' },
];

export default function AccountPage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  if (!isAuthenticated) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-16 text-center">
        <User className="h-16 w-16 text-gray-200 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Sign in to your account</h1>
        <p className="text-gray-500 text-sm mb-8">
          Access your orders, wishlist, and profile information.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/auth/login"
            className="bg-[#ff3f6c] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#e6385f] transition-colors"
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className="border-2 border-[#ff3f6c] text-[#ff3f6c] font-semibold px-6 py-3 rounded-lg hover:bg-pink-50 transition-colors"
          >
            Register
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <div className="bg-gradient-to-br from-[#ff3f6c] to-rose-500 rounded-2xl p-6 text-white">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <User className="h-8 w-8 text-white" />
              )}
            </div>
            <h2 className="text-xl font-bold">{user?.name}</h2>
            <p className="text-pink-100 text-sm mt-1">{user?.email}</p>
            {user?.phone && (
              <p className="text-pink-100 text-sm">{user.phone}</p>
            )}
            {user?.role === 'ADMIN' && (
              <span className="inline-block mt-3 bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                ADMIN
              </span>
            )}
          </div>
        </div>

        {/* Menu */}
        <div className="md:col-span-2">
          <h1 className="text-xl font-bold text-gray-900 mb-5">My Account</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {menuItems.map(({ icon: Icon, label, href, desc }) => (
              <Link
                key={label}
                href={href}
                className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl p-4 shadow-card hover:shadow-card-hover hover:border-pink-100 transition-all group"
              >
                <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-pink-100 transition-colors">
                  <Icon className="h-5 w-5 text-[#ff3f6c]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-[#ff3f6c] transition-colors" />
              </Link>
            ))}
          </div>

          <button
            onClick={() => {
              logout();
              router.push('/');
            }}
            className="flex items-center gap-3 mt-4 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl w-full transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
