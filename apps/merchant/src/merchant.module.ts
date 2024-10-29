import { Module } from '@nestjs/common';
import { AuthModule } from '@ticketpond-backend-nx/auth';
import { PrismaModule } from '@ticketpond-backend-nx/prisma';
import { MerchantServiceInterface } from '@ticketpond-backend-nx/types';
import { HealthController } from '@ticketpond-backend-nx/utils';

import { ConfigService } from './config.service';
import { MerchantController } from './merchant.controller';
import { MerchantService } from './merchant.service';
import { MerchantAdminController } from './merchant-admin.controller';
import { MerchantSelfController } from './merchant-self.controller';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [
    HealthController,
    MerchantAdminController,
    MerchantSelfController,
    MerchantController,
  ],
  providers: [
    ConfigService,
    {
      provide: MerchantServiceInterface,
      useClass: MerchantService,
    },
  ],
})
export class MerchantModule {}
