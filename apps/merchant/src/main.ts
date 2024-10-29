import { bootstrapService } from '@ticketpond-backend-nx/utils';

import { MerchantModule } from './merchant.module';

async function bootstrap() {
  return bootstrapService(MerchantModule, 'merchant');
}

bootstrap();
