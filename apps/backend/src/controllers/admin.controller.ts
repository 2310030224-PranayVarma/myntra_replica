import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { orderService } from '../services/order.service';

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
            select: { id: true, name: true, price: true, images: { where: { isPrimary: true }, take: 1 } },
          });
          return { ...product, totalSold: tp._sum.quantity };
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
          topProducts: topProductDetails,
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
      const skip = (page - 1) * limit;

      const [items, total] = await Promise.all([
        prisma.product.findMany({
          skip,
          take: limit,
          include: {
            category: { select: { id: true, name: true } },
            images: { where: { isPrimary: true }, take: 1 },
            _count: { select: { reviews: true, orderItems: true } },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.product.count(),
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
      const result = await orderService.getAllOrders(page, limit);
      res.json({ success: true, data: result });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch orders';
      res.status(500).json({ success: false, error: message });
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
