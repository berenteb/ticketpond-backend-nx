import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard, PermissionGuard } from '@ticketpond-backend-nx/auth';
import {
  DeepTicketDto,
  PermissionLevel,
  TicketDto,
  TicketServiceInterface,
  UpdateTicketDto,
} from '@ticketpond-backend-nx/types';

@UseGuards(PermissionGuard(PermissionLevel.ADMIN))
@UseGuards(JwtGuard)
@ApiTags('Ticket-Admin')
@Controller('admin')
@ApiCookieAuth('jwt')
export class TicketAdminController {
  constructor(private readonly ticketService: TicketServiceInterface) {}

  @Get()
  @ApiOkResponse({ type: [DeepTicketDto] })
  async getTickets(): Promise<DeepTicketDto[]> {
    return this.ticketService.getTickets();
  }

  @Get(':id')
  @ApiOkResponse({ type: DeepTicketDto })
  async getTicketById(@Param('id') id: string): Promise<DeepTicketDto> {
    const ticket = await this.ticketService.getTicketById(id);
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    return ticket;
  }

  @Get('experience/:id')
  @ApiOkResponse({ type: [TicketDto] })
  async getTicketsForExperience(
    @Param('id') experienceId: string,
  ): Promise<TicketDto[]> {
    return this.ticketService.getTicketsForExperience(experienceId);
  }

  @Patch(':id')
  @ApiOkResponse({ type: TicketDto })
  async updateTicket(
    @Param('id') id: string,
    @Body() ticket: UpdateTicketDto,
  ): Promise<TicketDto> {
    const updatedTicket = await this.ticketService.updateTicket(id, ticket);
    if (!updatedTicket) {
      throw new NotFoundException('Ticket not found');
    }
    return updatedTicket;
  }

  @Delete(':id')
  @ApiOkResponse()
  async deleteTicket(@Param('id') id: string): Promise<void> {
    return this.ticketService.deleteTicket(id);
  }
}
