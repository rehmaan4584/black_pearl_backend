import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { OrdersModule } from 'src/orders/orders.module';
import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';

@Module({
  imports: [AuthModule, OrdersModule],
  controllers: [CheckoutController],
  providers: [CheckoutService],
})
export class CheckoutModule {}
