import {
  CreateTicketDto,
  DeepTicketDto,
  TicketDto,
  UpdateTicketDto,
} from '../dtos';
import { IsOwnProperty } from './common.interface';

export abstract class TicketServiceInterface implements IsOwnProperty {
  abstract getTickets(): Promise<DeepTicketDto[]>;
  abstract getTicketsForMerchant(id: string): Promise<DeepTicketDto[]>;
  abstract getTicketById(id: string): Promise<DeepTicketDto>;
  abstract getTicketsForExperience(experienceId: string): Promise<TicketDto[]>;
  abstract isOwnProperty(itemId: string, ownerId: string): Promise<boolean>;

  abstract createTicket(ticket: CreateTicketDto): Promise<TicketDto>;

  abstract updateTicket(
    id: string,
    ticket: UpdateTicketDto,
  ): Promise<TicketDto>;
  abstract deleteTicket(id: string): Promise<void>;
}
