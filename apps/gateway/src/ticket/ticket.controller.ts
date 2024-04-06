import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
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
export class TicketController {
  constructor(
    @Inject(ServiceNames.TICKET_SERVICE)
    private readonly ticketService: ClientProxy,
  ) {}

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
