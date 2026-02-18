import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class CategoryRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCategoryDto) {
    return await this.prisma.category.create({
      data,
    });
  }

  async findAll() {
    return await this.prisma.category.findMany({
      include: {
        subCategories: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findById(id: number) {
    return await this.prisma.category.findUnique({
      where: { id },
      include: {
        subCategories: true,
      },
    });
  }

  async findBySlug(slug: string) {
    return await this.prisma.category.findUnique({
      where: { slug },
    });
  }

  async findByName(name: string) {
    return await this.prisma.category.findUnique({
      where: { name },
    });
  }

  async update(id: number, data: UpdateCategoryDto) {
    return await this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return await this.prisma.category.delete({
      where: { id },
    });
  }

  async countSubCategories(categoryId: number) {
    return await this.prisma.subCategory.count({
      where: { categoryId },
    });
  }
}