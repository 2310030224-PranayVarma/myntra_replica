import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { authenticate, requireAdmin } from '../middleware/auth';
import { validate, validateRequest } from '../middleware/validate';
import {
	createAdminProductSchema,
	updateAdminProductSchema,
	updateOrderStatusSchema,
	idParamSchema,
	adminProductListQuerySchema,
	adminOrderListQuerySchema,
	adminUserListQuerySchema,
} from '../schemas/admin.schema';

export const adminRoutes = Router();

adminRoutes.use(authenticate, requireAdmin);
adminRoutes.get('/stats', adminController.getDashboardStats);
adminRoutes.get('/products', validateRequest({ query: adminProductListQuerySchema }), adminController.getAdminProducts);
adminRoutes.get('/products/:id', validateRequest({ params: idParamSchema }), adminController.getAdminProduct);
adminRoutes.post('/products', validate(createAdminProductSchema), adminController.createAdminProduct);
adminRoutes.put('/products/:id', validateRequest({ params: idParamSchema }), validate(updateAdminProductSchema), adminController.updateAdminProduct);
adminRoutes.delete('/products/:id', validateRequest({ params: idParamSchema }), adminController.deleteAdminProduct);
adminRoutes.get('/orders', validateRequest({ query: adminOrderListQuerySchema }), adminController.getAdminOrders);
adminRoutes.get('/orders/:id', validateRequest({ params: idParamSchema }), adminController.getAdminOrder);
adminRoutes.put('/orders/:id/status', validateRequest({ params: idParamSchema }), validate(updateOrderStatusSchema), adminController.updateAdminOrderStatus);
adminRoutes.get('/users', validateRequest({ query: adminUserListQuerySchema }), adminController.getAdminUsers);
