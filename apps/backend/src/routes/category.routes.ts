import { Router } from 'express';
import { categoryController } from '../controllers/category.controller';
import { authenticate, requireAdmin } from '../middleware/auth';

export const categoryRoutes = Router();

categoryRoutes.get('/', categoryController.getCategories);
categoryRoutes.get('/:slug', categoryController.getCategory);
categoryRoutes.post('/', authenticate, requireAdmin, categoryController.createCategory);
categoryRoutes.put('/:id', authenticate, requireAdmin, categoryController.updateCategory);
categoryRoutes.delete('/:id', authenticate, requireAdmin, categoryController.deleteCategory);
