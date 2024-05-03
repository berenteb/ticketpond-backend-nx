import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthzModule } from '@ticketpond-backend-nx/authz';
import {
  AssetPatterns,
  CartPatterns,
  CustomerMessagePattern,
  ExperiencePatterns,
  MerchantPattern,
  OrderPatterns,
  PassPatterns,
  PaymentPatterns,
  TicketPatterns,
} from '@ticketpond-backend-nx/message-patterns';
import { ServiceNames } from '@ticketpond-backend-nx/types';
import { NestjsFormDataModule } from 'nestjs-form-data';
import path from 'path';

import { AssetController } from './asset/asset.controller';
import { CartController } from './cart/cart.controller';
import { ConfigService } from './config.service';
import { CustomerController } from './customer/customer.controller';
import { CustomerAdminController } from './customer/customer-admin.controller';
import { ExperienceController } from './experience/experience.controller';
import { ExperienceAdminController } from './experience/experience-admin.controller';
import { ExperienceMerchantController } from './experience/experience-merchant.controller';
import { GatewayController } from './gateway.controller';
import { MerchantController } from './merchant/merchant.controller';
import { MerchantAdminController } from './merchant/merchant-admin.controller';
import { MerchantSelfController } from './merchant/merchant-self.controller';
import { OrderController } from './order/order.controller';
import { OrderAdminController } from './order/order-admin.controller';
import { OrderMerchantController } from './order/order-merchant.controller';
import { PassController } from './pass/pass.controller';
import { PaymentController } from './payment/payment.controller';
import { TicketController } from './ticket/ticket.controller';
import { TicketAdminController } from './ticket/ticket-admin.controller';
import { TicketMerchantController } from './ticket/ticket-merchant.controller';
import { createClientKafka } from './utils/create-client-kafka';

@Module({
  imports: [
    NestjsFormDataModule,
    AuthzModule.forRoot([
      createClientKafka(
        ServiceNames.KAFKA_SERVICE,
        'gateway-auth',
        'gateway-auth',
      ),
      ConfigService,
    ]),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', '..', 'static'),
      serveRoot: '/cdn',
      serveStaticOptions: {
        index: false,
        redirect: false,
      },
    }),
  ],
  controllers: [
    GatewayController,
    CustomerController,
    CustomerAdminController,
    MerchantController,
    MerchantSelfController,
    MerchantAdminController,
    ExperienceController,
    ExperienceMerchantController,
    ExperienceAdminController,
    TicketController,
    TicketAdminController,
    TicketMerchantController,
    OrderController,
    OrderAdminController,
    OrderMerchantController,
    CartController,
    PaymentController,
    PassController,
    AssetController,
  ],
  providers: [
    ConfigService,
    createClientKafka(ServiceNames.KAFKA_SERVICE, 'gateway', 'gateway'),
  ],
})
export class GatewayModule implements OnModuleInit {
  constructor(
    @Inject(ServiceNames.KAFKA_SERVICE)
    private readonly kafkaService: ClientKafka,
  ) {}

  async onModuleInit() {
    this.kafkaService.subscribeToResponseOf(
      CustomerMessagePattern.GET_CUSTOMER_BY_AUTH_ID,
    );
    this.kafkaService.subscribeToResponseOf(
      CustomerMessagePattern.CREATE_CUSTOMER,
    );
    this.kafkaService.subscribeToResponseOf(
      CustomerMessagePattern.LIST_CUSTOMERS,
    );
    this.kafkaService.subscribeToResponseOf(
      CustomerMessagePattern.GET_CUSTOMER,
    );
    this.kafkaService.subscribeToResponseOf(
      CustomerMessagePattern.UPDATE_CUSTOMER,
    );
    this.kafkaService.subscribeToResponseOf(
      CustomerMessagePattern.DELETE_CUSTOMER,
    );
    this.kafkaService.subscribeToResponseOf(AssetPatterns.UPLOAD_FILE);
    this.kafkaService.subscribeToResponseOf(CartPatterns.GET_CART_BY_AUTH_ID);
    this.kafkaService.subscribeToResponseOf(CartPatterns.CHECKOUT_BY_AUTH_ID);
    this.kafkaService.subscribeToResponseOf(
      CartPatterns.ADD_ITEM_TO_CART_BY_AUTH_ID,
    );
    this.kafkaService.subscribeToResponseOf(
      CartPatterns.REMOVE_ITEM_FROM_CART_BY_AUTH_ID,
    );
    this.kafkaService.subscribeToResponseOf(
      ExperiencePatterns.LIST_EXPERIENCES,
    );
    this.kafkaService.subscribeToResponseOf(ExperiencePatterns.GET_EXPERIENCE);
    this.kafkaService.subscribeToResponseOf(
      ExperiencePatterns.UPDATE_EXPERIENCE,
    );
    this.kafkaService.subscribeToResponseOf(
      ExperiencePatterns.DELETE_EXPERIENCE,
    );
    this.kafkaService.subscribeToResponseOf(
      ExperiencePatterns.GET_EXPERIENCES_BY_MERCHANT_ID,
    );
    this.kafkaService.subscribeToResponseOf(
      ExperiencePatterns.CREATE_EXPERIENCE,
    );
    this.kafkaService.subscribeToResponseOf(
      ExperiencePatterns.UPDATE_EXPERIENCE_BY_MERCHANT_ID,
    );
    this.kafkaService.subscribeToResponseOf(
      ExperiencePatterns.VALIDATE_EXPERIENCE_PASS,
    );
    this.kafkaService.subscribeToResponseOf(
      ExperiencePatterns.DELETE_EXPERIENCE_BY_MERCHANT_ID,
    );
    this.kafkaService.subscribeToResponseOf(MerchantPattern.GET_MERCHANT);
    this.kafkaService.subscribeToResponseOf(MerchantPattern.CREATE_MERCHANT);
    this.kafkaService.subscribeToResponseOf(MerchantPattern.LIST_MERCHANTS);
    this.kafkaService.subscribeToResponseOf(MerchantPattern.DELETE_MERCHANT);
    this.kafkaService.subscribeToResponseOf(
      MerchantPattern.GET_MERCHANT_BY_USER_ID,
    );
    this.kafkaService.subscribeToResponseOf(
      MerchantPattern.UPDATE_MERCHANT_BY_USER_ID,
    );
    this.kafkaService.subscribeToResponseOf(
      OrderPatterns.LIST_ORDERS_FOR_CUSTOMER,
    );
    this.kafkaService.subscribeToResponseOf(
      OrderPatterns.GET_ORDER_FOR_CUSTOMER,
    );
    this.kafkaService.subscribeToResponseOf(OrderPatterns.LIST_ORDERS);
    this.kafkaService.subscribeToResponseOf(
      OrderPatterns.GET_ORDER_WITH_CUSTOMER,
    );
    this.kafkaService.subscribeToResponseOf(OrderPatterns.DELETE_ORDER);
    this.kafkaService.subscribeToResponseOf(
      OrderPatterns.LIST_ORDERS_FOR_MERCHANT,
    );
    this.kafkaService.subscribeToResponseOf(
      OrderPatterns.GET_ORDER_WITH_CUSTOMER_FOR_MERCHANT,
    );
    this.kafkaService.subscribeToResponseOf(PassPatterns.GET_QRCODE);
    this.kafkaService.subscribeToResponseOf(
      PaymentPatterns.CREATE_PAYMENT_INTENT,
    );
    this.kafkaService.subscribeToResponseOf(TicketPatterns.GET_TICKET);
    this.kafkaService.subscribeToResponseOf(
      TicketPatterns.LIST_TICKETS_FOR_EXPERIENCE,
    );
    this.kafkaService.subscribeToResponseOf(TicketPatterns.LIST_TICKETS);
    this.kafkaService.subscribeToResponseOf(TicketPatterns.UPDATE_TICKET);
    this.kafkaService.subscribeToResponseOf(TicketPatterns.DELETE_TICKET);
    this.kafkaService.subscribeToResponseOf(
      TicketPatterns.LIST_TICKETS_BY_MERCHANT_ID,
    );
    this.kafkaService.subscribeToResponseOf(
      TicketPatterns.GET_TICKET_BY_MERCHANT_ID,
    );
    this.kafkaService.subscribeToResponseOf(
      TicketPatterns.CREATE_TICKET_BY_MERCHANT_ID,
    );
    this.kafkaService.subscribeToResponseOf(
      TicketPatterns.UPDATE_TICKET_BY_MERCHANT_ID,
    );
    this.kafkaService.subscribeToResponseOf(
      TicketPatterns.DELETE_TICKET_BY_MERCHANT_ID,
    );

    await this.kafkaService.connect();
  }
}
