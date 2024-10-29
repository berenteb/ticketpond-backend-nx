import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@ticketpond-backend-nx/prisma';
import {
  CreateTicketDto,
  DeepTicketDto,
  TicketDto,
  TicketServiceInterface,
  UpdateTicketDto,
} from '@ticketpond-backend-nx/types';

@Injectable()
export class TicketService implements TicketServiceInterface {
  private readonly logger = new Logger(TicketService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async getTicketByIdForMerchant(
    id: string,
    merchantId: string,
  ): Promise<DeepTicketDto> {
    return this.prismaService.ticket.findUnique({
      where: { id, experience: { merchantId } },
      include: { experience: true },
    });
  }

  async updateTicketForMerchant(
    id: string,
    ticket: UpdateTicketDto,
    merchantId: string,
  ): Promise<TicketDto> {
    return this.prismaService.ticket.update({
      where: { id, experience: { merchantId } },
      data: ticket,
    });
  }

  async deleteTicketForMerchant(id: string, merchantId: string): Promise<void> {
    await this.prismaService.ticket.delete({
      where: { id, experience: { merchantId } },
    });
  }

  async getTicketsForMerchantExperience(
    experienceId: string,
    merchantId: string,
  ): Promise<TicketDto[]> {
    return this.prismaService.ticket.findMany({
      where: { experienceId, experience: { merchantId } },
    });
  }
  async createTicket(ticket: CreateTicketDto): Promise<TicketDto> {
    const created = await this.prismaService.ticket.create({ data: ticket });
    this.logger.debug(`Created ticket with id ${created.id}`);
    return created;
  }

  async createTicketForMerchant(
    { experienceId, ...ticket }: CreateTicketDto,
    merchantId: string,
  ): Promise<TicketDto> {
    const created = await this.prismaService.ticket.create({
      data: {
        ...ticket,
        experience: { connect: { id: experienceId, merchantId } },
      },
    });
    this.logger.debug(`Created ticket with id ${created.id}`);
    return created;
  }

  async getTicketById(id: string): Promise<DeepTicketDto> {
    const ticket = await this.prismaService.ticket.findUnique({
      where: { id },
      include: { experience: true },
    });
    if (!ticket) {
      return null;
    }
    this.logger.debug(`Found ticket with id ${id}`);
    return ticket;
  }

  async getTicketsForExperience(experienceId: string): Promise<TicketDto[]> {
    const tickets = await this.prismaService.ticket.findMany({
      where: { experienceId },
    });
    this.logger.debug(
      `Found ${tickets.length} tickets for experience ${experienceId}`,
    );
    return tickets;
  }

  async getTickets(): Promise<DeepTicketDto[]> {
    const tickets = await this.prismaService.ticket.findMany({
      include: { experience: true },
    });
    this.logger.debug(`Found ${tickets.length} tickets`);
    return tickets;
  }

  async updateTicket(id: string, ticket: UpdateTicketDto): Promise<TicketDto> {
    const updated = await this.prismaService.ticket.update({
      where: { id },
      data: ticket,
    });
    this.logger.debug(`Updated ticket with id ${id}`);
    return updated;
  }

  async deleteTicket(id: string): Promise<void> {
    await this.prismaService.ticket.delete({ where: { id } });
    this.logger.debug(`Deleted ticket with id ${id}`);
  }

  async getTicketsForMerchant(id: string): Promise<DeepTicketDto[]> {
    const tickets = await this.prismaService.ticket.findMany({
      where: { experience: { merchantId: id } },
      include: { experience: true },
    });
    this.logger.debug(
      `Found ${tickets.length} tickets for merchant with id ${id}`,
      TicketService.name,
    );
    return tickets;
  }
}
