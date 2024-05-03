import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { PrismaModule } from '@ticketpond-backend-nx/prisma';
import {
  OrderServiceInterface,
  ServiceNames,
} from '@ticketpond-backend-nx/types';

import { ConfigService } from './config.service';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { createClientKafka } from './utils/create-client-kafka';

@Module({
  imports: [PrismaModule],
  controllers: [OrderController],
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
