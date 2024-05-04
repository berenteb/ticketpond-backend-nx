import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TicketPatterns } from '@ticketpond-backend-nx/message-patterns';
import {
  DeepTicketDto,
  ServiceNames,
  ServiceResponse,
  TicketDto,
} from '@ticketpond-backend-nx/types';
import { responseFrom } from '@ticketpond-backend-nx/utils';

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
    return responseFrom(
      this.kafkaService.send<ServiceResponse<DeepTicketDto>>(
        TicketPatterns.GET_TICKET,
        id,
      ),
    );
  }

  @Get('experience/:id')
  @ApiOkResponse({ type: [TicketDto] })
  async getTicketsForExperience(
    @Param('id') experienceId: string,
  ): Promise<TicketDto[]> {
    return responseFrom(
      this.kafkaService.send<ServiceResponse<TicketDto[]>>(
        TicketPatterns.LIST_TICKETS_FOR_EXPERIENCE,
        experienceId,
      ),
    );
  }
}
