import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus } from 'src/generated/prisma/enums';
import { PrismaService } from 'src/prisma.service';

const orderInclude = {
  user: {
    select: {
      id: true,
      email: true,
      name: true,
    },
  },
  orderItems: {
    include: {
      productVariant: {
        include: {
          product: true,
          size: true,
          color: true,
        },
      },
    },
  },
} as const;

const sellerStatusTransitions: Partial<
  Record<OrderStatus, OrderStatus[]>
> = {
  [OrderStatus.PAID]: [OrderStatus.SHIPPED],
  [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
};

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  private toOrderResponse(order: {
    id: number;
    status: string;
    totalAmount: number;
    orderItems: {
      id: number;
      productVariantId: number;
      quantity: number;
      price: number;
      productVariant: {
        product: { id: number; title: string };
        size: { name: string };
        color: { name: string };
      };
    }[];
  }) {
    return {
      id: order.id,
      status: order.status,
      totalAmount: order.totalAmount,
      items: order.orderItems.map((item) => ({
        id: item.id,
        productVariantId: item.productVariantId,
        quantity: item.quantity,
        price: item.price,
        lineTotal: item.quantity * item.price,
        product: {
          id: item.productVariant.product.id,
          title: item.productVariant.product.title,
        },
        variant: {
          size: item.productVariant.size.name,
          color: item.productVariant.color.name,
        },
      })),
    };
  }

  private toSellerOrderSummary(order: {
    id: number;
    status: string;
    totalAmount: number;
    createdAt: Date;
    user: { id: number; email: string; name: string | null };
    orderItems: { id: number }[];
  }) {
    return {
      id: order.id,
      status: order.status,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      itemCount: order.orderItems.length,
      customer: {
        id: order.user.id,
        email: order.user.email,
        name: order.user.name,
      },
    };
  }

  private toSellerOrderDetail(order: {
    id: number;
    status: string;
    totalAmount: number;
    createdAt: Date;
    updatedAt: Date;
    user: { id: number; email: string; name: string | null };
    orderItems: {
      id: number;
      productVariantId: number;
      quantity: number;
      price: number;
      productVariant: {
        product: { id: number; title: string };
        size: { name: string };
        color: { name: string };
      };
    }[];
  }) {
    return {
      ...this.toSellerOrderSummary(order),
      updatedAt: order.updatedAt,
      items: order.orderItems.map((item) => ({
        id: item.id,
        productVariantId: item.productVariantId,
        quantity: item.quantity,
        price: item.price,
        lineTotal: item.quantity * item.price,
        product: {
          id: item.productVariant.product.id,
          title: item.productVariant.product.title,
        },
        variant: {
          size: item.productVariant.size.name,
          color: item.productVariant.color.name,
        },
      })),
    };
  }

  async findAllForSeller() {
    const orders = await this.prisma.order.findMany({
      include: orderInclude,
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((order) => this.toSellerOrderSummary(order));
  }

  async findByIdForSeller(orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: orderInclude,
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    return this.toSellerOrderDetail(order);
  }

  async updateStatusForSeller(orderId: number, nextStatus: OrderStatus) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    const allowedNext = sellerStatusTransitions[order.status] ?? [];

    if (!allowedNext.includes(nextStatus)) {
      throw new BadRequestException(
        `Cannot change order status from ${order.status} to ${nextStatus}`,
      );
    }

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: nextStatus },
      include: orderInclude,
    });

    return this.toSellerOrderDetail(updated);
  }

  async createFromCart(userId: number) {
    return this.prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              productVariant: {
                include: {
                  inventory: true,
                  product: true,
                  size: true,
                  color: true,
                },
              },
            },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        throw new BadRequestException('Cart is empty');
      }

      const totalAmount = cart.items.reduce(
        (total, item) => total + item.quantity * item.productVariant.price,
        0,
      );

      for (const item of cart.items) {
        const availableQuantity = item.productVariant.inventory?.quantity ?? 0;
        if (availableQuantity < item.quantity) {
          throw new BadRequestException(
            `${item.productVariant.product.title} does not have enough stock`,
          );
        }
      }

      const order = await tx.order.create({
        data: {
          userId,
          status: OrderStatus.PENDING,
          totalAmount,
          orderItems: {
            create: cart.items.map((item) => ({
              productVariantId: item.productVariantId,
              quantity: item.quantity,
              price: item.productVariant.price,
            })),
          },
        },
        include: {
          orderItems: {
            include: {
              productVariant: {
                include: {
                  product: true,
                  size: true,
                  color: true,
                },
              },
            },
          },
        },
      });

      for (const item of cart.items) {
        const result = await tx.inventory.updateMany({
          where: {
            productVariantId: item.productVariantId,
            quantity: { gte: item.quantity },
          },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });

        if (result.count === 0) {
          throw new BadRequestException(
            `${item.productVariant.product.title} stock changed. Try again.`,
          );
        }
      }

      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return this.toOrderResponse(order);
    });
  }

  async markPaid(orderId: number) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.PAID },
    });
  }

  async cancelPendingOrder(orderId: number, userId?: number) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findFirst({
        where: {
          id: orderId,
          status: OrderStatus.PENDING,
          ...(userId ? { userId } : {}),
        },
        include: {
          orderItems: true,
        },
      });

      if (!order) {
        return null;
      }

      for (const item of order.orderItems) {
        await tx.inventory.update({
          where: { productVariantId: item.productVariantId },
          data: {
            quantity: {
              increment: item.quantity,
            },
          },
        });
      }

      return tx.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.CANCELLED },
      });
    });
  }
}
