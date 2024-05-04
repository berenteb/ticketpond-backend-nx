import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PermissionGuard } from '@ticketpond-backend-nx/authz';
import { TicketPatterns } from '@ticketpond-backend-nx/message-patterns';
import {
  DeepTicketDto,
  PermissionLevel,
  ServiceNames,
  ServiceResponse,
  TicketDto,
  UpdateTicketDto,
} from '@ticketpond-backend-nx/types';
import { responseFrom } from '@ticketpond-backend-nx/utils';

@UseGuards(PermissionGuard(PermissionLevel.ADMIN))
@UseGuards(AuthGuard('jwt'))
@ApiTags('ticket-admin')
@Controller('admin/ticket')
export class TicketAdminController {
  constructor(
    @Inject(ServiceNames.KAFKA_SERVICE)
    private readonly kafkaService: ClientKafka,
  ) {}

  @Get()
  @ApiOkResponse({ type: [DeepTicketDto] })
  async getTickets(): Promise<DeepTicketDto[]> {
    return responseFrom(
      this.kafkaService.send<ServiceResponse<DeepTicketDto[]>>(
        TicketPatterns.LIST_TICKETS,
        {},
      ),
    );
  }

  @Get(':id')
  @ApiOkResponse({ type: DeepTicketDto })
  async getTicketById(@Param('id') id: string): Promise<DeepTicketDto> {
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

  @Patch(':id')
  @ApiOkResponse({ type: TicketDto })
  async updateTicket(
    @Param('id') id: string,
    @Body() ticket: UpdateTicketDto,
  ): Promise<TicketDto> {
    return responseFrom(
      this.kafkaService.send<ServiceResponse<TicketDto>>(
        TicketPatterns.UPDATE_TICKET,
        {
          id,
          ticket,
        },
      ),
    );
  }

  @Delete(':id')
  @ApiOkResponse()
  async deleteTicket(@Param('id') id: string): Promise<void> {
    this.kafkaService.emit(TicketPatterns.DELETE_TICKET, id);
  }
}
