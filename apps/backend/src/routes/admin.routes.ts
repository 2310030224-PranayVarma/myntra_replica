import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { authenticate, requireAdmin } from '../middleware/auth';

export const adminRoutes = Router();

adminRoutes.use(authenticate, requireAdmin);
adminRoutes.get('/stats', adminController.getDashboardStats);
adminRoutes.get('/products', adminController.getAdminProducts);
adminRoutes.get('/orders', adminController.getAdminOrders);
adminRoutes.get('/users', adminController.getAdminUsers);
