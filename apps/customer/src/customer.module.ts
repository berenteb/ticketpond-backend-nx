import { Module } from '@nestjs/common';
import { PrismaModule } from '@ticketpond-backend-nx/prisma';
import {
  CustomerServiceInterface,
  ServiceNames,
} from '@ticketpond-backend-nx/types';

import { ConfigService } from './config.service';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { createKafkaClientProxy } from './utils/create-kafka-client-proxy';

@Module({
  imports: [PrismaModule],
  controllers: [CustomerController],
  providers: [
    ConfigService,
    {
      provide: CustomerServiceInterface,
      useClass: CustomerService,
    },
    createKafkaClientProxy(
      ServiceNames.NOTIFICATION_SERVICE,
      'notificationService',
    ),
  ],
})
export class CustomerModule {}
