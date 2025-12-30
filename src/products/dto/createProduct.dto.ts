import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ProductTypes, ProductGender } from 'src/generated/prisma/enums';

export class CreateProductDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(ProductTypes)
  type: ProductTypes;

  @IsEnum(ProductGender)
  gender: ProductGender; 

  @IsOptional()
  @IsString()
  brand?: string;
}
