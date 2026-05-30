
import { IsInt, IsOptional, Min } from 'class-validator';

export class CreateProductVariantDto {
  @IsInt()
  productId: number;

  @IsInt()
  sizeId: number;

  @IsInt()
  colorId: number;

  @IsInt()
  price: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;
}
