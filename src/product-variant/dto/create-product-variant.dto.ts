import { IsEnum, IsInt, IsString } from 'class-validator';
import {
  ProductVariantSizes,
  ProductVariantColors,
} from 'src/generated/prisma/enums';

export class CreateProductVariantDto {
  @IsInt()
  productId: number;

  @IsEnum(ProductVariantSizes)
  size: ProductVariantSizes;

  @IsEnum(ProductVariantColors)
  color: ProductVariantColors;

  @IsInt()
  price: number;

}
