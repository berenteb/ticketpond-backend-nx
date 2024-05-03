import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { PrismaModule } from '@ticketpond-backend-nx/prisma';
import {
  CustomerServiceInterface,
  ServiceNames,
} from '@ticketpond-backend-nx/types';

import { ConfigService } from './config.service';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { createClientKafka } from './utils/create-client-kafka';

@Module({
  imports: [PrismaModule],
  controllers: [CustomerController],
  providers: [
    ConfigService,
    {
      provide: CustomerServiceInterface,
      useClass: CustomerService,
    },
    createClientKafka(ServiceNames.KAFKA_SERVICE),
  ],
})
export class CustomerModule implements OnModuleInit {
  constructor(
    @Inject(ServiceNames.KAFKA_SERVICE)
    private readonly kafkaService: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafkaService.connect();
  }
}
