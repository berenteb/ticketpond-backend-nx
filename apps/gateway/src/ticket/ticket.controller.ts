import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
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
    @Inject(ServiceNames.KAFKA_SERVICE)
    private readonly kafkaService: ClientKafka,
  ) {}

  @Get(':id')
  @ApiOkResponse({ type: DeepTicketDto })
  async getMerchant(@Param('id') id: string): Promise<DeepTicketDto> {
    return firstValueFrom(
      this.kafkaService.send<DeepTicketDto>(TicketPatterns.GET_TICKET, id),
    );
  }

  @Get('experience/:id')
  @ApiOkResponse({ type: [TicketDto] })
  async getTicketsForExperience(
    @Param('id') experienceId: string,
  ): Promise<TicketDto[]> {
    return firstValueFrom(
      this.kafkaService.send<TicketDto[]>(
        TicketPatterns.LIST_TICKETS_FOR_EXPERIENCE,
        experienceId,
      ),
    );
  }
}
