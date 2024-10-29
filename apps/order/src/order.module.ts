import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { AuthModule } from '@ticketpond-backend-nx/auth';
import { PrismaModule } from '@ticketpond-backend-nx/prisma';
import {
  OrderServiceInterface,
  ServiceNames,
} from '@ticketpond-backend-nx/types';
import { HealthController } from '@ticketpond-backend-nx/utils';

import { ConfigService } from './config.service';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderAdminController } from './order-admin.controller';
import { OrderInternalController } from './order-internal.controller';
import { OrderMerchantController } from './order-merchant.controller';
import { createClientKafka } from './utils/create-client-kafka';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [
    HealthController,
    OrderAdminController,
    OrderMerchantController,
    OrderController,
    OrderInternalController,
  ],
  providers: [
    ConfigService,
    {
      provide: OrderServiceInterface,
      useClass: OrderService,
    },
    createClientKafka(ServiceNames.KAFKA_SERVICE),
  ],
})
export class OrderModule implements OnModuleInit {
  constructor(
    @Inject(ServiceNames.KAFKA_SERVICE)
    private readonly kafkaService: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafkaService.connect();
  }
}
