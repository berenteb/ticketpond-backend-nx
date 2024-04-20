import { Module } from '@nestjs/common';
import { NotificationServiceInterface } from '@ticketpond-backend-nx/types';

import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  imports: [],
  controllers: [NotificationController],
  providers: [
    {
      provide: NotificationServiceInterface,
      useClass: NotificationService,
    },
  ],
})
export class NotificationModule {}
