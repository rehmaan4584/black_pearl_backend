import { Module } from '@nestjs/common';
import { ColorService } from './color.service';
import { ColorController } from './color.controller';
import { ColorRepository } from './repository/color.repository';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ColorController],
  providers: [ColorService, ColorRepository,PrismaService],
  exports: [ColorService, ColorRepository],
})
export class ColorModule {}
