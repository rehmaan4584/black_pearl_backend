import { PrismaService } from 'src/prisma.service';
import { Product } from 'src/generated/prisma/client';
import { CreateProductDto } from '../dto/createProduct.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductRepository {
  constructor(private prisma: PrismaService) {}

  createProduct(data: CreateProductDto): Promise<Product | null> {
    return this.prisma.product.create({ data });
  }
}
