import { BadRequestException, Injectable } from '@nestjs/common';
import { OrderStatus } from 'src/generated/prisma/enums';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

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
    });
  }
}
