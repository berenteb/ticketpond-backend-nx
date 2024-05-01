import { Controller, Get, Inject, OnModuleInit, Param } from '@nestjs/common';
import { ClientKafka, ClientProxy } from '@nestjs/microservices';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TicketPatterns } from '@ticketpond-backend-nx/message-patterns';
import {
  DeepTicketDto,
  ServiceNames,
  TicketDto,
} from '@ticketpond-backend-nx/types';
import { firstValueFrom } from 'rxjs';

@ApiTags('ticket')
@Controller('ticket')
export class TicketController implements OnModuleInit {
  constructor(
    @Inject(ServiceNames.TICKET_SERVICE)
    private readonly ticketService: ClientKafka,
  ) {}

  async onModuleInit() {
    this.ticketService.subscribeToResponseOf(TicketPatterns.GET_TICKET);
    this.ticketService.subscribeToResponseOf(
      TicketPatterns.LIST_TICKETS_FOR_EXPERIENCE,
    );
    await this.ticketService.connect();
  }

  @Get(':id')
  @ApiOkResponse({ type: DeepTicketDto })
  async getMerchant(@Param('id') id: string): Promise<DeepTicketDto> {
    return firstValueFrom(
      this.ticketService.send<DeepTicketDto>(TicketPatterns.GET_TICKET, id),
    );
  }

  @Get('experience/:id')
  @ApiOkResponse({ type: [TicketDto] })
  async getTicketsForExperience(
    @Param('id') experienceId: string,
  ): Promise<TicketDto[]> {
    return firstValueFrom(
      this.ticketService.send<TicketDto[]>(
        TicketPatterns.LIST_TICKETS_FOR_EXPERIENCE,
        experienceId,
      ),
    );
  }
}
