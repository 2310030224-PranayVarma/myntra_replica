'use client';

import Link from 'next/link';
import { Package, ChevronRight, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import type { Order } from '@/types';

const mockOrders: Order[] = [
  {
    id: 'ORD-2024-001',
    status: 'DELIVERED',
    items: [],
    subtotal: 3998,
    discount: 1000,
    tax: 180,
    shippingCost: 0,
    total: 3178,
    paymentMethod: 'UPI',
    paymentStatus: 'COMPLETED',
    createdAt: '2024-06-15T10:30:00Z',
  },
  {
    id: 'ORD-2024-002',
    status: 'SHIPPED',
    items: [],
    subtotal: 2499,
    discount: 500,
    tax: 90,
    shippingCost: 0,
    total: 2089,
    paymentMethod: 'Card',
    paymentStatus: 'COMPLETED',
    createdAt: '2024-07-01T14:20:00Z',
  },
  {
    id: 'ORD-2024-003',
    status: 'PROCESSING',
    items: [],
    subtotal: 5999,
    discount: 1499,
    tax: 270,
    shippingCost: 0,
    total: 4770,
    paymentMethod: 'COD',
    paymentStatus: 'PENDING',
    createdAt: '2024-07-10T09:15:00Z',
  },
];

const statusConfig: Record<Order['status'], { label: string; color: string; bg: string }> = {
  PENDING: { label: 'Pending', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  CONFIRMED: { label: 'Confirmed', color: 'text-blue-700', bg: 'bg-blue-100' },
  PROCESSING: { label: 'Processing', color: 'text-blue-700', bg: 'bg-blue-100' },
  SHIPPED: { label: 'Shipped', color: 'text-purple-700', bg: 'bg-purple-100' },
  DELIVERED: { label: 'Delivered', color: 'text-green-700', bg: 'bg-green-100' },
  CANCELLED: { label: 'Cancelled', color: 'text-red-700', bg: 'bg-red-100' },
  REFUNDED: { label: 'Refunded', color: 'text-gray-700', bg: 'bg-gray-100' },
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function OrdersPage() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-16 text-center">
        <Package className="h-16 w-16 text-gray-200 mx-auto mb-4" />
        <h1 className="text-xl font-bold text-gray-800 mb-2">Please login to view orders</h1>
        <Link href="/auth/login" className="text-[#ff3f6c] font-semibold hover:underline">
          Login now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/account" className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">{mockOrders.length} orders</p>
        </div>
      </div>

      {mockOrders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="h-16 w-16 text-gray-200 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-gray-800 mb-2">No orders yet</h2>
          <p className="text-gray-500 text-sm mb-6">Start shopping to see your orders here.</p>
          <Link
            href="/products"
            className="bg-[#ff3f6c] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#e6385f] transition-colors"
          >
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {mockOrders.map((order) => {
            const { label, color, bg } = statusConfig[order.status];
            return (
              <div
                key={order.id}
                className="bg-white border border-gray-100 rounded-xl p-5 shadow-card hover:shadow-card-hover transition-shadow"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <p className="text-sm font-bold text-gray-800">{order.id}</p>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${bg} ${color}`}>
                        {label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Placed on {formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold text-gray-900">₹{order.total.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-gray-500">{order.paymentMethod}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    {order.status === 'DELIVERED' && (
                      <span className="text-green-600 font-semibold">✓ Delivered</span>
                    )}
                    {order.status === 'SHIPPED' && (
                      <span className="text-purple-600 font-semibold">📦 Out for delivery</span>
                    )}
                    {order.status === 'PROCESSING' && (
                      <span className="text-blue-600 font-semibold">⚙️ Being processed</span>
                    )}
                  </div>
                  <button className="flex items-center gap-1 text-xs font-semibold text-[#ff3f6c] hover:underline">
                    View Details <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
