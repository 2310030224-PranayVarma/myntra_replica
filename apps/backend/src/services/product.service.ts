import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { ProductFilterQuery } from '../types';

interface CreateProductInput {
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  sku: string;
  categoryId: string;
  brand: string;
  tags?: string[];
  isFeatured?: boolean;
  isActive?: boolean;
  images?: { url: string; alt?: string; isPrimary?: boolean }[];
}

interface UpdateProductInput extends Partial<CreateProductInput> {}

export const productService = {
  async getProducts(query: ProductFilterQuery) {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '12', 10);
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = { isActive: true };

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { brand: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.category) {
      where.category = { slug: query.category };
    }

    if (query.brand) {
      where.brand = { contains: query.brand, mode: 'insensitive' };
    }

    if (query.minPrice || query.maxPrice) {
      where.price = {};
      if (query.minPrice) (where.price as Prisma.FloatFilter).gte = parseFloat(query.minPrice);
      if (query.maxPrice) (where.price as Prisma.FloatFilter).lte = parseFloat(query.maxPrice);
    }

    if (query.featured === 'true') {
      where.isFeatured = true;
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    if (query.sort === 'price_asc') orderBy = { price: 'asc' };
    else if (query.sort === 'price_desc') orderBy = { price: 'desc' };
    else if (query.sort === 'name_asc') orderBy = { name: 'asc' };

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          images: { where: { isPrimary: true }, take: 1 },
          _count: { select: { reviews: true } },
          reviews: { select: { rating: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    const productsWithRating = items.map((p) => {
      const { reviews, ...rest } = p;
      const averageRating =
        reviews.length > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : 0;
      return { ...rest, averageRating, reviewCount: reviews.length };
    });

    return {
      items: productsWithRating,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  async getProduct(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: true,
        reviews: {
          include: { user: { select: { id: true, name: true, avatar: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!product) throw new Error('Product not found');

    const averageRating =
      product.reviews.length > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
        : 0;

    return { ...product, averageRating, reviewCount: product.reviews.length };
  },

  async createProduct(input: CreateProductInput) {
    const { images, ...productData } = input;
    const product = await prisma.product.create({
      data: {
        ...productData,
        tags: productData.tags || [],
        images: images
          ? { create: images }
          : undefined,
      },
      include: { images: true, category: true },
    });
    return product;
  },

  async updateProduct(id: string, input: UpdateProductInput) {
    const { images, ...productData } = input;
    const product = await prisma.product.update({
      where: { id },
      data: productData,
      include: { images: true, category: true },
    });
    return product;
  },

  async deleteProduct(id: string) {
    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  },
};
