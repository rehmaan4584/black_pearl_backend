import {
  Body,
  Controller,
  Headers,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CheckoutService } from './checkout.service';

type AuthenticatedRequest = {
  user: {
    userId: number;
    email: string;
    role: string;
  };
};

type RawBodyRequest = Request & {
  rawBody: Buffer;
};

@Controller('checkout')
export class CheckoutController {
  constructor(private checkoutService: CheckoutService) {}

  @UseGuards(JwtAuthGuard)
  @Post('session')
  createSession(@Req() req: AuthenticatedRequest) {
    return this.checkoutService.createSession(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('cancel')
  cancelPendingOrder(
    @Req() req: AuthenticatedRequest,
    @Body('orderId') orderId: number,
  ) {
    return this.checkoutService.cancelPendingOrder(
      Number(orderId),
      req.user.userId,
    );
  }

  @Post('webhook')
  handleWebhook(
    @Req() req: RawBodyRequest,
    @Headers('stripe-signature') signature?: string,
  ) {
    const event = this.checkoutService.constructWebhookEvent(
      signature,
      req.rawBody,
    );
    return this.checkoutService.handleWebhook(event);
  }
}
