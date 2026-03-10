import { prisma } from '../lib/prisma';
import { OrderStatus } from '@prisma/client';

interface CreateOrderInput {
  shippingAddressId: string;
  paymentMethod: string;
}

export const orderService = {
  async createOrder(userId: string, input: CreateOrderInput) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: { include: { product: true } },
      },
    });

    if (!cart || cart.items.length === 0) throw new Error('Cart is empty');

    const address = await prisma.address.findFirst({
      where: { id: input.shippingAddressId, userId },
    });
    if (!address) throw new Error('Shipping address not found');

    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${item.product.name}`);
      }
    }

    const subtotal = cart.items.reduce((sum, item) => {
      const price = item.product.discountPrice || item.product.price;
      return sum + price * item.quantity;
    }, 0);

    const tax = subtotal * 0.18;
    const shippingCost = subtotal > 999 ? 0 : 99;
    const total = subtotal + tax + shippingCost;

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          subtotal,
          tax,
          shippingCost,
          total,
          shippingAddressId: input.shippingAddressId,
          paymentMethod: input.paymentMethod,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.discountPrice || item.product.price,
              size: item.size,
              color: item.color,
            })),
          },
        },
        include: {
          items: { include: { product: true } },
          shippingAddress: true,
        },
      });

      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return newOrder;
    });

    return order;
  },

  async getOrders(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: { include: { images: { where: { isPrimary: true }, take: 1 } } },
          },
        },
        shippingAddress: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getOrder(userId: string, orderId: string) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        items: { include: { product: { include: { images: true } } } },
        shippingAddress: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });
    if (!order) throw new Error('Order not found');
    return order;
  },

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new Error('Order not found');

    return prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { items: true, shippingAddress: true },
    });
  },

  async cancelOrder(userId: string, orderId: string) {
    const order = await prisma.order.findFirst({ where: { id: orderId, userId } });
    if (!order) throw new Error('Order not found');

    if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
      throw new Error('Order cannot be cancelled at this stage');
    }

    return prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
    });
  },

  async getAllOrders(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.order.findMany({
        skip,
        take: limit,
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: { include: { product: true } },
          shippingAddress: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count(),
    ]);
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  },
};
