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
  }): Promise<PaginatedProducts> {
    const { data } = await axiosInstance.get('/products', { params });
    return data;
  },

  async getProduct(slug: string): Promise<Product> {
    const { data } = await axiosInstance.get(`/products/${slug}`);
    return data;
  },

  async getFeaturedProducts(): Promise<Product[]> {
    const { data } = await axiosInstance.get('/products/featured');
    return data;
  },

  async searchProducts(query: string): Promise<Product[]> {
    const { data } = await axiosInstance.get('/products/search', {
      params: { q: query },
    });
    return data;
  },
};

// ─── Category Service ─────────────────────────────────────────────────────────

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const { data } = await axiosInstance.get('/categories');
    return data;
  },

  async getCategory(slug: string): Promise<Category> {
    const { data } = await axiosInstance.get(`/categories/${slug}`);
    return data;
  },
};

// ─── Cart Service ─────────────────────────────────────────────────────────────

export const cartService = {
  async getCart(): Promise<Cart> {
    const { data } = await axiosInstance.get('/cart');
    return data;
  },

  async addToCart(
    productId: string,
    quantity: number,
    size?: string,
    color?: string
  ): Promise<Cart> {
    const { data } = await axiosInstance.post('/cart/items', {
      productId,
      quantity,
      size,
      color,
    });
    return data;
  },

  async updateCartItem(itemId: string, quantity: number): Promise<Cart> {
    const { data } = await axiosInstance.patch(`/cart/items/${itemId}`, {
      quantity,
    });
    return data;
  },

  async removeFromCart(itemId: string): Promise<Cart> {
    const { data } = await axiosInstance.delete(`/cart/items/${itemId}`);
    return data;
  },

  async clearCart(): Promise<void> {
    await axiosInstance.delete('/cart');
  },
};

// ─── Wishlist Service ─────────────────────────────────────────────────────────

export const wishlistService = {
  async getWishlist(): Promise<WishlistItem[]> {
    const { data } = await axiosInstance.get('/wishlist');
    return data;
  },

  async addToWishlist(productId: string): Promise<WishlistItem> {
    const { data } = await axiosInstance.post('/wishlist', { productId });
    return data;
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
    const { data: order } = await axiosInstance.post('/orders', data);
    return order;
  },

  async getOrders(): Promise<Order[]> {
    const { data } = await axiosInstance.get('/orders');
    return data;
  },

  async getOrder(id: string): Promise<Order> {
    const { data } = await axiosInstance.get(`/orders/${id}`);
    return data;
  },
};

// ─── Auth Service ─────────────────────────────────────────────────────────────

export const authService = {
  async login(
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> {
    const { data } = await axiosInstance.post('/auth/login', {
      email,
      password,
    });
    return data;
  },

  async register(
    name: string,
    email: string,
    password: string,
    phone?: string
  ): Promise<{ user: User; token: string }> {
    const { data } = await axiosInstance.post('/auth/register', {
      name,
      email,
      password,
      phone,
    });
    return data;
  },

  async getMe(): Promise<User> {
    const { data } = await axiosInstance.get('/auth/me');
    return data;
  },

  async logout(): Promise<void> {
    await axiosInstance.post('/auth/logout');
  },
};
