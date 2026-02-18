import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryRepository } from './repository/category.repository';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository, PrismaService],
  exports: [CategoryService, CategoryRepository],
})
export class CategoryModule {}
