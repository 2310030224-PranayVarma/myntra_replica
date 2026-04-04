import axiosInstance from '@/lib/axios';
import type {
  Cart,
  Category,
  Order,
  PaginatedProducts,
  Product,
  User,
  WishlistItem,
} from '@/types';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

const unwrap = <T>(payload: ApiEnvelope<T>): T => payload.data;

// ─── Product Service ──────────────────────────────────────────────────────────

export const productService = {
  async getProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    brand?: string;
    priceMin?: number;
    priceMax?: number;
    sortBy?: string;
    search?: string;
    tags?: string;
    featured?: string;
  }): Promise<PaginatedProducts> {
    const requestParams = params
      ? {
          page: params.page,
          limit: params.limit,
          category: params.category,
          brand: params.brand,
          minPrice: params.priceMin,
          maxPrice: params.priceMax,
          sort: params.sortBy,
          search: params.search,
          tags: params.tags,
          featured: params.featured,
        }
      : undefined;

    const { data } = await axiosInstance.get<ApiEnvelope<{
      items: Product[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>>('/products', { params: requestParams });
    const result = unwrap(data);
    return {
      products: result.items,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  },

  async getProduct(slug: string): Promise<Product> {
    const { data } = await axiosInstance.get<ApiEnvelope<Product>>(`/products/${slug}`);
    return unwrap(data);
  },

  async getFeaturedProducts(): Promise<Product[]> {
    const products = await this.getProducts({ featured: 'true', limit: 12 });
    return products.products;
  },

  async searchProducts(query: string): Promise<Product[]> {
    const products = await this.getProducts({
      search: query,
      limit: 24,
    });
    return products.products;
  },
};

// ─── Category Service ─────────────────────────────────────────────────────────

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const { data } = await axiosInstance.get<ApiEnvelope<Category[]>>('/categories');
    return unwrap(data);
  },

  async getCategory(slug: string): Promise<Category> {
    const { data } = await axiosInstance.get<ApiEnvelope<Category>>(`/categories/${slug}`);
    return unwrap(data);
  },
};

// ─── Cart Service ─────────────────────────────────────────────────────────────

export const cartService = {
  async getCart(): Promise<Cart> {
    const { data } = await axiosInstance.get<ApiEnvelope<Cart>>('/cart');
    return unwrap(data);
  },

  async addToCart(
    productId: string,
    quantity: number,
    size?: string,
    color?: string
  ): Promise<void> {
    await axiosInstance.post('/cart/items', {
      productId,
      quantity,
      size,
      color,
    });
  },

  async updateCartItem(itemId: string, quantity: number): Promise<void> {
    await axiosInstance.put(`/cart/items/${itemId}`, {
      quantity,
    });
  },

  async removeFromCart(itemId: string): Promise<void> {
    await axiosInstance.delete(`/cart/items/${itemId}`);
  },

  async clearCart(): Promise<void> {
    await axiosInstance.delete('/cart');
  },
};

// ─── Wishlist Service ─────────────────────────────────────────────────────────

export const wishlistService = {
  async getWishlist(): Promise<WishlistItem[]> {
    const { data } = await axiosInstance.get<ApiEnvelope<WishlistItem[]>>('/wishlist');
    return unwrap(data);
  },

  async addToWishlist(productId: string): Promise<WishlistItem> {
    const { data } = await axiosInstance.post<ApiEnvelope<WishlistItem>>('/wishlist', { productId });
    return unwrap(data);
  },

  async removeFromWishlist(productId: string): Promise<void> {
    await axiosInstance.delete(`/wishlist/${productId}`);
  },
};

// ─── Order Service ────────────────────────────────────────────────────────────

export const orderService = {
  async createOrder(data: {
    addressId: string;
    paymentMethod: string;
    couponCode?: string;
  }): Promise<Order> {
    const { data: order } = await axiosInstance.post<ApiEnvelope<Order>>('/orders', {
      shippingAddressId: data.addressId,
      paymentMethod: data.paymentMethod,
    });
    return unwrap(order);
  },

  async getOrders(): Promise<Order[]> {
    const { data } = await axiosInstance.get<ApiEnvelope<Order[]>>('/orders');
    return unwrap(data);
  },

  async getOrder(id: string): Promise<Order> {
    const { data } = await axiosInstance.get<ApiEnvelope<Order>>(`/orders/${id}`);
    return unwrap(data);
  },
};

// ─── Auth Service ─────────────────────────────────────────────────────────────

export const authService = {
  async login(
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> {
    const { data } = await axiosInstance.post<ApiEnvelope<{ user: User; token: string }>>('/auth/login', {
      email,
      password,
    });
    return unwrap(data);
  },

  async register(
    name: string,
    email: string,
    password: string,
    phone?: string
  ): Promise<{ user: User; token: string }> {
    const { data } = await axiosInstance.post<ApiEnvelope<{ user: User; token: string }>>('/auth/register', {
      name,
      email,
      password,
      phone,
    });
    return unwrap(data);
  },

  async getMe(): Promise<User> {
    const { data } = await axiosInstance.get<ApiEnvelope<User>>('/auth/profile');
    return unwrap(data);
  },

  async logout(): Promise<void> {
    return Promise.resolve();
  },
};
