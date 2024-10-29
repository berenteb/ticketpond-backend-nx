import { bootstrapService } from '@ticketpond-backend-nx/utils';

import { OrderModule } from './order.module';

async function bootstrap() {
  return bootstrapService(OrderModule, 'order');
}

bootstrap();
