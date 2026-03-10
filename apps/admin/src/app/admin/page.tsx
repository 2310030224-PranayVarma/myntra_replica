"use client";

import { useQuery } from "@tanstack/react-query";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  Clock,
} from "lucide-react";
import { adminApi } from "@/services/adminApi";
import StatsCard from "@/components/admin/StatsCard";
import type { AdminOrder, AdminProduct } from "@/types";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStatusBadge(status: string) {
  const map: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    PROCESSING: "bg-indigo-100 text-indigo-800",
    SHIPPED: "bg-purple-100 text-purple-800",
    DELIVERED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };
  return map[status] ?? "bg-slate-100 text-slate-800";
}

export default function AdminDashboardPage() {
  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: adminApi.getDashboardStats,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-700" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        Failed to load dashboard stats. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">
          Welcome back! Here&apos;s what&apos;s happening.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          label="Total Revenue"
          value={formatCurrency(stats?.totalRevenue ?? 0)}
          icon={DollarSign}
          trend="+12% from last month"
          color="green"
        />
        <StatsCard
          label="Total Orders"
          value={String(stats?.totalOrders ?? 0)}
          icon={ShoppingCart}
          trend="+8% from last month"
          color="blue"
        />
        <StatsCard
          label="Total Users"
          value={String(stats?.totalUsers ?? 0)}
          icon={Users}
          trend="+5% from last month"
          color="purple"
        />
        <StatsCard
          label="Total Products"
          value={String(stats?.totalProducts ?? 0)}
          icon={Package}
          trend="Active listings"
          color="orange"
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100">
          <Clock className="w-5 h-5 text-slate-500" />
          <h2 className="font-semibold text-slate-700">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-3 text-left">Order ID</th>
                <th className="px-6 py-3 text-left">Customer</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-right">Total</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats?.recentOrders?.length ? (
                stats.recentOrders.map((order: AdminOrder) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3 font-mono text-slate-600">
                      #{order.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-3">
                      <p className="font-medium text-slate-800">{order.user.name}</p>
                      <p className="text-slate-400 text-xs">{order.user.email}</p>
                    </td>
                    <td className="px-6 py-3 text-slate-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-3 text-right font-medium text-slate-800">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                    No recent orders
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100">
          <TrendingUp className="w-5 h-5 text-slate-500" />
          <h2 className="font-semibold text-slate-700">Top Products</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-3 text-left">Product</th>
                <th className="px-6 py-3 text-left">SKU</th>
                <th className="px-6 py-3 text-right">Price</th>
                <th className="px-6 py-3 text-right">Stock</th>
                <th className="px-6 py-3 text-right">Orders</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats?.topProducts?.length ? (
                stats.topProducts.map((product: AdminProduct) => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3">
                      <p className="font-medium text-slate-800">{product.name}</p>
                      <p className="text-slate-400 text-xs">{product.brand}</p>
                    </td>
                    <td className="px-6 py-3 font-mono text-slate-500 text-xs">
                      {product.sku}
                    </td>
                    <td className="px-6 py-3 text-right font-medium text-slate-800">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-6 py-3 text-right text-slate-600">
                      {product.stock}
                    </td>
                    <td className="px-6 py-3 text-right text-slate-600">
                      {product._count?.orderItems ?? 0}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                    No product data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
