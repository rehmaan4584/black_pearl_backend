import { Module } from '@nestjs/common';
import { CategoryModule } from 'src/category/category.module';
import { SubCategoryController } from './sub-category.controller';
import { SubCategoryRepository } from './repository/sub-category.repository';
import { SubCategoryService } from './sub-category.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports:[CategoryModule],
  controllers: [SubCategoryController],
 providers: [SubCategoryService, SubCategoryRepository,PrismaService],
  exports: [SubCategoryService, SubCategoryRepository],
})
export class SubCategoryModule {}
