import { Module } from '@nestjs/common';
import { PrismaModule } from '@ticketpond-backend-nx/prisma';
import { CustomerServiceInterface } from '@ticketpond-backend-nx/types';

import { ConfigService } from './config.service';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';

@Module({
  imports: [PrismaModule],
  controllers: [CustomerController],
  providers: [
    ConfigService,
    {
      provide: CustomerServiceInterface,
      useClass: CustomerService,
    },
  ],
})
export class CustomerModule {}
