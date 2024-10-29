import { Module } from '@nestjs/common';
import { NotificationServiceInterface } from '@ticketpond-backend-nx/types';
import { HealthController } from '@ticketpond-backend-nx/utils';

import { ConfigService } from './config.service';
import { EmailNotificationService } from './email-notification.service';
import { NotificationController } from './notification.controller';

@Module({
  imports: [],
  controllers: [HealthController, NotificationController],
  providers: [
    {
      provide: NotificationServiceInterface,
      useClass: EmailNotificationService,
    },
    ConfigService,
  ],
})
export class NotificationModule {}
