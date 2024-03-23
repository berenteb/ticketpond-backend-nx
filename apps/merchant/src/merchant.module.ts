import { Module } from '@nestjs/common';
import { PrismaModule } from '@ticketpond-backend-nx/prisma';

import { MerchantController } from './merchant.controller';
import { MerchantService } from './merchant.service';

@Module({
  imports: [PrismaModule],
  controllers: [MerchantController],
  providers: [MerchantService],
})
export class MerchantModule {}
