"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowLeft, Package, User, CreditCard, List } from "lucide-react";
import { adminApi } from "@/services/adminApi";
import type { OrderStatus } from "@/types";

const ORDER_STATUSES: OrderStatus[] = [
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

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "">("");
  const [updateMsg, setUpdateMsg] = useState("");

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ["admin-order", params.id],
    queryFn: () => adminApi.getOrder(params.id),
  });

  // Sync status selector when order data loads
  useEffect(() => {
    if (order) setSelectedStatus(order.status as OrderStatus);
  }, [order]);

  const mutation = useMutation({
    mutationFn: (status: OrderStatus) =>
      adminApi.updateOrderStatus(params.id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-order", params.id] });
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      setUpdateMsg("Order status updated successfully.");
      setTimeout(() => setUpdateMsg(""), 3000);
    },
  });

  const handleStatusUpdate = () => {
    if (selectedStatus && selectedStatus !== order?.status) {
      mutation.mutate(selectedStatus as OrderStatus);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-700" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
        Failed to load order.
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-800">
            Order #{order.id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-slate-500 text-sm">{formatDate(order.createdAt)}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            STATUS_COLORS[order.status] ?? "bg-slate-100 text-slate-700"
          }`}
        >
          {order.status}
        </span>
      </div>

      {updateMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 text-sm">
          {updateMsg}
        </div>
      )}

      {/* Update Status */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Package className="w-5 h-5 text-slate-500" />
          <h2 className="font-semibold text-slate-700">Update Status</h2>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 bg-white"
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            onClick={handleStatusUpdate}
            disabled={
              mutation.isPending ||
              !selectedStatus ||
              selectedStatus === order.status
            }
            className="px-4 py-2 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-colors"
          >
            {mutation.isPending ? "Updating..." : "Update"}
          </button>
        </div>
      </div>

      {/* Customer Info */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-slate-500" />
          <h2 className="font-semibold text-slate-700">Customer</h2>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Name</span>
            <span className="font-medium text-slate-800">{order.user.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Email</span>
            <span className="text-slate-700">{order.user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">User ID</span>
            <Link
              href={`/admin/users`}
              className="font-mono text-xs text-slate-500 hover:text-slate-800"
            >
              {order.user.id}
            </Link>
          </div>
        </div>
      </div>

      {/* Payment Info */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-5 h-5 text-slate-500" />
          <h2 className="font-semibold text-slate-700">Payment</h2>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Payment Status</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                order.paymentStatus === "PAID"
                  ? "bg-green-100 text-green-700"
                  : order.paymentStatus === "FAILED"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {order.paymentStatus}
            </span>
          </div>
          <div className="flex justify-between font-medium">
            <span className="text-slate-500">Total</span>
            <span className="text-slate-800 text-base">
              {formatCurrency(order.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <List className="w-5 h-5 text-slate-500" />
          <h2 className="font-semibold text-slate-700">
            Items ({order.items?.length ?? 0})
          </h2>
        </div>
        <div className="space-y-3">
          {order.items?.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
            >
              <div>
                <p className="font-medium text-slate-800">{item.product.name}</p>
                <p className="text-slate-400 text-xs">Qty: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-slate-800">
                  {formatCurrency(item.price * item.quantity)}
                </p>
                <p className="text-xs text-slate-400">
                  {formatCurrency(item.price)} each
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-slate-200 mt-3">
          <span className="font-semibold text-slate-700">Total</span>
          <span className="font-bold text-slate-900 text-lg">
            {formatCurrency(order.total)}
          </span>
        </div>
      </div>
    </div>
  );
}
