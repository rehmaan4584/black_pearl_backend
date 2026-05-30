import { PrismaService } from 'src/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma, ProductVariant } from 'src/generated/prisma/client';

@Injectable()
export class ProductVariantRepository {
  constructor(private prisma: PrismaService) {}

  createProductVariant(
    data: Prisma.ProductVariantUncheckedCreateInput,
  ): Promise<ProductVariant> {
    return this.prisma.productVariant.create({ data });
  }

   updateProductVariant(
    id: number,
    data: Prisma.ProductVariantUpdateInput,
  ): Promise<ProductVariant> {
    return this.prisma.productVariant.update({
      where: { id },
      data,
    });
  }

  deleteByProductId(productId: number) {
    return this.prisma.productVariant.deleteMany({
      where: { productId },
    });
  }

  deleteById(id: number) {
    return this.prisma.productVariant.delete({
      where: { id },
    });
  }

  upsertInventory(productVariantId: number, quantity: number) {
    return this.prisma.inventory.upsert({
      where: { productVariantId },
      update: { quantity },
      create: {
        productVariantId,
        quantity,
      },
    });
  }
}
