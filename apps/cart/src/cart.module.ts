import { Module } from '@nestjs/common';
import { PrismaModule } from '@ticketpond-backend-nx/prisma';
import {
  CartServiceInterface,
  ServiceNames,
} from '@ticketpond-backend-nx/types';

import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { ConfigService } from './config.service';
import { createClientProxy } from './utils/create-client-proxy';

@Module({
  imports: [PrismaModule],
  controllers: [CartController],
  providers: [
    ConfigService,
    {
      provide: CartServiceInterface,
      useClass: CartService,
    },
    createClientProxy(ServiceNames.ORDER_SERVICE),
  ],
})
export class CartModule {}
