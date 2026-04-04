import { OrderStatus } from '@prisma/client';
import { z } from 'zod';

const cuidSchema = z.string().regex(/^c[a-z0-9]{24}$/i, 'Invalid id format');

const positiveIntFromQuery = z.coerce
  .number()
  .int()
  .min(1)
  .max(1000);

export const paginationQuerySchema = z.object({
  page: positiveIntFromQuery.optional(),
  limit: positiveIntFromQuery.optional(),
});

export const adminProductListQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().max(200).optional(),
});

export const adminOrderListQuerySchema = paginationQuerySchema.extend({
  status: z.nativeEnum(OrderStatus).optional(),
});

export const adminUserListQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().max(200).optional(),
});

export const idParamSchema = z.object({
  id: cuidSchema,
});

const imageSchema = z.object({
  url: z.string().url('Image URL must be a valid URL'),
  alt: z.string().trim().max(200).optional(),
  isPrimary: z.boolean().optional(),
});

const baseProductSchema = z.object({
  name: z.string().trim().min(2).max(150),
  description: z.string().trim().min(10).max(5000),
  price: z.coerce.number().positive(),
  discountPrice: z.coerce.number().positive().optional(),
  stock: z.coerce.number().int().min(0),
  sku: z.string().trim().min(2).max(100),
  categoryId: z.string().trim().min(1),
  brand: z.string().trim().min(2).max(100),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  images: z.array(imageSchema).max(10).optional(),
  tags: z.array(z.string().trim().min(1).max(50)).max(20).optional(),
});

export const createAdminProductSchema = baseProductSchema.refine(
  (data) => data.discountPrice === undefined || data.discountPrice <= data.price,
  {
    path: ['discountPrice'],
    message: 'Discount price cannot be greater than price',
  }
);

export const updateAdminProductSchema = baseProductSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required for update',
  })
  .refine(
    (data) =>
      data.discountPrice === undefined ||
      data.price === undefined ||
      data.discountPrice <= data.price,
    {
      path: ['discountPrice'],
      message: 'Discount price cannot be greater than price',
    }
  );

export const updateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});
