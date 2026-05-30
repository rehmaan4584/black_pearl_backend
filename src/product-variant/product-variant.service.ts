import { Injectable } from '@nestjs/common';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { ProductVariantRepository } from './repository/product-variant.repository';
import { ProductVariant } from 'src/generated/prisma/client';

@Injectable()
export class ProductVariantService {
  constructor(private productVariantRepo: ProductVariantRepository) {}

  async createProductVariant(
    dto: CreateProductVariantDto,
  ): Promise<ProductVariant | null> {
    const sku = this.generateSku(dto);
    const { stock, ...variantData } = dto;
    const variant = await this.productVariantRepo.createProductVariant({
      ...variantData,
      sku,
    });

    await this.productVariantRepo.upsertInventory(variant.id, stock ?? 0);
    return variant;
  }

  private generateSku(dto: CreateProductVariantDto): string {
    return `${Date.now()}-${dto.sizeId}-${dto.colorId}`;
  }
}
