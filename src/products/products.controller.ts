import { Controller, Post, Body, UseGuards,Get,Put, Param, ParseIntPipe } from '@nestjs/common';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('products')
export class ProductsController {
  constructor(private productService: ProductsService) {}

  @Get()
  getPublicProducts() {
    return this.productService.getPublicProducts();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SELLER')
  @Post('create')
  createProduct(@Body() body: CreateProductDto) {
    return this.productService.createProduct(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SELLER')
  @Get('get-all-withDetails')
  getAllProducts() {
    return this.productService.getAllProductsWithDetails();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SELLER')
  @Get('details/:id')
  getPoductDetailById(
  @Param('id',ParseIntPipe) id: number,
 ) {
    return this.productService.getProductDetailById(id);
  }
  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SELLER')
  @Put('update-product-with-variant/:id')
  updateProductWithVariants(
  @Param('id',ParseIntPipe) id: number,
  @Body() body: UpdateProductDto ) {
    return this.productService.updateProductWithVariants(id,body);
  }

  @Get(':id')
  getPublicProductById(@Param('id', ParseIntPipe) id: number) {
    return this.productService.getPublicProductById(id);
  }

}
