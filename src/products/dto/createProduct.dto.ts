
import { IsOptional, IsString, IsInt } from 'class-validator';

export class CreateProductDto {
  @IsString()
  title: string;

  @IsString()
  description: string;


  @IsInt()
  subCategoryId: number;

  @IsString()
  gender: string; // or use enum if still present

  @IsOptional()
  @IsString()
  brand?: string;
}
