import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ClientKafka, ClientProxy } from '@nestjs/microservices';
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
export class TicketAdminController implements OnModuleInit {
  constructor(
    @Inject(ServiceNames.TICKET_SERVICE)
    private readonly ticketService: ClientKafka,
  ) {}

  async onModuleInit() {
    this.ticketService.subscribeToResponseOf(TicketPatterns.LIST_TICKETS);
    this.ticketService.subscribeToResponseOf(TicketPatterns.GET_TICKET);
    this.ticketService.subscribeToResponseOf(
      TicketPatterns.LIST_TICKETS_FOR_EXPERIENCE,
    );
    this.ticketService.subscribeToResponseOf(TicketPatterns.UPDATE_TICKET);
    this.ticketService.subscribeToResponseOf(TicketPatterns.DELETE_TICKET);
    await this.ticketService.connect();
  }

  @Get()
  @ApiOkResponse({ type: [DeepTicketDto] })
  async getTickets(): Promise<DeepTicketDto[]> {
    return firstValueFrom(
      this.ticketService.send<DeepTicketDto[]>(TicketPatterns.LIST_TICKETS, {}),
    );
  }

  @Get(':id')
  @ApiOkResponse({ type: DeepTicketDto })
  async getTicketById(@Param('id') id: string): Promise<DeepTicketDto> {
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

  @Patch(':id')
  @ApiOkResponse({ type: TicketDto })
  async updateTicket(
    @Param('id') id: string,
    @Body() ticket: UpdateTicketDto,
  ): Promise<TicketDto> {
    return firstValueFrom(
      this.ticketService.send<TicketDto>(TicketPatterns.UPDATE_TICKET, {
        id,
        ticket,
      }),
    );
  }

  @Delete(':id')
  @ApiOkResponse()
  async deleteTicket(@Param('id') id: string): Promise<void> {
    return firstValueFrom(
      this.ticketService.send<void>(TicketPatterns.DELETE_TICKET, id),
    );
  }
}
