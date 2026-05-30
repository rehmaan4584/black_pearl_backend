import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OrdersService } from './orders.service';

type AuthenticatedRequest = {
  user: {
    userId: number;
    email: string;
    role: string;
  };
};

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  createFromCart(@Req() req: AuthenticatedRequest) {
    return this.ordersService.createFromCart(req.user.userId);
  }
}
