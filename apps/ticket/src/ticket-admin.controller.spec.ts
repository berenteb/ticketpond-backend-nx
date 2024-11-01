import { Test, TestingModule } from '@nestjs/testing';
import { TicketServiceInterface } from '@ticketpond-backend-nx/types';

import { TicketMock } from './__mocks__/entities/ticket.mock';
import { TicketServiceMock } from './__mocks__/services/ticket-service.mock';
import { TicketAdminController } from './ticket-admin.controller';

let controller: TicketAdminController;

beforeEach(async () => {
  jest.clearAllMocks();
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      { provide: TicketServiceInterface, useValue: TicketServiceMock },
    ],
    controllers: [TicketAdminController],
  }).compile();

  controller = module.get<TicketAdminController>(TicketAdminController);
});

it('should get tickets', async () => {
  const tickets = await controller.getTickets();
  expect(tickets).toEqual([TicketMock]);
  expect(TicketServiceMock.getTickets).toHaveBeenCalled();
});

it('should get ticket by id', async () => {
  const ticket = await controller.getTicketById('1');
  expect(ticket).toEqual(TicketMock);
  expect(TicketServiceMock.getTicketById).toHaveBeenCalledWith('1');
});

it('should get tickets for experience', async () => {
  const tickets = await controller.getTicketsForExperience('1');
  expect(tickets).toEqual([TicketMock]);
});

it('should update ticket', async () => {
  const ticket = await controller.updateTicket('1', TicketMock);
  expect(ticket).toEqual(TicketMock);
});

it('should delete ticket', async () => {
  await controller.deleteTicket('1');
  expect(TicketServiceMock.deleteTicket).toHaveBeenCalledWith('1');
});
