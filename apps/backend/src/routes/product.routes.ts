import { Router } from 'express';
import { productController } from '../controllers/product.controller';
import { authenticate, requireAdmin } from '../middleware/auth';

export const productRoutes = Router();

productRoutes.get('/', productController.getProducts);
productRoutes.get('/:slug', productController.getProduct);
productRoutes.post('/', authenticate, requireAdmin, productController.createProduct);
productRoutes.put('/:id', authenticate, requireAdmin, productController.updateProduct);
productRoutes.delete('/:id', authenticate, requireAdmin, productController.deleteProduct);
