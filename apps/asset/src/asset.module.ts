import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthModule } from '@ticketpond-backend-nx/auth';
import { AssetServiceInterface } from '@ticketpond-backend-nx/types';
import { HealthController } from '@ticketpond-backend-nx/utils';
import { NestjsFormDataModule } from 'nestjs-form-data';
import path from 'path';

import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';

@Module({
  imports: [
    NestjsFormDataModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', '..', 'static'),
      serveRoot: '/asset',
      serveStaticOptions: {
        index: false,
        redirect: false,
      },
    }),
  ],
  controllers: [HealthController, AssetController],
  providers: [
    {
      provide: AssetServiceInterface,
      useClass: AssetService,
    },
  ],
})
export class AssetModule {}
