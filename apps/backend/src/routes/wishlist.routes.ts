import { Router, Request, Response } from 'express';
import { wishlistController } from '../controllers/wishlist.controller';
import { authenticate } from '../middleware/auth';
import { AuthRequest } from '../types';

export const wishlistRoutes = Router();

wishlistRoutes.use(authenticate);
wishlistRoutes.get('/', (req: Request, res: Response) => wishlistController.getWishlist(req as AuthRequest, res));
wishlistRoutes.post('/', (req: Request, res: Response) => wishlistController.addToWishlist(req as AuthRequest, res));
wishlistRoutes.delete('/:productId', (req: Request, res: Response) => wishlistController.removeFromWishlist(req as AuthRequest, res));
