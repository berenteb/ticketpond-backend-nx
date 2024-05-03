import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { OrderPatterns } from '@ticketpond-backend-nx/message-patterns';
import { PrismaModule } from '@ticketpond-backend-nx/prisma';
import {
  CartServiceInterface,
  ServiceNames,
} from '@ticketpond-backend-nx/types';

import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { ConfigService } from './config.service';
import { createClientKafka } from './utils/create-client-kafka';

@Module({
  imports: [PrismaModule],
  controllers: [CartController],
  providers: [
    ConfigService,
    {
      provide: CartServiceInterface,
      useClass: CartService,
    },
    createClientKafka(ServiceNames.KAFKA_SERVICE),
  ],
})
export class CartModule implements OnModuleInit {
  constructor(
    @Inject(ServiceNames.KAFKA_SERVICE)
    private readonly kafkaService: ClientKafka,
  ) {}

  async onModuleInit() {
    this.kafkaService.subscribeToResponseOf(OrderPatterns.CREATE_ORDER);
    await this.kafkaService.connect();
  }
}
