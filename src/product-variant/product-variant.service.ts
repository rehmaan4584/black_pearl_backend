import { Injectable } from '@nestjs/common';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { ProductVariantRepository } from './repository/product-variant.repository';
import { ProductVariant } from 'src/generated/prisma/client';

@Injectable()
export class ProductVariantService {
  constructor(private productVariantRepo: ProductVariantRepository) {}

  createProductVariant(
    dto: CreateProductVariantDto,
  ): Promise<ProductVariant | null> {
    const sku = this.generateSku(dto);
    return this.productVariantRepo.createProductVariant({ ...dto, sku });
  }

  private generateSku(dto: CreateProductVariantDto): string {
    return `${Date.now()}-${dto.size}-${dto.color}`;
  }
}
