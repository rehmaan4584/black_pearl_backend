import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma.service';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartRepository } from './repository/cart.repository';

@Module({
  imports: [AuthModule],
  controllers: [CartController],
  providers: [CartService, CartRepository, PrismaService],
  exports: [CartService],
})
export class CartModule {}
