import { Module } from '@nestjs/common';
import { AuthModule } from '@ticketpond-backend-nx/auth';
import { PrismaModule } from '@ticketpond-backend-nx/prisma';
import { TicketServiceInterface } from '@ticketpond-backend-nx/types';
import { HealthController } from '@ticketpond-backend-nx/utils';

import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { TicketAdminController } from './ticket-admin.controller';
import { TicketMerchantController } from './ticket-merchant.controller';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [
    HealthController,
    TicketAdminController,
    TicketMerchantController,
    TicketController,
  ],
  providers: [{ provide: TicketServiceInterface, useClass: TicketService }],
})
export class TicketModule {}
