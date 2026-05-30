import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe = require('stripe');
import { OrdersService } from 'src/orders/orders.service';

@Injectable()
export class CheckoutService {
  private stripe: Stripe.Stripe;

  constructor(
    private configService: ConfigService,
    private ordersService: OrdersService,
  ) {
    const secretKey = this.configService.get<string>('stripe.secretKey');
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    this.stripe = new Stripe(secretKey);
  }

  async createSession(userId: number) {
    const order = await this.ordersService.createFromCart(userId);
    const successUrl = this.configService.get<string>('stripe.successUrl');
    const cancelUrl = this.configService.get<string>('stripe.cancelUrl');

    if (!successUrl || !cancelUrl) {
      throw new BadRequestException('Stripe redirect URLs are not configured');
    }

    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: order.items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: 'pkr',
          unit_amount: item.price * 100,
          product_data: {
            name: item.product.title,
            description: `${item.variant.size} / ${item.variant.color}`,
          },
        },
      })),
      metadata: {
        orderId: String(order.id),
      },
      success_url: `${successUrl}?orderId=${order.id}`,
      cancel_url: `${cancelUrl}?orderId=${order.id}`,
    });

    return {
      orderId: order.id,
      sessionId: session.id,
      url: session.url,
    };
  }

  constructWebhookEvent(signature: string | undefined, rawBody: Buffer) {
    const webhookSecret = this.configService.get<string>('stripe.webhookSecret');
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
    }
    if (!signature) {
      throw new BadRequestException('Missing Stripe signature');
    }

    return this.stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret,
    );
  }

  async handleWebhook(
    event: ReturnType<Stripe.Stripe['webhooks']['constructEvent']>,
  ) {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const orderId = Number(session.metadata?.orderId);
      if (Number.isInteger(orderId)) {
        await this.ordersService.markPaid(orderId);
      }
    }

    if (event.type === 'checkout.session.expired') {
      const session = event.data.object;
      const orderId = Number(session.metadata?.orderId);
      if (Number.isInteger(orderId)) {
        await this.ordersService.cancelPendingOrder(orderId);
      }
    }

    return { received: true };
  }

  cancelPendingOrder(orderId: number, userId: number) {
    return this.ordersService.cancelPendingOrder(orderId, userId);
  }
}
