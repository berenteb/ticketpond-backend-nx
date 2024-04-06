import { TicketServiceInterface } from '@ticketpond-backend-nx/types';

import { TicketMock } from '../entities/ticket.mock';

export const TicketServiceMock: TicketServiceInterface = {
  createTicket: jest.fn().mockResolvedValue(TicketMock),
  deleteTicket: jest.fn(),
  getTicketById: jest.fn().mockResolvedValue(TicketMock),
  getTickets: jest.fn().mockResolvedValue([TicketMock]),
  getTicketsForExperience: jest.fn().mockResolvedValue([TicketMock]),
  getTicketsForMerchant: jest.fn().mockResolvedValue([TicketMock]),
  updateTicket: jest.fn().mockResolvedValue(TicketMock),
  isOwnProperty: jest.fn().mockResolvedValue(true),
  isOwnExperience: jest.fn().mockResolvedValue(true),
};
