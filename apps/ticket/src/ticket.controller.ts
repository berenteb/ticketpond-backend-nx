import { Controller, UnauthorizedException } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TicketPatterns } from '@ticketpond-backend-nx/message-patterns';
import {
  CreateTicketDto,
  DeepTicketDto,
  TicketDto,
  TicketServiceInterface,
  UpdateTicketDto,
} from '@ticketpond-backend-nx/types';

@Controller()
export class TicketController {
  constructor(private readonly ticketService: TicketServiceInterface) {}

  @MessagePattern(TicketPatterns.LIST_TICKETS)
  async listTickets(): Promise<DeepTicketDto[]> {
    return await this.ticketService.getTickets();
  }

  @MessagePattern(TicketPatterns.LIST_TICKETS_BY_MERCHANT_ID)
  async getTicketsForMerchant(merchantId: string): Promise<TicketDto[]> {
    return await this.ticketService.getTicketsForMerchant(merchantId);
  }

  @MessagePattern(TicketPatterns.GET_TICKET)
  async getTicketById(id: string): Promise<DeepTicketDto> {
    return await this.ticketService.getTicketById(id);
  }

  @MessagePattern(TicketPatterns.GET_TICKET_BY_MERCHANT_ID)
  async getTicketByMerchantId(data: {
    id: string;
    merchantId: string;
  }): Promise<DeepTicketDto> {
    if (!(await this.ticketService.isOwnProperty(data.id, data.merchantId))) {
      throw new UnauthorizedException();
    }
    return await this.ticketService.getTicketById(data.id);
  }

  @MessagePattern(TicketPatterns.LIST_TICKETS_FOR_EXPERIENCE)
  async getTicketsForExperience(experienceId: string): Promise<TicketDto[]> {
    return await this.ticketService.getTicketsForExperience(experienceId);
  }

  @MessagePattern(TicketPatterns.CREATE_TICKET)
  async createTicket(ticket: CreateTicketDto): Promise<TicketDto> {
    return await this.ticketService.createTicket(ticket);
  }

  @MessagePattern(TicketPatterns.CREATE_TICKET_BY_MERCHANT_ID)
  async createTicketByMerchantId(data: {
    ticket: CreateTicketDto;
    merchantId: string;
  }): Promise<TicketDto> {
    if (
      !(await this.ticketService.isOwnExperience(
        data.ticket.experienceId,
        data.merchantId,
      ))
    ) {
      throw new UnauthorizedException();
    }
    return await this.ticketService.createTicket(data.ticket);
  }

  @MessagePattern(TicketPatterns.UPDATE_TICKET)
  async updateTicket(data: {
    id: string;
    ticket: UpdateTicketDto;
  }): Promise<TicketDto> {
    return await this.ticketService.updateTicket(data.id, data.ticket);
  }

  @MessagePattern(TicketPatterns.UPDATE_TICKET_BY_MERCHANT_ID)
  async updateTicketByMerchantId(data: {
    id: string;
    ticket: UpdateTicketDto;
    merchantId: string;
  }): Promise<TicketDto> {
    if (!(await this.ticketService.isOwnProperty(data.id, data.merchantId))) {
      throw new UnauthorizedException();
    }
    return await this.ticketService.updateTicket(data.id, data.ticket);
  }

  @MessagePattern(TicketPatterns.DELETE_TICKET)
  async deleteTicket(id: string): Promise<void> {
    return await this.ticketService.deleteTicket(id);
  }

  @MessagePattern(TicketPatterns.DELETE_TICKET_BY_MERCHANT_ID)
  async deleteTicketByMerchantId(data: {
    id: string;
    merchantId: string;
  }): Promise<void> {
    if (!(await this.ticketService.isOwnProperty(data.id, data.merchantId))) {
      throw new UnauthorizedException();
    }
    return await this.ticketService.deleteTicket(data.id);
  }
}
