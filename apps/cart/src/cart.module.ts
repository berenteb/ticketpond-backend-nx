import { Module } from '@nestjs/common';
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
    createClientKafka(ServiceNames.ORDER_SERVICE),
  ],
})
export class CartModule {}
