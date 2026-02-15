import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductRepository } from './repository/product.repository';
import { AuthModule } from 'src/auth/auth.module';
import { ProductVariantModule } from 'src/product-variant/product-variant.module';
import { ProductVariantImageModule } from 'src/product-variant-image/product-variant-image.module';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [AuthModule,ProductVariantModule,ProductVariantImageModule],
  providers: [ProductsService,ProductRepository,PrismaService],
  controllers: [ProductsController]
})  
export class ProductsModule {}
