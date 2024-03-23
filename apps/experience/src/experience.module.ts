import { Module } from '@nestjs/common';
import { PrismaModule } from '@ticketpond-backend-nx/prisma';

import { ExperienceController } from './experience.controller';
import { ExperienceService } from './experience.service';

@Module({
  imports: [PrismaModule],
  controllers: [ExperienceController],
  providers: [ExperienceService],
})
export class ExperienceModule {}
