import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from './repository/product.repository';
import { Product } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma.service';
import { ProductVariantRepository } from 'src/product-variant/repository/product-variant.repository';
import { ProductVariantImageRepository } from 'src/product-variant-image/repository/product-variant-image.repository';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private productRepo: ProductRepository,
    private variantRepo: ProductVariantRepository,
    private imageRepo: ProductVariantImageRepository,
  ) {}

  createProduct(data: CreateProductDto): Promise<Product | null> {
    return this.productRepo.createProduct(data);
  }

  getAllProductsWithDetails() {
    return this.productRepo.getAllProductsWithDetails();
  }
  getProductDetailById(id:number){
    return this.productRepo.productDetailById(id);
  }

  async updateProductWithVariants(id: number, data: UpdateProductDto) {
  return await this.prisma.$transaction(async (tx) => {
    
    // 1️⃣ STEP 1: Update Product (Parent)
    const updatedProduct = await this.productRepo.updateProduct(id, {
      title: data.title,
      description: data.description,
      subCategory: data.subCategoryId ? { connect: { id: data.subCategoryId } } : undefined,
      gender: data.gender as any,
      brand: data.brand,
    });

    // 2️⃣ STEP 2: Update Variants (Child of Product)
    if (data.variants && data.variants.length > 0) {
      for (const variant of data.variants) {
        if (variant.id) {
          // Existing variant update
          const updatedVariant = await this.variantRepo.updateProductVariant(
            variant.id,
            {
              size: variant.sizeId ? { connect: { id: variant.sizeId } } : undefined,
              color: variant.colorId ? { connect: { id: variant.colorId } } : undefined,
              price: variant.price,
              sku: variant.sku,
            }
          );

          // 3️⃣ STEP 3: Update Images (Child of Variant)
          if (variant.images && variant.images.length > 0) {
            for (const image of variant.images) {
              if (image.id) {
                // Update existing image
                await this.imageRepo.updateProductVariantImage(image.id, {
                  url: image.url ?? '',
                  publicId: image.publicId ?? '',
                  isPrimary: image.isPrimary,
                  sortOrder: image.sortOrder,
                });
              } else {
                // Create new image
                await this.imageRepo.createProductVariantImage({
                  productVariantId: updatedVariant.id,
                  url: image.url ?? '',
                  publicId: image.publicId ?? '',
                  isPrimary: image.isPrimary,
                  sortOrder: image.sortOrder,
                });
              }
            }
          }
        } else {
          // Create new variant
          const newVariant = await this.variantRepo.createProductVariant({
            productId: id,
            sizeId: variant.sizeId!,
            colorId: variant.colorId!,
            price: variant.price!,
            sku: variant.sku!,
          });

          // Add images for new variant
          if (variant.images && variant.images.length > 0) {
            for (const image of variant.images) {
              await this.imageRepo.createProductVariantImage({
                productVariantId: newVariant.id,
                url: image.url ?? '',
                publicId: image.publicId ?? '',
                isPrimary: image.isPrimary,
                sortOrder: image.sortOrder,
              });
            }
          }
        }
      }
    }

    // Return updated product with all details
    return this.productRepo.productDetailById(id);
  });
}
}
