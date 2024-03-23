import { Module } from '@nestjs/common';
import { PrismaModule } from '@ticketpond-backend-nx/prisma';
import { MerchantServiceInterface } from '@ticketpond-backend-nx/types';

import { MerchantController } from './merchant.controller';
import { MerchantService } from './merchant.service';

@Module({
  imports: [PrismaModule],
  controllers: [MerchantController],
  providers: [
    {
      provide: MerchantServiceInterface,
      useClass: MerchantService,
    },
  ],
})
export class MerchantModule {}
