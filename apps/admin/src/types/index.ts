export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  recentOrders: AdminOrder[];
  topProducts: AdminProduct[];
}

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  stock: number;
  sku: string;
  brand: string;
  isActive: boolean;
  isFeatured: boolean;
  category: { id: string; name: string };
  images: { url: string; isPrimary: boolean }[];
  _count?: { reviews: number; orderItems: number };
  totalSold?: number;
  createdAt: string;
}

export interface AdminOrder {
  id: string;
  status: string;
  total: number;
  paymentStatus: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  user: { id: string; name: string; email: string };
  items: {
    id: string;
    quantity: number;
    price: number;
    product: { name: string };
  }[];
  createdAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  createdAt: string;
  _count?: { orders: number };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateProductPayload {
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  sku: string;
  brand: string;
  categoryId: string;
  isFeatured: boolean;
  isActive: boolean;
  images: { url: string; isPrimary: boolean }[];
  tags: string[];
}

export type UpdateProductPayload = Partial<CreateProductPayload>;

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";
