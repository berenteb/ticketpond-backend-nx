import { bootstrapService } from '@ticketpond-backend-nx/utils';

import { NotificationModule } from './notification.module';

async function bootstrap() {
  return bootstrapService(NotificationModule, 'notification');
}

bootstrap();
