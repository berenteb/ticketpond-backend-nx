import { Controller, UnauthorizedException } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { TicketPatterns } from '@ticketpond-backend-nx/message-patterns';
import {
  CreateTicketDto,
  DeepTicketDto,
  ServiceResponse,
  TicketDto,
  TicketServiceInterface,
  UpdateTicketDto,
} from '@ticketpond-backend-nx/types';
import { CreateServiceResponse } from '@ticketpond-backend-nx/utils';

@Controller()
export class TicketController {
  constructor(private readonly ticketService: TicketServiceInterface) {}

  @MessagePattern(TicketPatterns.LIST_TICKETS)
  async listTickets(): Promise<ServiceResponse<DeepTicketDto[]>> {
    const tickets = await this.ticketService.getTickets();
    return CreateServiceResponse.success(tickets);
  }

  @MessagePattern(TicketPatterns.LIST_TICKETS_BY_MERCHANT_ID)
  async getTicketsForMerchant(
    @Payload() merchantId: string,
  ): Promise<ServiceResponse<TicketDto[]>> {
    const tickets = await this.ticketService.getTicketsForMerchant(merchantId);
    return CreateServiceResponse.success(tickets);
  }

  @MessagePattern(TicketPatterns.GET_TICKET)
  async getTicketById(
    @Payload() id: string,
  ): Promise<ServiceResponse<DeepTicketDto>> {
    const ticket = await this.ticketService.getTicketById(id);
    if (!ticket) {
      return CreateServiceResponse.error('Ticket not found', 404);
    }
    return CreateServiceResponse.success(ticket);
  }

  @MessagePattern(TicketPatterns.GET_TICKET_BY_MERCHANT_ID)
  async getTicketByMerchantId(
    @Payload() data: { id: string; merchantId: string },
  ): Promise<ServiceResponse<DeepTicketDto>> {
    if (!(await this.ticketService.isOwnProperty(data.id, data.merchantId))) {
      return CreateServiceResponse.error('Forbidden', 403);
    }
    const ticket = await this.ticketService.getTicketById(data.id);
    if (!ticket) {
      return CreateServiceResponse.error('Ticket not found', 404);
    }
    return CreateServiceResponse.success(ticket);
  }

  @MessagePattern(TicketPatterns.LIST_TICKETS_FOR_EXPERIENCE)
  async getTicketsForExperience(
    @Payload() experienceId: string,
  ): Promise<ServiceResponse<TicketDto[]>> {
    const tickets =
      await this.ticketService.getTicketsForExperience(experienceId);
    return CreateServiceResponse.success(tickets);
  }

  @MessagePattern(TicketPatterns.CREATE_TICKET)
  async createTicket(
    @Payload() ticket: CreateTicketDto,
  ): Promise<ServiceResponse<TicketDto>> {
    const createdTicket = await this.ticketService.createTicket(ticket);
    return CreateServiceResponse.success(createdTicket);
  }

  @MessagePattern(TicketPatterns.CREATE_TICKET_BY_MERCHANT_ID)
  async createTicketByMerchantId(
    @Payload() data: { ticket: CreateTicketDto; merchantId: string },
  ): Promise<ServiceResponse<TicketDto>> {
    if (
      !(await this.ticketService.isOwnExperience(
        data.ticket.experienceId,
        data.merchantId,
      ))
    ) {
      return CreateServiceResponse.error('Forbidden', 403);
    }
    const createdTicket = await this.ticketService.createTicket(data.ticket);
    return CreateServiceResponse.success(createdTicket);
  }

  @MessagePattern(TicketPatterns.UPDATE_TICKET)
  async updateTicket(
    @Payload() data: { id: string; ticket: UpdateTicketDto },
  ): Promise<ServiceResponse<TicketDto>> {
    const updatedTicket = await this.ticketService.updateTicket(
      data.id,
      data.ticket,
    );
    if (!updatedTicket) {
      return CreateServiceResponse.error('Ticket not found', 404);
    }
    return CreateServiceResponse.success(updatedTicket);
  }

  @MessagePattern(TicketPatterns.UPDATE_TICKET_BY_MERCHANT_ID)
  async updateTicketByMerchantId(
    @Payload()
    data: {
      id: string;
      ticket: UpdateTicketDto;
      merchantId: string;
    },
  ): Promise<ServiceResponse<TicketDto>> {
    if (!(await this.ticketService.isOwnProperty(data.id, data.merchantId))) {
      return CreateServiceResponse.error('Forbidden', 403);
    }
    const updatedTicket = await this.ticketService.updateTicket(
      data.id,
      data.ticket,
    );
    if (!updatedTicket) {
      return CreateServiceResponse.error('Ticket not found', 404);
    }
    return CreateServiceResponse.success(updatedTicket);
  }

  @EventPattern(TicketPatterns.DELETE_TICKET)
  async deleteTicket(@Payload() id: string): Promise<void> {
    await this.ticketService.deleteTicket(id);
  }

  @EventPattern(TicketPatterns.DELETE_TICKET_BY_MERCHANT_ID)
  async deleteTicketByMerchantId(
    @Payload() data: { id: string; merchantId: string },
  ): Promise<void> {
    if (!(await this.ticketService.isOwnProperty(data.id, data.merchantId))) {
      return;
    }
    await this.ticketService.deleteTicket(data.id);
  }
}
