import { Router, Request, Response } from 'express';
import { cartController } from '../controllers/cart.controller';
import { authenticate } from '../middleware/auth';
import { AuthRequest } from '../types';

export const cartRoutes = Router();

cartRoutes.use(authenticate);
cartRoutes.get('/', (req: Request, res: Response) => cartController.getCart(req as AuthRequest, res));
cartRoutes.post('/items', (req: Request, res: Response) => cartController.addToCart(req as AuthRequest, res));
cartRoutes.put('/items/:itemId', (req: Request, res: Response) => cartController.updateCartItem(req as AuthRequest, res));
cartRoutes.delete('/items/:itemId', (req: Request, res: Response) => cartController.removeFromCart(req as AuthRequest, res));
cartRoutes.delete('/', (req: Request, res: Response) => cartController.clearCart(req as AuthRequest, res));
