
import { IsOptional, IsString, IsInt, IsEnum } from 'class-validator';
import { ProductGender } from 'src/generated/prisma/enums';

export class CreateProductDto {
  @IsString()
  title: string;

  @IsString()
  description: string;


  @IsInt()
  subCategoryId: number;

  @IsEnum(ProductGender)
  gender: ProductGender;

  @IsOptional()
  @IsString()
  brand?: string;
}
