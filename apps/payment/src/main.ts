import { bootstrapService } from '@ticketpond-backend-nx/utils';

import { PaymentModule } from './payment.module';

async function bootstrap() {
  return bootstrapService(PaymentModule, 'payment', { rawBody: true });
}

bootstrap();
