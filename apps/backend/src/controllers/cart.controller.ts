import { Response } from 'express';
import { cartService } from '../services/cart.service';
import { AuthRequest } from '../types';

export const cartController = {
  async getCart(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) { res.status(401).json({ success: false, error: 'Unauthorized' }); return; }
      const cart = await cartService.getCart(req.user.userId);
      res.json({ success: true, data: cart });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch cart';
      res.status(500).json({ success: false, error: message });
    }
  },

  async addToCart(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) { res.status(401).json({ success: false, error: 'Unauthorized' }); return; }
      const item = await cartService.addToCart(req.user.userId, req.body);
      res.status(201).json({ success: true, data: item });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add to cart';
      res.status(400).json({ success: false, error: message });
    }
  },

  async updateCartItem(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) { res.status(401).json({ success: false, error: 'Unauthorized' }); return; }
      const { itemId } = req.params;
      const item = await cartService.updateCartItem(req.user.userId, itemId, req.body);
      res.json({ success: true, data: item });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update cart item';
      res.status(400).json({ success: false, error: message });
    }
  },

  async removeFromCart(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) { res.status(401).json({ success: false, error: 'Unauthorized' }); return; }
      const { itemId } = req.params;
      await cartService.removeFromCart(req.user.userId, itemId);
      res.json({ success: true, message: 'Item removed from cart' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to remove from cart';
      res.status(400).json({ success: false, error: message });
    }
  },

  async clearCart(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) { res.status(401).json({ success: false, error: 'Unauthorized' }); return; }
      await cartService.clearCart(req.user.userId);
      res.json({ success: true, message: 'Cart cleared' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to clear cart';
      res.status(400).json({ success: false, error: message });
    }
  },
};
