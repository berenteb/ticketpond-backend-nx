import { Module } from '@nestjs/common';
import { AuthModule } from '@ticketpond-backend-nx/auth';
import { PrismaModule } from '@ticketpond-backend-nx/prisma';
import { ExperienceServiceInterface } from '@ticketpond-backend-nx/types';
import { HealthController } from '@ticketpond-backend-nx/utils';

import { ConfigService } from './config.service';
import { ExperienceController } from './experience.controller';
import { ExperienceService } from './experience.service';
import { ExperienceAdminController } from './experience-admin.controller';
import { ExperienceMerchantController } from './experience-merchant.controller';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [
    HealthController,
    ExperienceMerchantController,
    ExperienceAdminController,
    ExperienceController,
  ],
  providers: [
    ConfigService,
    {
      provide: ExperienceServiceInterface,
      useClass: ExperienceService,
    },
  ],
})
export class ExperienceModule {}
