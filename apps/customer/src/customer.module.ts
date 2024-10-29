import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { AuthModule } from '@ticketpond-backend-nx/auth';
import { PrismaModule } from '@ticketpond-backend-nx/prisma';
import {
  CustomerServiceInterface,
  ServiceNames,
} from '@ticketpond-backend-nx/types';
import { HealthController } from '@ticketpond-backend-nx/utils';

import { ConfigService } from './config.service';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { CustomerAdminController } from './customer-admin.controller';
import { CustomerInternalController } from './customer-internal.controller';
import { createClientKafka } from './utils/create-client-kafka';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [
    CustomerInternalController,
    HealthController,
    CustomerAdminController,
    CustomerController,
  ],
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
