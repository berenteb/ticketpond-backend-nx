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
  TicketDto,
  UpdateTicketDto,
} from '@ticketpond-backend-nx/types';
import { firstValueFrom } from 'rxjs';

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
    return firstValueFrom(
      this.kafkaService.send<DeepTicketDto[]>(TicketPatterns.LIST_TICKETS, {}),
    );
  }

  @Get(':id')
  @ApiOkResponse({ type: DeepTicketDto })
  async getTicketById(@Param('id') id: string): Promise<DeepTicketDto> {
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

  @Patch(':id')
  @ApiOkResponse({ type: TicketDto })
  async updateTicket(
    @Param('id') id: string,
    @Body() ticket: UpdateTicketDto,
  ): Promise<TicketDto> {
    return firstValueFrom(
      this.kafkaService.send<TicketDto>(TicketPatterns.UPDATE_TICKET, {
        id,
        ticket,
      }),
    );
  }

  @Delete(':id')
  @ApiOkResponse()
  async deleteTicket(@Param('id') id: string): Promise<void> {
    return firstValueFrom(
      this.kafkaService.send<void>(TicketPatterns.DELETE_TICKET, id),
    );
  }
}
