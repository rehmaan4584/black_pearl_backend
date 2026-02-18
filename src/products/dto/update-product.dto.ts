// Removed enums for type, size, color
import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsInt,
  IsBoolean,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';

class UpdateImageDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id?: number; // For updating existing image

  @IsInt()
  @Type(() => Number)
  productVariantId: number;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isPrimary?: boolean;

  @IsInt()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  sortOrder?: number;

  @IsString()
  @IsOptional()
  url?: string;

  @IsString()
  @IsOptional()
  publicId?: string;
}

class UpdateVariantDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id?: number; // For updating existing variant


  @IsOptional()
  @IsInt()
  sizeId?: number;

  @IsOptional()
  @IsInt()
  colorId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  price?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  stock?: number;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateImageDto)
  images?: UpdateImageDto[];
}

export class UpdateProductDto {
   @IsOptional()
  @IsInt()
  @Type(() => Number)
  id?: number; // For updating existing variant
  
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  subCategoryId?: number;

  @IsOptional()
  gender?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateVariantDto)
  variants?: UpdateVariantDto[];
}