import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CategoryRepository } from './repository/category.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private categoryRepository: CategoryRepository) {}

  async create(createCategoryDto: CreateCategoryDto) {
    // Check if name already exists
    const existingName = await this.categoryRepository.findByName(
      createCategoryDto.name,
    );
    if (existingName) {
      throw new ConflictException('Category name already exists');
    }

    // Check if slug already exists
    const existingSlug = await this.categoryRepository.findBySlug(
      createCategoryDto.slug,
    );
    if (existingSlug) {
      throw new ConflictException('Category slug already exists');
    }

    return await this.categoryRepository.create(createCategoryDto);
  }

  async findAll() {
    return await this.categoryRepository.findAll();
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    // Check if category exists
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // Check if new name conflicts with another category
    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const existingName = await this.categoryRepository.findByName(
        updateCategoryDto.name,
      );
      if (existingName) {
        throw new ConflictException('Category name already exists');
      }
    }

    // Check if new slug conflicts with another category
    if (updateCategoryDto.slug && updateCategoryDto.slug !== category.slug) {
      const existingSlug = await this.categoryRepository.findBySlug(
        updateCategoryDto.slug,
      );
      if (existingSlug) {
        throw new ConflictException('Category slug already exists');
      }
    }

    return await this.categoryRepository.update(id, updateCategoryDto);
  }

  async remove(id: number) {
    // Check if category exists
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // Check if category has subcategories
    const subCategoriesCount = await this.categoryRepository.countSubCategories(
      id,
    );
    if (subCategoriesCount > 0) {
      throw new ConflictException(
        'Cannot delete category with existing subcategories',
      );
    }

    return await this.categoryRepository.delete(id);
  }
}