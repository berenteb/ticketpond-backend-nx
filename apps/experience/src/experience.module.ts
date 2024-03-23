import { Module } from '@nestjs/common';
import { PrismaModule } from '@ticketpond-backend-nx/prisma';
import { ExperienceServiceInterface } from '@ticketpond-backend-nx/types';

import { ExperienceController } from './experience.controller';
import { ExperienceService } from './experience.service';

@Module({
  imports: [PrismaModule],
  controllers: [ExperienceController],
  providers: [
    {
      provide: ExperienceServiceInterface,
      useClass: ExperienceService,
    },
  ],
})
export class ExperienceModule {}
