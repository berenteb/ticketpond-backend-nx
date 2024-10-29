import { bootstrapService } from '@ticketpond-backend-nx/utils';

import { PassModule } from './pass.module';

async function bootstrap() {
  return bootstrapService(PassModule, 'pass');
}

bootstrap();
