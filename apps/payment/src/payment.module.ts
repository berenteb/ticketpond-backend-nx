import { Module } from '@nestjs/common';
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
    createClientKafka(ServiceNames.ORDER_SERVICE),
  ],
})
export class PaymentModule {}
