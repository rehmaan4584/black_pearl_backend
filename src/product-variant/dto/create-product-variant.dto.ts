
import { IsInt } from 'class-validator';

export class CreateProductVariantDto {
  @IsInt()
  productId: number;

  @IsInt()
  sizeId: number;

  @IsInt()
  colorId: number;

  @IsInt()
  price: number;
}
