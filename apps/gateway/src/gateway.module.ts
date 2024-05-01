import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthzModule } from '@ticketpond-backend-nx/authz';
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
import { createClientProxy } from './utils/create-client-proxy';

@Module({
  imports: [
    NestjsFormDataModule,
    AuthzModule.forRoot([
      createClientProxy(ServiceNames.MERCHANT_SERVICE, 'merchantService'),
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
    createClientProxy(ServiceNames.CUSTOMER_SERVICE, 'customerService'),
    createClientKafka(ServiceNames.MERCHANT_SERVICE),
    createClientKafka(ServiceNames.EXPERIENCE_SERVICE),
    createClientKafka(ServiceNames.TICKET_SERVICE),
    createClientProxy(ServiceNames.ORDER_SERVICE, 'orderService'),
    createClientProxy(ServiceNames.CART_SERVICE, 'cartService'),
    createClientProxy(ServiceNames.PAYMENT_SERVICE, 'paymentService'),
    createClientProxy(ServiceNames.PASS_SERVICE, 'passService'),
    createClientProxy(ServiceNames.ASSET_SERVICE, 'assetService'),
  ],
})
export class GatewayModule {}
