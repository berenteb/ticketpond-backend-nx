import { Module } from '@nestjs/common';

import { AppleService } from './apple.service';
import { ConfigService } from './config.service';
import { ImageService } from './image.service';
import { PassController } from './pass.controller';
import { PassService } from './pass.service';

@Module({
  imports: [],
  controllers: [PassController],
  providers: [PassService, AppleService, ImageService, ConfigService],
})
export class PassModule {}
