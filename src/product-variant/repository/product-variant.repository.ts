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
}
