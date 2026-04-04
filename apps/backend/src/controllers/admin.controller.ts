import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { orderService } from '../services/order.service';
import { productService } from '../services/product.service';
import { OrderStatus } from '@prisma/client';

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export const adminController = {
  async getDashboardStats(_req: Request, res: Response): Promise<void> {
    try {
      const [totalOrders, totalUsers, totalProducts, revenueResult, recentOrders, topProducts] =
        await Promise.all([
          prisma.order.count(),
          prisma.user.count({ where: { role: 'USER' } }),
          prisma.product.count({ where: { isActive: true } }),
          prisma.order.aggregate({
            _sum: { total: true },
            where: { paymentStatus: 'COMPLETED' },
          }),
          prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { name: true, email: true } } },
          }),
          prisma.orderItem.groupBy({
            by: ['productId'],
            _sum: { quantity: true },
            orderBy: { _sum: { quantity: 'desc' } },
            take: 5,
          }),
        ]);

      const topProductDetails = await Promise.all(
        topProducts.map(async (tp) => {
          const product = await prisma.product.findUnique({
            where: { id: tp.productId },
            select: {
              id: true,
              name: true,
              price: true,
              stock: true,
              sku: true,
              brand: true,
              images: { where: { isPrimary: true }, take: 1 },
            },
          });
          return product
            ? { ...product, totalSold: tp._sum.quantity ?? 0 }
            : null;
        })
      );

      res.json({
        success: true,
        data: {
          totalOrders,
          totalUsers,
          totalProducts,
          totalRevenue: revenueResult._sum.total || 0,
          recentOrders,
          topProducts: topProductDetails.filter(Boolean),
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch dashboard stats';
      res.status(500).json({ success: false, error: message });
    }
  },

  async getAdminProducts(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt((req.query.page as string) || '1', 10);
      const limit = parseInt((req.query.limit as string) || '20', 10);
      const search = ((req.query.search as string) || '').trim();
      const skip = (page - 1) * limit;
      const where = search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' as const } },
              { sku: { contains: search, mode: 'insensitive' as const } },
              { brand: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : undefined;

      const [items, total] = await Promise.all([
        prisma.product.findMany({
          where,
          skip,
          take: limit,
          include: {
            category: { select: { id: true, name: true } },
            images: { where: { isPrimary: true }, take: 1 },
            _count: { select: { reviews: true, orderItems: true } },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.product.count({ where }),
      ]);

      res.json({
        success: true,
        data: { items, total, page, limit, totalPages: Math.ceil(total / limit) },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch products';
      res.status(500).json({ success: false, error: message });
    }
  },

  async getAdminOrders(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt((req.query.page as string) || '1', 10);
      const limit = parseInt((req.query.limit as string) || '20', 10);
      const status = req.query.status as OrderStatus | undefined;
      const result = await orderService.getAllOrders(page, limit, status);
      res.json({ success: true, data: result });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch orders';
      res.status(500).json({ success: false, error: message });
    }
  },

  async getAdminProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          category: { select: { id: true, name: true } },
          images: true,
        },
      });

      if (!product) {
        res.status(404).json({ success: false, error: 'Product not found' });
        return;
      }

      res.json({ success: true, data: product });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch product';
      res.status(500).json({ success: false, error: message });
    }
  },

  async createAdminProduct(req: Request, res: Response): Promise<void> {
    try {
      const payload = req.body;
      let slug = payload.slug ? slugify(payload.slug) : slugify(payload.name || 'product');
      if (!slug) {
        slug = `product-${Date.now()}`;
      }

      const existing = await prisma.product.findUnique({ where: { slug } });
      if (existing) {
        slug = `${slug}-${Date.now()}`;
      }

      const product = await productService.createProduct({ ...payload, slug });
      res.status(201).json({ success: true, data: product });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create product';
      res.status(400).json({ success: false, error: message });
    }
  },

  async updateAdminProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const product = await productService.updateProduct(id, req.body);
      res.json({ success: true, data: product });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update product';
      res.status(400).json({ success: false, error: message });
    }
  },

  async deleteAdminProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await productService.deleteProduct(id);
      res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete product';
      res.status(400).json({ success: false, error: message });
    }
  },

  async getAdminOrder(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: { include: { product: true } },
          shippingAddress: true,
        },
      });

      if (!order) {
        res.status(404).json({ success: false, error: 'Order not found' });
        return;
      }

      res.json({ success: true, data: order });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch order';
      res.status(500).json({ success: false, error: message });
    }
  },

  async updateAdminOrderStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const order = await orderService.updateOrderStatus(id, status as OrderStatus);
      res.json({ success: true, data: order });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update order status';
      res.status(400).json({ success: false, error: message });
    }
  },

  async getAdminUsers(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt((req.query.page as string) || '1', 10);
      const limit = parseInt((req.query.limit as string) || '20', 10);
      const skip = (page - 1) * limit;

      const [items, total] = await Promise.all([
        prisma.user.findMany({
          skip,
          take: limit,
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            role: true,
            createdAt: true,
            _count: { select: { orders: true } },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.user.count(),
      ]);

      res.json({
        success: true,
        data: { items, total, page, limit, totalPages: Math.ceil(total / limit) },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch users';
      res.status(500).json({ success: false, error: message });
    }
  },
};
