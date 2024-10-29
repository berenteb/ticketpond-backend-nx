import { bootstrapService } from '@ticketpond-backend-nx/utils';

import { CartModule } from './cart.module';

async function bootstrap() {
  return bootstrapService(CartModule, 'cart');
}

bootstrap();
