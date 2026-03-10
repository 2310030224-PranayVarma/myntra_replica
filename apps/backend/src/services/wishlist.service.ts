import { prisma } from '../lib/prisma';

export const wishlistService = {
  async getWishlist(userId: string) {
    return prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          include: { images: { where: { isPrimary: true }, take: 1 }, category: true },
        },
      },
      orderBy: { id: 'desc' },
    });
  },

  async addToWishlist(userId: string, productId: string) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new Error('Product not found');

    return prisma.wishlist.upsert({
      where: { userId_productId: { userId, productId } },
      update: {},
      create: { userId, productId },
      include: {
        product: {
          include: { images: { where: { isPrimary: true }, take: 1 } },
        },
      },
    });
  },

  async removeFromWishlist(userId: string, productId: string) {
    const item = await prisma.wishlist.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    if (!item) throw new Error('Wishlist item not found');

    await prisma.wishlist.delete({
      where: { userId_productId: { userId, productId } },
    });
  },
};
