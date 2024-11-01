import { Test, TestingModule } from '@nestjs/testing';
import { ReqWithUserMock } from '@ticketpond-backend-nx/testing';
import { TicketServiceInterface } from '@ticketpond-backend-nx/types';

import { TicketMock } from './__mocks__/entities/ticket.mock';
import { TicketServiceMock } from './__mocks__/services/ticket-service.mock';
import { TicketMerchantController } from './ticket-merchant.controller';

let controller: TicketMerchantController;

beforeEach(async () => {
  jest.clearAllMocks();
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      { provide: TicketServiceInterface, useValue: TicketServiceMock },
    ],
    controllers: [TicketMerchantController],
  }).compile();

  controller = module.get<TicketMerchantController>(TicketMerchantController);
});

it('should get tickets for merchant', async () => {
  const tickets = await controller.getTickets(ReqWithUserMock);
  expect(tickets).toEqual([TicketMock]);
});

it('should get ticket by id and merchant id', async () => {
  const ticket = await controller.getTicketById('1', ReqWithUserMock);
  expect(ticket).toEqual(TicketMock);
});

it('should get tickets for experience', async () => {
  const tickets = await controller.getTicketsForExperience(
    '1',
    ReqWithUserMock,
  );
  expect(tickets).toEqual([TicketMock]);
});

it('should create ticket', async () => {
  const ticket = await controller.createTicket(TicketMock, ReqWithUserMock);
  expect(ticket).toEqual(TicketMock);
});

it('should update ticket', async () => {
  const ticket = await controller.updateTicket(
    '1',
    TicketMock,
    ReqWithUserMock,
  );
  expect(ticket).toEqual(TicketMock);
});

it('should delete ticket', async () => {
  await controller.deleteTicket('1', ReqWithUserMock);
  expect(TicketServiceMock.deleteTicketForMerchant).toHaveBeenCalledWith(
    '1',
    ReqWithUserMock.user.merchantId,
  );
});
