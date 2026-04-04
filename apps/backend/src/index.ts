import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { authRoutes } from './routes/auth.routes';
import { productRoutes } from './routes/product.routes';
import { categoryRoutes } from './routes/category.routes';
import { cartRoutes } from './routes/cart.routes';
import { wishlistRoutes } from './routes/wishlist.routes';
import { orderRoutes } from './routes/order.routes';
import { adminRoutes } from './routes/admin.routes';
import { bootstrapService } from './services/bootstrap.service';
import { connectMongo } from './lib/mongo';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const defaultAllowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];
const allowedOrigins = (process.env.CORS_ORIGIN || defaultAllowedOrigins.join(','))
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  const message = process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message;
  res.status(500).json({ error: message });
});

app.listen(PORT, async () => {
  try {
    await bootstrapService.ensureAdminAccount();
  } catch (error) {
    console.error('Admin bootstrap failed:', error instanceof Error ? error.message : error);
  }

  try {
    await connectMongo();
    if (process.env.MONGODB_URI) {
      console.log('MongoDB Atlas connected');
    }
  } catch (error) {
    console.error('MongoDB Atlas connection failed:', error instanceof Error ? error.message : error);
  }

  console.log(`Server running on port ${PORT}`);
});

export default app;
