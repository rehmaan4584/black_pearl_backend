import { Module } from '@nestjs/common';
import { ProductVariantImageController } from './product-variant-image.controller';
import { ProductVariantImageService } from './product-variant-image.service';
import { PrismaService } from 'src/prisma.service';
import { ProductVariantImageRepository } from './repository/product-variant-image.repository';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  controllers: [ProductVariantImageController],
  providers: [ProductVariantImageService, PrismaService,ProductVariantImageRepository,CloudinaryService]
})
export class ProductVariantImageModule {}
