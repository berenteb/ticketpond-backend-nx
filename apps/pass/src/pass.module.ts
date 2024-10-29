import { Module } from '@nestjs/common';
import { PassServiceInterface } from '@ticketpond-backend-nx/types';
import { HealthController } from '@ticketpond-backend-nx/utils';

import { AppleService } from './apple.service';
import { ConfigService } from './config.service';
import { ImageService } from './image.service';
import { PassController } from './pass.controller';
import { PassService } from './pass.service';

@Module({
  imports: [],
  controllers: [HealthController, PassController],
  providers: [
    {
      provide: PassServiceInterface,
      useClass: PassService,
    },
    AppleService,
    ImageService,
    ConfigService,
  ],
})
export class PassModule {}
