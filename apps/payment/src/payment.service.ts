import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { OrderPatterns } from '@ticketpond-backend-nx/message-patterns';
import {
  OrderDto,
  PaymentDto,
  PaymentServiceInterface,
  ServiceNames,
  ServiceResponse,
} from '@ticketpond-backend-nx/types';
import { responseFrom } from '@ticketpond-backend-nx/utils';
import Stripe from 'stripe';

import { ConfigService } from './config.service';

@Injectable()
export class PaymentService implements PaymentServiceInterface {
  private readonly logger = new Logger(PaymentService.name);
  private stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    @Inject(ServiceNames.KAFKA_SERVICE)
    private readonly kafkaService: ClientKafka,
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
    let orderId: string;
    switch (event.type) {
      case 'charge.succeeded':
        orderId = event.data.object.metadata.orderId;
        this.logger.log(`Order ${orderId} succeeded`);
        this.kafkaService.emit(OrderPatterns.FULFILL_ORDER, orderId);
        break;
      case 'charge.failed':
        orderId = event.data.object.metadata.orderId;
        this.logger.log(`Order ${orderId} failed`);
        this.kafkaService.emit(OrderPatterns.FAIL_ORDER, orderId);
        break;
    }
    return;
  }

  async getOrderForCustomer(
    id: string,
    customerAuthId: string,
  ): Promise<OrderDto> {
    return responseFrom(
      this.kafkaService.send<ServiceResponse<OrderDto>>(
        OrderPatterns.GET_ORDER_FOR_CUSTOMER,
        {
          id,
          customerAuthId,
        },
      ),
    );
  }
}
