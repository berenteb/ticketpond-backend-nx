import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { AuthModule } from '@ticketpond-backend-nx/auth';
import { OrderPatterns } from '@ticketpond-backend-nx/message-patterns';
import {
  PaymentServiceInterface,
  ServiceNames,
} from '@ticketpond-backend-nx/types';
import { HealthController } from '@ticketpond-backend-nx/utils';

import { ConfigService } from './config.service';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { createClientKafka } from './utils/create-client-kafka';

@Module({
  imports: [AuthModule],
  controllers: [HealthController, PaymentController],
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
    this.kafkaService.subscribeToResponseOf(
      OrderPatterns.GET_ORDER_FOR_CUSTOMER,
    );
    await this.kafkaService.connect();
  }
}
