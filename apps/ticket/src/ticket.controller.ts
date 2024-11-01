import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  DeepTicketDto,
  TicketDto,
  TicketServiceInterface,
} from '@ticketpond-backend-nx/types';

@ApiTags('Ticket')
@Controller()
export class TicketController {
  constructor(private readonly ticketService: TicketServiceInterface) {}

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
}
