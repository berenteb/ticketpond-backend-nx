import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { OrderDto, PaymentDto } from '@ticketpond-backend-nx/types';
import Stripe from 'stripe';

import { ConfigService } from './config.service';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get('stripeSecretKey'), {
      typescript: true,
      apiVersion: '2024-04-10',
    });
  }

  async createIntent(order: OrderDto): Promise<PaymentDto> {
    const amount = order.items.reduce((acc, item) => acc + item.price, 0);
    this.logger.debug(
      `Created intent for order with id ${order.id} and ${amount} HUF`,
    );
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'huf',
      payment_method_types: ['card'],
      metadata: { orderId: order.id },
    });
    return { clientSecret: paymentIntent.client_secret };
  }

  async handleWebhook(
    signature: string | string[] | Buffer,
    body: Buffer,
  ): Promise<void> {
    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(
        body,
        signature,
        this.configService.get('stripeWebhookEndpointSecret'),
      );
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException();
    }
    this.logger.debug(`Received event of type ${event.type}`);
    switch (event.type) {
      case 'charge.succeeded':
        // const succeededOrderId = event.data.object.metadata.orderId;
        // await this.orderService.fulfillOrder(succeededOrderId);
        console.log('Order fulfilled');
        break;
      case 'charge.failed':
        // const failedOrderId = event.data.object.metadata.orderId;
        // await this.orderService.failOrder(failedOrderId);
        console.log('Order failed');
        break;
    }
    return;
  }
}
