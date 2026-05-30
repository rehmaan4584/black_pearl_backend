import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartService } from './cart.service';

type AuthenticatedRequest = {
  user: {
    userId: number;
    email: string;
    role: string;
  };
};

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  getCart(@Req() req: AuthenticatedRequest) {
    return this.cartService.getCart(req.user.userId);
  }

  @Post('items')
  addItem(@Req() req: AuthenticatedRequest, @Body() body: AddCartItemDto) {
    return this.cartService.addItem(req.user.userId, body);
  }

  @Patch('items/:id')
  updateItem(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(req.user.userId, id, body);
  }

  @Delete('items/:id')
  removeItem(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.cartService.removeItem(req.user.userId, id);
  }
}
