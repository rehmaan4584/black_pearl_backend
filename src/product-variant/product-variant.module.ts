import { Module } from '@nestjs/common';
import { ProductVariantController } from './product-variant.controller';
import { ProductVariantService } from './product-variant.service';
import { ProductVariantRepository } from './repository/product-variant.repository';
import { PrismaService } from 'src/prisma.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ProductVariantController],
  providers: [ProductVariantService, ProductVariantRepository, PrismaService],
})
export class ProductVariantModule {}
