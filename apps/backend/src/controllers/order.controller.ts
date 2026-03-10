import { Response } from 'express';
import { orderService } from '../services/order.service';
import { AuthRequest } from '../types';
import { OrderStatus } from '@prisma/client';

export const orderController = {
  async createOrder(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) { res.status(401).json({ success: false, error: 'Unauthorized' }); return; }
      const order = await orderService.createOrder(req.user.userId, req.body);
      res.status(201).json({ success: true, data: order });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create order';
      res.status(400).json({ success: false, error: message });
    }
  },

  async getOrders(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) { res.status(401).json({ success: false, error: 'Unauthorized' }); return; }
      const orders = await orderService.getOrders(req.user.userId);
      res.json({ success: true, data: orders });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch orders';
      res.status(500).json({ success: false, error: message });
    }
  },

  async getOrder(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) { res.status(401).json({ success: false, error: 'Unauthorized' }); return; }
      const { orderId } = req.params;
      const order = await orderService.getOrder(req.user.userId, orderId);
      res.json({ success: true, data: order });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch order';
      const status = message === 'Order not found' ? 404 : 500;
      res.status(status).json({ success: false, error: message });
    }
  },

  async updateOrderStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      const order = await orderService.updateOrderStatus(orderId, status as OrderStatus);
      res.json({ success: true, data: order });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update order status';
      res.status(400).json({ success: false, error: message });
    }
  },

  async cancelOrder(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) { res.status(401).json({ success: false, error: 'Unauthorized' }); return; }
      const { orderId } = req.params;
      const order = await orderService.cancelOrder(req.user.userId, orderId);
      res.json({ success: true, data: order });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to cancel order';
      res.status(400).json({ success: false, error: message });
    }
  },
};
