import { Response } from 'express';
import { wishlistService } from '../services/wishlist.service';
import { AuthRequest } from '../types';

export const wishlistController = {
  async getWishlist(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) { res.status(401).json({ success: false, error: 'Unauthorized' }); return; }
      const items = await wishlistService.getWishlist(req.user.userId);
      res.json({ success: true, data: items });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch wishlist';
      res.status(500).json({ success: false, error: message });
    }
  },

  async addToWishlist(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) { res.status(401).json({ success: false, error: 'Unauthorized' }); return; }
      const { productId } = req.body;
      const item = await wishlistService.addToWishlist(req.user.userId, productId);
      res.status(201).json({ success: true, data: item });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add to wishlist';
      res.status(400).json({ success: false, error: message });
    }
  },

  async removeFromWishlist(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) { res.status(401).json({ success: false, error: 'Unauthorized' }); return; }
      const { productId } = req.params;
      await wishlistService.removeFromWishlist(req.user.userId, productId);
      res.json({ success: true, message: 'Removed from wishlist' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to remove from wishlist';
      res.status(400).json({ success: false, error: message });
    }
  },
};
