import {
  Controller,
  Post,
  UseGuards,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProductVariantImageDto } from './dto/create-product-variant-image.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductVariantImageService } from './product-variant-image.service';
import { ProductVariantImage } from 'src/generated/prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('product-variant-image')
export class ProductVariantImageController {
  constructor(private service: ProductVariantImageService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SELLER')
  @Post('create')
  @UseInterceptors(FileInterceptor('file'))
  createProductVariantImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: ProductVariantImageDto,
  ): Promise<ProductVariantImage> {
    return this.service.createProductVariantImage(file,body);
  }
}
