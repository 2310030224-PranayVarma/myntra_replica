"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminStore } from "@/store/adminStore";
import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, initializeAuth } = useAdminStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (!isAuthenticated) {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        router.replace("/admin/login");
      }
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    if (typeof window !== "undefined" && !localStorage.getItem("admin_token")) {
      return null;
    }
  }

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
