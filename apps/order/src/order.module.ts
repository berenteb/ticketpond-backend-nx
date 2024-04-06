import { Module } from '@nestjs/common';
import { PrismaModule } from '@ticketpond-backend-nx/prisma';
import { OrderServiceInterface } from '@ticketpond-backend-nx/types';

import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [PrismaModule],
  controllers: [OrderController],
  providers: [
    {
      provide: OrderServiceInterface,
      useClass: OrderService,
    },
  ],
})
export class OrderModule {}
