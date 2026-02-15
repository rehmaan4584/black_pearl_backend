import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma, ProductVariantImage } from 'src/generated/prisma/client';

@Injectable()
export class ProductVariantImageRepository {
  constructor(private prisma: PrismaService) {}
  createProductVariantImage(
    data: Prisma.ProductVariantImageUncheckedCreateInput,
  ): Promise<ProductVariantImage> {
    return this.prisma.productVariantImage.create({ data });
  }


  updateProductVariantImage(
    id: number,
    data: Prisma.ProductVariantImageUpdateInput,
  ): Promise<ProductVariantImage> {
    return this.prisma.productVariantImage.update({
      where: { id },
      data,
    });
  }

  deleteByVariantId(productVariantId: number) {
    return this.prisma.productVariantImage.deleteMany({
      where: { productVariantId },
    });
  }

  deleteById(id: number) {
    return this.prisma.productVariantImage.delete({
      where: { id },
    });
  }
}
