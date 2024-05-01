import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { OrderPatterns } from '@ticketpond-backend-nx/message-patterns';
import {
  OrderDto,
  PaymentDto,
  PaymentServiceInterface,
  ServiceNames,
} from '@ticketpond-backend-nx/types';
import Stripe from 'stripe';

import { ConfigService } from './config.service';

@Injectable()
export class PaymentService implements PaymentServiceInterface {
  private readonly logger = new Logger(PaymentService.name);
  private stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    @Inject(ServiceNames.ORDER_SERVICE)
    private readonly orderService: ClientProxy,
  ) {
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

  async handleWebhook(signature: string, body: string): Promise<void> {
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
        const succeededOrderId = event.data.object.metadata.orderId;
        this.logger.log(`Order ${succeededOrderId} succeeded`);
        this.orderService.emit(OrderPatterns.FULFILL_ORDER, succeededOrderId);
        break;
      case 'charge.failed':
        const failedOrderId = event.data.object.metadata.orderId;
        this.logger.log(`Order ${failedOrderId} failed`);
        this.orderService.emit(OrderPatterns.FAIL_ORDER, failedOrderId);
        break;
    }
    return;
  }
}
