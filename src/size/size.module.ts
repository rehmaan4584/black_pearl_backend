import { Module } from '@nestjs/common';
import { SizeService } from './size.service';
import { SizeController } from './size.controller';
import { PrismaService } from 'src/prisma.service';
import { SizeRepository } from './repository/size.repository';

@Module({
  controllers: [SizeController],
  providers: [SizeService, SizeRepository,PrismaService],
  exports: [SizeService, SizeRepository],
})
export class SizeModule {}
