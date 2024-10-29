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
  getTicketByIdForMerchant: jest.fn().mockResolvedValue(TicketMock),
  getTicketsForMerchantExperience: jest.fn().mockResolvedValue([TicketMock]),
  createTicketForMerchant: jest.fn().mockResolvedValue(TicketMock),
  updateTicketForMerchant: jest.fn().mockResolvedValue(TicketMock),
  deleteTicketForMerchant: jest.fn(),
};
