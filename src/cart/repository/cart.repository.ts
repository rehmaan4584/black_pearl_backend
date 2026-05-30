import { Injectable } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma.service';

type PrismaClientLike = Prisma.TransactionClient | PrismaService;

@Injectable()
export class CartRepository {
  constructor(private prisma: PrismaService) {}

  private cartInclude = {
    items: {
      include: {
        productVariant: {
          include: {
            product: true,
            size: true,
            color: true,
            inventory: true,
            images: {
              orderBy: { sortOrder: 'asc' as const },
            },
          },
        },
      },
      orderBy: { createdAt: 'asc' as const },
    },
  };

  findByUserId(userId: number, client: PrismaClientLike = this.prisma) {
    return client.cart.findUnique({
      where: { userId },
      include: this.cartInclude,
    });
  }

  createForUser(userId: number, client: PrismaClientLike = this.prisma) {
    return client.cart.create({
      data: { userId },
    });
  }

  findItem(cartId: number, productVariantId: number, client: PrismaClientLike = this.prisma) {
    return client.cartItem.findUnique({
      where: {
        cartId_productVariantId: {
          cartId,
          productVariantId,
        },
      },
    });
  }

  addItem(
    cartId: number,
    productVariantId: number,
    quantity: number,
    client: PrismaClientLike = this.prisma,
  ) {
    return client.cartItem.create({
      data: {
        cartId,
        productVariantId,
        quantity,
      },
    });
  }

  updateItemQuantity(
    cartItemId: number,
    quantity: number,
    client: PrismaClientLike = this.prisma,
  ) {
    return client.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });
  }

  findItemForUser(cartItemId: number, userId: number) {
    return this.prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        cart: { userId },
      },
      include: {
        productVariant: {
          include: {
            inventory: true,
          },
        },
      },
    });
  }

  deleteItem(cartItemId: number, userId: number) {
    return this.prisma.cartItem.deleteMany({
      where: {
        id: cartItemId,
        cart: { userId },
      },
    });
  }

  findProductVariant(productVariantId: number, client: PrismaClientLike = this.prisma) {
    return client.productVariant.findUnique({
      where: { id: productVariantId },
      include: {
        inventory: true,
      },
    });
  }

  runTransaction<T>(callback: (tx: Prisma.TransactionClient) => Promise<T>) {
    return this.prisma.$transaction(callback);
  }
}
