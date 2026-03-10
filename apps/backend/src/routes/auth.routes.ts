import { Router, Response } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { AuthRequest } from '../types';

export const authRoutes = Router();

authRoutes.post('/register', authController.register);
authRoutes.post('/login', authController.login);
authRoutes.get('/profile', authenticate, (req, res: Response) =>
  authController.getProfile(req as AuthRequest, res)
);
