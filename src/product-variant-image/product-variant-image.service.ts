import { Injectable } from '@nestjs/common';
import { ProductVariantImageRepository } from './repository/product-variant-image.repository';
import { ProductVariantImageDto } from './dto/create-product-variant-image.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class ProductVariantImageService {
  constructor(
    private productVariantImageRepository: ProductVariantImageRepository,
    private cloudinaryService: CloudinaryService,
  ) {}

  async createProductVariantImage(
    file: Express.Multer.File,
    dto: ProductVariantImageDto,
  ) {
    const { url, publicId } = await this.cloudinaryService.uploadImage(file);

    const data = {
      ...dto,
      url,
      publicId,
    };

    return this.productVariantImageRepository.createProductVariantImage(data);
  }
}
