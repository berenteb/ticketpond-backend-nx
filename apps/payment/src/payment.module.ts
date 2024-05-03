import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  PaymentServiceInterface,
  ServiceNames,
} from '@ticketpond-backend-nx/types';

import { ConfigService } from './config.service';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { createClientKafka } from './utils/create-client-kafka';

@Module({
  imports: [],
  controllers: [PaymentController],
  providers: [
    {
      provide: PaymentServiceInterface,
      useClass: PaymentService,
    },
    ConfigService,
    createClientKafka(ServiceNames.KAFKA_SERVICE),
  ],
})
export class PaymentModule implements OnModuleInit {
  constructor(
    @Inject(ServiceNames.KAFKA_SERVICE)
    private readonly kafkaService: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafkaService.connect();
  }
}
