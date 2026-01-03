import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { ProductVariantService } from './product-variant.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('product-variant')
export class ProductVariantController {
  constructor(private productVariantService: ProductVariantService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SELLER')
  @Post('create')
  createProductVariant(@Body() body: CreateProductVariantDto) {
    return this.productVariantService.createProductVariant(body);
  }
}
