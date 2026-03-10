import { prisma } from '../lib/prisma';

interface AddToCartInput {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
}

interface UpdateCartItemInput {
  quantity: number;
}

export const cartService = {
  async getCart(userId: string) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: { images: { where: { isPrimary: true }, take: 1 } },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                include: { images: { where: { isPrimary: true }, take: 1 } },
              },
            },
          },
        },
      });
    }

    const subtotal = cart.items.reduce((sum, item) => {
      const price = item.product.discountPrice || item.product.price;
      return sum + price * item.quantity;
    }, 0);

    return { ...cart, subtotal };
  },

  async addToCart(userId: string, input: AddToCartInput) {
    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }

    const product = await prisma.product.findUnique({ where: { id: input.productId } });
    if (!product) throw new Error('Product not found');
    if (!product.isActive) throw new Error('Product is not available');
    if (product.stock < input.quantity) throw new Error('Insufficient stock');

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: input.productId,
        size: input.size || null,
        color: input.color || null,
      },
    });

    if (existingItem) {
      return prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + input.quantity },
        include: { product: { include: { images: { where: { isPrimary: true }, take: 1 } } } },
      });
    }

    return prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: input.productId,
        quantity: input.quantity,
        size: input.size,
        color: input.color,
      },
      include: { product: { include: { images: { where: { isPrimary: true }, take: 1 } } } },
    });
  },

  async updateCartItem(userId: string, itemId: string, input: UpdateCartItemInput) {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new Error('Cart not found');

    const item = await prisma.cartItem.findFirst({ where: { id: itemId, cartId: cart.id } });
    if (!item) throw new Error('Cart item not found');

    if (input.quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: itemId } });
      return null;
    }

    return prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: input.quantity },
      include: { product: { include: { images: { where: { isPrimary: true }, take: 1 } } } },
    });
  },

  async removeFromCart(userId: string, itemId: string) {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new Error('Cart not found');

    const item = await prisma.cartItem.findFirst({ where: { id: itemId, cartId: cart.id } });
    if (!item) throw new Error('Cart item not found');

    await prisma.cartItem.delete({ where: { id: itemId } });
  },

  async clearCart(userId: string) {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new Error('Cart not found');

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  },
};
