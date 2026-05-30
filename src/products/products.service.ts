import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from './repository/product.repository';
import { Product } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma.service';
import { ProductVariantRepository } from 'src/product-variant/repository/product-variant.repository';
import { ProductVariantImageRepository } from 'src/product-variant-image/repository/product-variant-image.repository';
import { SubCategoryRepository } from 'src/sub-category/repository/sub-category.repository';

type StoreProductSource = {
  id: number;
  title: string;
  description: string;
  gender: string;
  brand: string;
  subCategory?: {
    name?: string | null;
    category?: {
      name?: string | null;
    } | null;
  } | null;
  variants: StoreProductVariantSource[];
};

type StoreProductVariantSource = {
  id: number;
  productId: number;
  size?: {
    name?: string | null;
  } | null;
  color?: {
    name?: string | null;
    hexCode?: string | null;
  } | null;
  sku: string;
  price: number;
  images: unknown[];
  inventory?: {
    quantity: number;
  } | null;
};

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private productRepo: ProductRepository,
    private variantRepo: ProductVariantRepository,
    private imageRepo: ProductVariantImageRepository,
    private subCategoryRepo: SubCategoryRepository,
  ) {}

  private toStoreFilterValue(value?: string | null) {
    return value?.trim().toUpperCase().replace(/\s+/g, '_') ?? 'UNCATEGORIZED';
  }

  private toStoreProduct(product: StoreProductSource) {
    const productType =
      product.subCategory?.name ?? product.subCategory?.category?.name;

    return {
      id: product.id,
      title: product.title,
      description: product.description,
      type: this.toStoreFilterValue(productType),
      gender: product.gender,
      brand: product.brand,
      variants: product.variants.map((variant) => ({
        id: variant.id,
        productId: variant.productId,
        size: variant.size?.name ?? '',
        color: this.toStoreFilterValue(variant.color?.name),
        colorName: variant.color?.name ?? '',
        colorHex: variant.color?.hexCode ?? null,
        sku: variant.sku,
        price: variant.price,
        images: variant.images,
        inventory: variant.inventory
          ? { quantity: variant.inventory.quantity }
          : { quantity: 0 },
      })),
    };
  }

  async createProduct(data: CreateProductDto): Promise<Product | null> {
    if (data.subCategoryId) {
      const subCategory = await this.subCategoryRepo.findById(
        data.subCategoryId,
      );
      if (!subCategory) {
        throw new NotFoundException(
          `SubCategory with ID ${data.subCategoryId} not found`,
        );
      }
    }
    return this.productRepo.createProduct(data);
  }

  async getPublicProducts() {
    const products = await this.productRepo.getPublicProducts();
    return products.map((product) => this.toStoreProduct(product));
  }

  async getPublicProductById(id: number) {
    const product = await this.productRepo.getPublicProductById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return this.toStoreProduct(product);
  }

  getAllProductsWithDetails() {
    return this.productRepo.getAllProductsWithDetails();
  }
  getProductDetailById(id: number) {
    return this.productRepo.productDetailById(id);
  }

  async updateProductWithVariants(id: number, data: UpdateProductDto) {
    if (data.subCategoryId) {
      const subCategory = await this.subCategoryRepo.findById(
        data.subCategoryId,
      );
      if (!subCategory) {
        throw new NotFoundException(
          `SubCategory with ID ${data.subCategoryId} not found`,
        );
      }
    }
    return await this.prisma.$transaction(async (tx) => {
      // 1️⃣ STEP 1: Update Product (Parent)
      const updatedProduct = await this.productRepo.updateProduct(id, {
        title: data.title,
        description: data.description,
        subCategory: data.subCategoryId
          ? { connect: { id: data.subCategoryId } }
          : undefined,
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
                size: variant.sizeId
                  ? { connect: { id: variant.sizeId } }
                  : undefined,
                color: variant.colorId
                  ? { connect: { id: variant.colorId } }
                  : undefined,
                price: variant.price,
                sku: variant.sku,
              },
            );

            if (variant.stock !== undefined) {
              await this.variantRepo.upsertInventory(
                updatedVariant.id,
                variant.stock,
              );
            }

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

            await this.variantRepo.upsertInventory(
              newVariant.id,
              variant.stock ?? 0,
            );

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
