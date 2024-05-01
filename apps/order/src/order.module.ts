import { Module } from '@nestjs/common';
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
    createClientKafka(ServiceNames.PASS_SERVICE),
    createClientKafka(ServiceNames.NOTIFICATION_SERVICE),
  ],
})
export class OrderModule {}
