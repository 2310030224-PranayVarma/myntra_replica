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

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

const unwrap = <T>(payload: ApiEnvelope<T>): T => payload.data;

export const adminApi = {
  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    const { data } = await apiClient.get<ApiEnvelope<DashboardStats>>("/admin/stats");
    return unwrap(data);
  },

  // Products
  getProducts: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<AdminProduct>> => {
    const { data } = await apiClient.get<ApiEnvelope<{
      items: AdminProduct[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>>(
      "/admin/products",
      { params }
    );
    const result = unwrap(data);
    return {
      data: result.items,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  },

  getProduct: async (id: string): Promise<AdminProduct> => {
    const { data } = await apiClient.get<ApiEnvelope<AdminProduct>>(`/admin/products/${id}`);
    return unwrap(data);
  },

  createProduct: async (payload: CreateProductPayload): Promise<AdminProduct> => {
    const { data } = await apiClient.post<ApiEnvelope<AdminProduct>>(
      "/admin/products",
      payload
    );
    return unwrap(data);
  },

  updateProduct: async (
    id: string,
    payload: UpdateProductPayload
  ): Promise<AdminProduct> => {
    const { data } = await apiClient.put<ApiEnvelope<AdminProduct>>(
      `/admin/products/${id}`,
      payload
    );
    return unwrap(data);
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
    const { data } = await apiClient.get<ApiEnvelope<{
      items: AdminOrder[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>>(
      "/admin/orders",
      { params }
    );
    const result = unwrap(data);
    return {
      data: result.items,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  },

  getOrder: async (id: string): Promise<AdminOrder> => {
    const { data } = await apiClient.get<ApiEnvelope<AdminOrder>>(`/admin/orders/${id}`);
    return unwrap(data);
  },

  updateOrderStatus: async (
    id: string,
    status: OrderStatus
  ): Promise<AdminOrder> => {
    const { data } = await apiClient.put<ApiEnvelope<AdminOrder>>(
      `/admin/orders/${id}/status`,
      { status }
    );
    return unwrap(data);
  },

  // Users
  getUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<AdminUser>> => {
    const { data } = await apiClient.get<ApiEnvelope<{
      items: AdminUser[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>>(
      "/admin/users",
      { params }
    );
    const result = unwrap(data);
    return {
      data: result.items,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  },

  // Categories
  getCategories: async (): Promise<Category[]> => {
    const { data } = await apiClient.get<ApiEnvelope<Category[]>>("/categories");
    return unwrap(data);
  },

  // Auth
  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<{ token: string }> => {
    const { data } = await apiClient.post<
      ApiEnvelope<{ token: string; user: { role: string } }>
    >(
      "/auth/login",
      credentials
    );
    const result = unwrap(data);
    if (result.user.role !== "ADMIN") {
      throw new Error("Admin access required");
    }
    return { token: result.token };
  },
};
