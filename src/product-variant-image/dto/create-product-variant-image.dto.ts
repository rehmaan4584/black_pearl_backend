import { Type } from 'class-transformer';
import { IsString, IsInt, IsBoolean, IsOptional } from 'class-validator';

export class ProductVariantImageDto {
  @IsInt()
  @Type(() => Number)
  productVariantId: number;

  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;

  @IsInt()
  @IsOptional()
  sortOrder?: number;

  // These will be set by backend after Cloudinary upload
  @IsString()
  @IsOptional()
  url?: string;

  @IsString()
  @IsOptional()
  publicId?: string;
}
