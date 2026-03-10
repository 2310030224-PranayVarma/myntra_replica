import { Request, Response } from 'express';
import { productService } from '../services/product.service';
import { ProductFilterQuery } from '../types';

export const productController = {
  async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query as ProductFilterQuery;
      const result = await productService.getProducts(query);
      res.json({ success: true, data: result });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch products';
      res.status(500).json({ success: false, error: message });
    }
  },

  async getProduct(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const product = await productService.getProduct(slug);
      res.json({ success: true, data: product });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch product';
      const status = message === 'Product not found' ? 404 : 500;
      res.status(status).json({ success: false, error: message });
    }
  },

  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const product = await productService.createProduct(req.body);
      res.status(201).json({ success: true, data: product });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create product';
      res.status(400).json({ success: false, error: message });
    }
  },

  async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const product = await productService.updateProduct(id, req.body);
      res.json({ success: true, data: product });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update product';
      res.status(400).json({ success: false, error: message });
    }
  },

  async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await productService.deleteProduct(id);
      res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete product';
      res.status(400).json({ success: false, error: message });
    }
  },
};
