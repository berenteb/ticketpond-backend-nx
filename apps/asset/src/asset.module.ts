import { Module } from '@nestjs/common';
import { AssetServiceInterface } from '@ticketpond-backend-nx/types';

import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';

@Module({
  imports: [],
  controllers: [AssetController],
  providers: [
    {
      provide: AssetServiceInterface,
      useClass: AssetService,
    },
  ],
})
export class AssetModule {}
