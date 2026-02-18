import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateColorDto } from '../dto/create-color.dto';
import { UpdateColorDto } from '../dto/update-color.dto';

@Injectable()
export class ColorRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateColorDto) {
    return await this.prisma.color.create({
      data,
    });
  }

  async findAll() {
    return await this.prisma.color.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findById(id: number) {
    return await this.prisma.color.findUnique({
      where: { id },
    });
  }

  async findByName(name: string) {
    return await this.prisma.color.findUnique({
      where: { name },
    });
  }

  async findByHexCode(hexCode: string) {
    return await this.prisma.color.findUnique({
      where: { hexCode },
    });
  }

  async update(id: number, data: UpdateColorDto) {
    return await this.prisma.color.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return await this.prisma.color.delete({
      where: { id },
    });
  }

  async countProductVariants(colorId: number) {
    return await this.prisma.productVariant.count({
      where: { colorId },
    });
  }
}