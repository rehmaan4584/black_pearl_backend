import { PrismaService } from 'src/prisma.service';
import { Product } from 'src/generated/prisma/client';
import { CreateProductDto } from '../dto/createProduct.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Injectable } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class ProductRepository {
  constructor(private prisma: PrismaService) {}

  createProduct(data: CreateProductDto): Promise<Product | null> {
    return this.prisma.product.create({ data });
  }

  getPublicProducts() {
    return this.prisma.product.findMany({
      include: {
        subCategory: {
          include: {
            category: true,
          },
        },
        variants: {
          include: {
            size: true,
            color: true,
            inventory: true,
            images: {
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  getPublicProductById(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        subCategory: {
          include: {
            category: true,
          },
        },
        variants: {
          include: {
            size: true,
            color: true,
            inventory: true,
            images: {
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
      },
    });
  }

  getAllProductsWithDetails() {
    return this.prisma.product.findMany({
      include: {
        subCategory: {
          include: {
            category: true,
          },
        },
        variants: {
          include: {
            size: true,
            color: true,
            inventory: true,
            images: {
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  productDetailById(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        subCategory: {
          include: {
            category: true,
          },
        },
        variants: {
          include: {
            size: true,
            color: true,
            inventory: true,
            images: {
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
      },
    });
  }

  updateProduct(id: number, data: Prisma.ProductUpdateInput): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }
}
