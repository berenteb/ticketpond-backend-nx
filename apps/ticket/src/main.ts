import { bootstrapService } from '@ticketpond-backend-nx/utils';

import { TicketModule } from './ticket.module';

async function bootstrap() {
  return bootstrapService(TicketModule, 'ticket');
}

bootstrap();
