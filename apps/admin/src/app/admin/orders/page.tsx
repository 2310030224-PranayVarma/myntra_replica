"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, AlertCircle, Eye } from "lucide-react";
import { adminApi } from "@/services/adminApi";
import type { AdminOrder } from "@/types";

const ORDER_STATUSES = [
  "ALL",
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-indigo-100 text-indigo-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const PAYMENT_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-50 text-yellow-700",
  COMPLETED: "bg-green-50 text-green-700",
  FAILED: "bg-red-50 text-red-700",
  REFUNDED: "bg-slate-50 text-slate-700",
};

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

export default function OrdersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-orders", page, statusFilter],
    queryFn: () =>
      adminApi.getOrders({
        page,
        limit: 10,
        status: statusFilter === "ALL" ? undefined : statusFilter,
      }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Orders</h1>
          <p className="text-slate-500 text-sm mt-1">
            {data?.total ?? 0} orders total
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {ORDER_STATUSES.map((status) => (
          <button
            key={status}
            onClick={() => {
              setStatusFilter(status);
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              statusFilter === status
                ? "bg-slate-800 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-700" />
          </div>
        ) : isError ? (
          <div className="flex items-center gap-2 p-6 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <span>Failed to load orders.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                  <th className="px-4 py-3 text-left">Order ID</th>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Payment</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.data?.length ? (
                  data.data.map((order: AdminOrder) => (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono text-slate-600 text-xs">
                        #{order.id.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-800">
                          {order.user.name}
                        </p>
                        <p className="text-slate-400 text-xs">
                          {order.user.email}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-slate-800">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            STATUS_COLORS[order.status] ??
                            "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            PAYMENT_COLORS[order.paymentStatus] ??
                            "bg-slate-50 text-slate-700"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() =>
                            router.push(`/admin/orders/${order.id}`)
                          }
                          className="flex items-center gap-1 px-2 py-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors text-xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-12 text-center text-slate-400"
                    >
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
            <p className="text-sm text-slate-500">
              Page {data.page} of {data.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={data.page <= 1}
                className="p-1.5 rounded-md hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setPage((p) => Math.min(data.totalPages, p + 1))
                }
                disabled={data.page >= data.totalPages}
                className="p-1.5 rounded-md hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
