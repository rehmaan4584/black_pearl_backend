import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateSubCategoryDto } from '../dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from '../dto/update-sub-category.dto';

@Injectable()
export class SubCategoryRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateSubCategoryDto) {
    return await this.prisma.subCategory.create({
      data,
      include: {
        category: true,
      },
    });
  }

  async findAll() {
    return await this.prisma.subCategory.findMany({
      include: {
        category: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findById(id: number) {
    return await this.prisma.subCategory.findUnique({
      where: { id },
      include: {
        category: true,
        products: true,
      },
    });
  }

  async findBySlug(slug: string) {
    return await this.prisma.subCategory.findUnique({
      where: { slug },
    });
  }

  async findByCategoryId(categoryId: number) {
    return await this.prisma.subCategory.findMany({
      where: { categoryId },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async update(id: number, data: UpdateSubCategoryDto) {
    return await this.prisma.subCategory.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    });
  }

  async delete(id: number) {
    return await this.prisma.subCategory.delete({
      where: { id },
    });
  }

  async countProducts(subCategoryId: number) {
    return await this.prisma.product.count({
      where: { subCategoryId },
    });
  }
}