import { Router, Request, Response } from 'express';
import { orderController } from '../controllers/order.controller';
import { authenticate, requireAdmin } from '../middleware/auth';
import { AuthRequest } from '../types';

export const orderRoutes = Router();

orderRoutes.use(authenticate);
orderRoutes.post('/', (req: Request, res: Response) => orderController.createOrder(req as AuthRequest, res));
orderRoutes.get('/', (req: Request, res: Response) => orderController.getOrders(req as AuthRequest, res));
orderRoutes.get('/:orderId', (req: Request, res: Response) => orderController.getOrder(req as AuthRequest, res));
orderRoutes.put('/:orderId/status', requireAdmin, (req: Request, res: Response) => orderController.updateOrderStatus(req as AuthRequest, res));
orderRoutes.put('/:orderId/cancel', (req: Request, res: Response) => orderController.cancelOrder(req as AuthRequest, res));
