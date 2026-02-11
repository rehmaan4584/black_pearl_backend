import { Type } from 'class-transformer';
import { IsString, IsInt, IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class ProductVariantImageDto {
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

  // These will be set by backend after Cloudinary upload
  @IsString()
  @IsOptional()
  url?: string;

  @IsString()
  @IsOptional()
  publicId?: string;
}
