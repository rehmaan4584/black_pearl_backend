import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import configuration from './config/app.config';
import { configValidationSchema } from './config/app.config.schema';
import { ProductsModule } from './products/products.module';
import { ProductVariantModule } from './product-variant/product-variant.module';
import { ProductVariantImageModule } from './product-variant-image/product-variant-image.module';
import { CategoryModule } from './category/category.module';
import { SubCategoryModule } from './sub-category/sub-category.module';
import { SizeModule } from './size/size.module';
import { ColorModule } from './color/color.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: configValidationSchema,
    }),
    AuthModule,
    UserModule,
    ProductsModule,
    ProductVariantModule,
    ProductVariantImageModule,
    CategoryModule,
    SubCategoryModule,
    SizeModule,
    ColorModule,
    CartModule,
  ],
  controllers: [],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
