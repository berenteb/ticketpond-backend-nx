import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard, PermissionGuard } from '@ticketpond-backend-nx/auth';
import {
  CreateTicketDto,
  DeepTicketDto,
  PermissionLevel,
  type ReqWithUser,
  TicketDto,
  TicketServiceInterface,
  UpdateTicketDto,
} from '@ticketpond-backend-nx/types';

@UseGuards(PermissionGuard(PermissionLevel.MERCHANT))
@UseGuards(JwtGuard)
@ApiTags('Ticket-Merchant')
@Controller('merchant')
@ApiCookieAuth('jwt')
export class TicketMerchantController {
  constructor(private readonly ticketService: TicketServiceInterface) {}

  @Get()
  @ApiOkResponse({ type: [DeepTicketDto] })
  async getTickets(@Req() req: ReqWithUser): Promise<DeepTicketDto[]> {
    return this.ticketService.getTicketsForMerchant(req.user.merchantId);
  }

  @Get(':id')
  @ApiOkResponse({ type: DeepTicketDto })
  async getTicketById(
    @Param('id') id: string,
    @Req() req: ReqWithUser,
  ): Promise<DeepTicketDto> {
    const ticket = await this.ticketService.getTicketByIdForMerchant(
      id,
      req.user.merchantId,
    );
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    return ticket;
  }

  @Get('experience/:id')
  @ApiOkResponse({ type: [TicketDto] })
  async getTicketsForExperience(
    @Param('id') experienceId: string,
    @Req() req: ReqWithUser,
  ): Promise<TicketDto[]> {
    return this.ticketService.getTicketsForMerchantExperience(
      experienceId,
      req.user.merchantId,
    );
  }

  @Post()
  @ApiOkResponse({ type: TicketDto })
  async createTicket(
    @Body() ticket: CreateTicketDto,
    @Req() req: ReqWithUser,
  ): Promise<TicketDto> {
    return this.ticketService.createTicketForMerchant(
      ticket,
      req.user.merchantId,
    );
  }

  @Patch(':id')
  @ApiOkResponse({ type: TicketDto })
  async updateTicket(
    @Param('id') id: string,
    @Body() ticket: UpdateTicketDto,
    @Req() req: ReqWithUser,
  ): Promise<TicketDto> {
    const updatedTicket = await this.ticketService.updateTicketForMerchant(
      id,
      ticket,
      req.user.merchantId,
    );
    if (!updatedTicket) {
      throw new NotFoundException('Ticket not found');
    }
    return updatedTicket;
  }

  @Delete(':id')
  @ApiOkResponse()
  async deleteTicket(
    @Param('id') id: string,
    @Req() req: ReqWithUser,
  ): Promise<void> {
    await this.ticketService.deleteTicketForMerchant(id, req.user.merchantId);
  }
}
