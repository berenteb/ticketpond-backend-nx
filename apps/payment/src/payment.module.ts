import { Module } from '@nestjs/common';
import {
  PaymentServiceInterface,
  ServiceNames,
} from '@ticketpond-backend-nx/types';

import { ConfigService } from './config.service';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { createClientProxy } from './utils/create-client-proxy';

@Module({
  imports: [],
  controllers: [PaymentController],
  providers: [
    {
      provide: PaymentServiceInterface,
      useClass: PaymentService,
    },
    ConfigService,
    createClientProxy(ServiceNames.ORDER_SERVICE, 'orderService'),
  ],
})
export class PaymentModule {}
