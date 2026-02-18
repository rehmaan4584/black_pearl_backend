import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { SubCategoryRepository } from './repository/sub-category.repository';
import { CategoryRepository } from 'src/category/repository/category.repository';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';

@Injectable()
export class SubCategoryService {
  constructor(
    private subCategoryRepository: SubCategoryRepository,
    private categoryRepository: CategoryRepository,
  ) {}

  async create(createSubCategoryDto: CreateSubCategoryDto) {
    // Check if category exists
    const category = await this.categoryRepository.findById(
      createSubCategoryDto.categoryId,
    );
    if (!category) {
      throw new NotFoundException(
        `Category with ID ${createSubCategoryDto.categoryId} not found`,
      );
    }

    // Check if slug already exists
    const existingSlug = await this.subCategoryRepository.findBySlug(
      createSubCategoryDto.slug,
    );
    if (existingSlug) {
      throw new ConflictException('SubCategory slug already exists');
    }

    return await this.subCategoryRepository.create(createSubCategoryDto);
  }

  async findAll() {
    return await this.subCategoryRepository.findAll();
  }

  async findOne(id: number) {
    const subCategory = await this.subCategoryRepository.findById(id);

    if (!subCategory) {
      throw new NotFoundException(`SubCategory with ID ${id} not found`);
    }

    return subCategory;
  }

  async findByCategory(categoryId: number) {
    // Check if category exists
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    return await this.subCategoryRepository.findByCategoryId(categoryId);
  }

  async update(id: number, updateSubCategoryDto: UpdateSubCategoryDto) {
    // Check if subcategory exists
    const subCategory = await this.subCategoryRepository.findById(id);
    if (!subCategory) {
      throw new NotFoundException(`SubCategory with ID ${id} not found`);
    }

    // If categoryId is being updated, check if new category exists
    if (
      updateSubCategoryDto.categoryId &&
      updateSubCategoryDto.categoryId !== subCategory.categoryId
    ) {
      const category = await this.categoryRepository.findById(
        updateSubCategoryDto.categoryId,
      );
      if (!category) {
        throw new NotFoundException(
          `Category with ID ${updateSubCategoryDto.categoryId} not found`,
        );
      }
    }

    // Check if new slug conflicts
    if (
      updateSubCategoryDto.slug &&
      updateSubCategoryDto.slug !== subCategory.slug
    ) {
      const existingSlug = await this.subCategoryRepository.findBySlug(
        updateSubCategoryDto.slug,
      );
      if (existingSlug) {
        throw new ConflictException('SubCategory slug already exists');
      }
    }

    return await this.subCategoryRepository.update(id, updateSubCategoryDto);
  }

  async remove(id: number) {
    // Check if subcategory exists
    const subCategory = await this.subCategoryRepository.findById(id);
    if (!subCategory) {
      throw new NotFoundException(`SubCategory with ID ${id} not found`);
    }

    // Check if subcategory has products
    const productsCount = await this.subCategoryRepository.countProducts(id);
    if (productsCount > 0) {
      throw new ConflictException(
        'Cannot delete subcategory with existing products',
      );
    }

    return await this.subCategoryRepository.delete(id);
  }
}