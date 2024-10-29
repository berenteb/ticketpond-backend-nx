import { bootstrapService } from '@ticketpond-backend-nx/utils';

import { CustomerModule } from './customer.module';

async function bootstrap() {
  return bootstrapService(CustomerModule, 'customer');
}

bootstrap();
