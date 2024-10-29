import {
  CreateTicketDto,
  DeepTicketDto,
  TicketDto,
  UpdateTicketDto,
} from '../dtos';

export abstract class TicketServiceInterface {
  abstract getTickets(): Promise<DeepTicketDto[]>;
  abstract getTicketsForMerchant(merchantId: string): Promise<DeepTicketDto[]>;
  abstract getTicketById(id: string): Promise<DeepTicketDto>;
  abstract getTicketByIdForMerchant(
    id: string,
    merchantId: string,
  ): Promise<DeepTicketDto>;
  abstract getTicketsForExperience(experienceId: string): Promise<TicketDto[]>;
  abstract getTicketsForMerchantExperience(
    experienceId: string,
    merchantId: string,
  ): Promise<TicketDto[]>;

  abstract createTicket(ticket: CreateTicketDto): Promise<TicketDto>;
  abstract createTicketForMerchant(
    ticket: CreateTicketDto,
    merchantId: string,
  ): Promise<TicketDto>;

  abstract updateTicket(
    id: string,
    ticket: UpdateTicketDto,
  ): Promise<TicketDto>;
  abstract updateTicketForMerchant(
    id: string,
    ticket: UpdateTicketDto,
    merchantId: string,
  ): Promise<TicketDto>;
  abstract deleteTicket(id: string): Promise<void>;
  abstract deleteTicketForMerchant(
    id: string,
    merchantId: string,
  ): Promise<void>;
}
