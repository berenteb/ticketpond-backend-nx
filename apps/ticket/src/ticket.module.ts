import { Module } from '@nestjs/common';
import { PrismaModule } from '@ticketpond-backend-nx/prisma';
import { TicketServiceInterface } from '@ticketpond-backend-nx/types';

import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';

@Module({
  imports: [PrismaModule],
  controllers: [TicketController],
  providers: [{ provide: TicketServiceInterface, useClass: TicketService }],
})
export class TicketModule {}
