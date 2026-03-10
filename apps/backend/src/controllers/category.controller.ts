import { Request, Response } from 'express';
import { categoryService } from '../services/category.service';

export const categoryController = {
  async getCategories(_req: Request, res: Response): Promise<void> {
    try {
      const categories = await categoryService.getCategories();
      res.json({ success: true, data: categories });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch categories';
      res.status(500).json({ success: false, error: message });
    }
  },

  async getCategory(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const category = await categoryService.getCategory(slug);
      res.json({ success: true, data: category });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch category';
      const status = message === 'Category not found' ? 404 : 500;
      res.status(status).json({ success: false, error: message });
    }
  },

  async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const category = await categoryService.createCategory(req.body);
      res.status(201).json({ success: true, data: category });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create category';
      res.status(400).json({ success: false, error: message });
    }
  },

  async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const category = await categoryService.updateCategory(id, req.body);
      res.json({ success: true, data: category });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update category';
      res.status(400).json({ success: false, error: message });
    }
  },

  async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await categoryService.deleteCategory(id);
      res.json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete category';
      res.status(400).json({ success: false, error: message });
    }
  },
};
