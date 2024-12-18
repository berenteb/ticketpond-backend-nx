import { Test, TestingModule } from '@nestjs/testing';
import { TicketServiceInterface } from '@ticketpond-backend-nx/types';

import { TicketMock } from './__mocks__/entities/ticket.mock';
import { TicketServiceMock } from './__mocks__/services/ticket-service.mock';
import { TicketController } from './ticket.controller';

let controller: TicketController;

beforeEach(async () => {
  jest.clearAllMocks();
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      { provide: TicketServiceInterface, useValue: TicketServiceMock },
    ],
    controllers: [TicketController],
  }).compile();

  controller = module.get<TicketController>(TicketController);
});

it('should get ticket by id', async () => {
  const ticket = await controller.getTicketById('1');
  expect(ticket).toEqual(TicketMock);
  expect(TicketServiceMock.getTicketById).toHaveBeenCalledWith('1');
});

it('should get tickets for experience', async () => {
  const tickets = await controller.getTicketsForExperience('1');
  expect(tickets).toEqual([TicketMock]);
  expect(TicketServiceMock.getTicketsForExperience).toHaveBeenCalledWith('1');
});
