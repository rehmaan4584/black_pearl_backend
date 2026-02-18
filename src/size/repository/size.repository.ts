import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateSizeDto } from '../dto/create-size.dto';
import { UpdateSizeDto } from '../dto/update-size.dto';

@Injectable()
export class SizeRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateSizeDto) {
    return await this.prisma.size.create({
      data,
    });
  }

  async findAll() {
    return await this.prisma.size.findMany({
      orderBy: {
        displayOrder: 'asc', // S, M, L, XL, XXL order mein
      },
    });
  }

  async findById(id: number) {
    return await this.prisma.size.findUnique({
      where: { id },
    });
  }

  async findByName(name: string) {
    return await this.prisma.size.findUnique({
      where: { name },
    });
  }

  async update(id: number, data: UpdateSizeDto) {
    return await this.prisma.size.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return await this.prisma.size.delete({
      where: { id },
    });
  }

  async countProductVariants(sizeId: number) {
    return await this.prisma.productVariant.count({
      where: { sizeId },
    });
  }
}