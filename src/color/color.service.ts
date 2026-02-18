import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { ColorRepository } from './repository/color.repository';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';

@Injectable()
export class ColorService {
  constructor(private colorRepository: ColorRepository) {}

  async create(createColorDto: CreateColorDto) {
    // Check if color name already exists
    const existingName = await this.colorRepository.findByName(
      createColorDto.name,
    );
    if (existingName) {
      throw new ConflictException('Color name already exists');
    }

    // Check if hex code already exists
    const existingHex = await this.colorRepository.findByHexCode(
      createColorDto.hexCode,
    );
    if (existingHex) {
      throw new ConflictException('Color hex code already exists');
    }

    return await this.colorRepository.create(createColorDto);
  }

  async findAll() {
    return await this.colorRepository.findAll();
  }

  async findOne(id: number) {
    const color = await this.colorRepository.findById(id);

    if (!color) {
      throw new NotFoundException(`Color with ID ${id} not found`);
    }

    return color;
  }

  async update(id: number, updateColorDto: UpdateColorDto) {
    // Check if color exists
    const color = await this.colorRepository.findById(id);
    if (!color) {
      throw new NotFoundException(`Color with ID ${id} not found`);
    }

    // Check if new name conflicts with another color
    if (updateColorDto.name && updateColorDto.name !== color.name) {
      const existingName = await this.colorRepository.findByName(
        updateColorDto.name,
      );
      if (existingName) {
        throw new ConflictException('Color name already exists');
      }
    }

    // Check if new hex code conflicts with another color
    if (updateColorDto.hexCode && updateColorDto.hexCode !== color.hexCode) {
      const existingHex = await this.colorRepository.findByHexCode(
        updateColorDto.hexCode,
      );
      if (existingHex) {
        throw new ConflictException('Color hex code already exists');
      }
    }

    return await this.colorRepository.update(id, updateColorDto);
  }

  async remove(id: number) {
    // Check if color exists
    const color = await this.colorRepository.findById(id);
    if (!color) {
      throw new NotFoundException(`Color with ID ${id} not found`);
    }

    // Check if color is used in any product variants
    const variantsCount = await this.colorRepository.countProductVariants(id);
    if (variantsCount > 0) {
      throw new ConflictException(
        'Cannot delete color that is used in product variants',
      );
    }

    return await this.colorRepository.delete(id);
  }
}