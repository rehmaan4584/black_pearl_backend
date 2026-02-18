import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { SizeRepository } from './repository/size.repository';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';

@Injectable()
export class SizeService {
  constructor(private sizeRepository: SizeRepository) {}

  async create(createSizeDto: CreateSizeDto) {
    // Check if size name already exists
    const existingSize = await this.sizeRepository.findByName(
      createSizeDto.name,
    );
    if (existingSize) {
      throw new ConflictException('Size name already exists');
    }

    return await this.sizeRepository.create(createSizeDto);
  }

  async findAll() {
    return await this.sizeRepository.findAll();
  }

  async findOne(id: number) {
    const size = await this.sizeRepository.findById(id);

    if (!size) {
      throw new NotFoundException(`Size with ID ${id} not found`);
    }

    return size;
  }

  async update(id: number, updateSizeDto: UpdateSizeDto) {
    // Check if size exists
    const size = await this.sizeRepository.findById(id);
    if (!size) {
      throw new NotFoundException(`Size with ID ${id} not found`);
    }

    // Check if new name conflicts with another size
    if (updateSizeDto.name && updateSizeDto.name !== size.name) {
      const existingSize = await this.sizeRepository.findByName(
        updateSizeDto.name,
      );
      if (existingSize) {
        throw new ConflictException('Size name already exists');
      }
    }

    return await this.sizeRepository.update(id, updateSizeDto);
  }

  async remove(id: number) {
    // Check if size exists
    const size = await this.sizeRepository.findById(id);
    if (!size) {
      throw new NotFoundException(`Size with ID ${id} not found`);
    }

    // Check if size is used in any product variants
    const variantsCount = await this.sizeRepository.countProductVariants(id);
    if (variantsCount > 0) {
      throw new ConflictException(
        'Cannot delete size that is used in product variants',
      );
    }

    return await this.sizeRepository.delete(id);
  }
}