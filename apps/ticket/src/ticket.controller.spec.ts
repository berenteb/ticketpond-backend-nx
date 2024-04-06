import { UnauthorizedException } from '@nestjs/common';
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

it('should get tickets', async () => {
  const tickets = await controller.listTickets();
  expect(tickets).toEqual([TicketMock]);
});

it('should get ticket by id', async () => {
  const ticket = await controller.getTicketById('1');
  expect(ticket).toEqual(TicketMock);
});

it('should get ticket by id and merchant id', async () => {
  const ticket = await controller.getTicketByMerchantId({
    id: '1',
    merchantId: '1',
  });
  expect(ticket).toEqual(TicketMock);
});

it('should get tickets for experience', async () => {
  const tickets = await controller.getTicketsForExperience('1');
  expect(tickets).toEqual([TicketMock]);
});

it('should create ticket', async () => {
  const ticket = await controller.createTicket(TicketMock);
  expect(ticket).toEqual(TicketMock);
});

it('should create ticket by merchant id', async () => {
  const ticket = await controller.createTicketByMerchantId({
    ticket: TicketMock,
    merchantId: '1',
  });
  expect(ticket).toEqual(TicketMock);
});

it('should throw if ticket experience does not belong to merchant', async () => {
  (TicketServiceMock.isOwnExperience as jest.Mock).mockResolvedValueOnce(false);
  await expect(
    controller.createTicketByMerchantId({
      ticket: TicketMock,
      merchantId: '1',
    }),
  ).rejects.toThrow(UnauthorizedException);
});

it('should update ticket', async () => {
  const ticket = await controller.updateTicket({ id: '1', ticket: TicketMock });
  expect(ticket).toEqual(TicketMock);
});

it('should update ticket by merchant id', async () => {
  const ticket = await controller.updateTicketByMerchantId({
    id: '1',
    ticket: TicketMock,
    merchantId: '1',
  });
  expect(ticket).toEqual(TicketMock);
});

it('should throw if ticket does not belong to merchant', async () => {
  (TicketServiceMock.isOwnProperty as jest.Mock).mockResolvedValueOnce(false);
  await expect(
    controller.updateTicketByMerchantId({
      id: '1',
      ticket: TicketMock,
      merchantId: '1',
    }),
  ).rejects.toThrow(UnauthorizedException);
});

it('should delete ticket', async () => {
  await controller.deleteTicket('1');
  expect(TicketServiceMock.deleteTicket).toHaveBeenCalledWith('1');
});

it('should delete ticket by merchant id', async () => {
  await controller.deleteTicketByMerchantId({ id: '1', merchantId: '1' });
  expect(TicketServiceMock.deleteTicket).toHaveBeenCalledWith('1');
});

it('should throw if ticket does not belong to merchant', async () => {
  (TicketServiceMock.isOwnProperty as jest.Mock).mockResolvedValueOnce(false);
  await expect(
    controller.deleteTicketByMerchantId({ id: '1', merchantId: '1' }),
  ).rejects.toThrow(UnauthorizedException);
});
