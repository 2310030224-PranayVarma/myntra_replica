import apiClient from "@/lib/axios";
import type {
  DashboardStats,
  AdminProduct,
  AdminOrder,
  AdminUser,
  Category,
  PaginatedResponse,
  CreateProductPayload,
  UpdateProductPayload,
  OrderStatus,
} from "@/types";

export const adminApi = {
  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    const { data } = await apiClient.get<DashboardStats>("/admin/stats");
    return data;
  },

  // Products
  getProducts: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<AdminProduct>> => {
    const { data } = await apiClient.get<PaginatedResponse<AdminProduct>>(
      "/admin/products",
      { params }
    );
    return data;
  },

  getProduct: async (id: string): Promise<AdminProduct> => {
    const { data } = await apiClient.get<AdminProduct>(`/admin/products/${id}`);
    return data;
  },

  createProduct: async (payload: CreateProductPayload): Promise<AdminProduct> => {
    const { data } = await apiClient.post<AdminProduct>(
      "/admin/products",
      payload
    );
    return data;
  },

  updateProduct: async (
    id: string,
    payload: UpdateProductPayload
  ): Promise<AdminProduct> => {
    const { data } = await apiClient.put<AdminProduct>(
      `/admin/products/${id}`,
      payload
    );
    return data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/products/${id}`);
  },

  // Orders
  getOrders: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<AdminOrder>> => {
    const { data } = await apiClient.get<PaginatedResponse<AdminOrder>>(
      "/admin/orders",
      { params }
    );
    return data;
  },

  getOrder: async (id: string): Promise<AdminOrder> => {
    const { data } = await apiClient.get<AdminOrder>(`/admin/orders/${id}`);
    return data;
  },

  updateOrderStatus: async (
    id: string,
    status: OrderStatus
  ): Promise<AdminOrder> => {
    const { data } = await apiClient.patch<AdminOrder>(
      `/admin/orders/${id}/status`,
      { status }
    );
    return data;
  },

  // Users
  getUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<AdminUser>> => {
    const { data } = await apiClient.get<PaginatedResponse<AdminUser>>(
      "/admin/users",
      { params }
    );
    return data;
  },

  // Categories
  getCategories: async (): Promise<Category[]> => {
    const { data } = await apiClient.get<Category[]>("/categories");
    return data;
  },

  // Auth
  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<{ token: string }> => {
    const { data } = await apiClient.post<{ token: string }>(
      "/auth/admin/login",
      credentials
    );
    return data;
  },
};
