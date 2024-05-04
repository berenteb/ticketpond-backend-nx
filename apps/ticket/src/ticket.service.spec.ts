import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@ticketpond-backend-nx/prisma';
import { PrismaMock } from '@ticketpond-backend-nx/testing';

import { TicketMock } from './__mocks__/entities/ticket.mock';
import { TicketService } from './ticket.service';

let service: TicketService;

beforeEach(async () => {
  jest.clearAllMocks();
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      TicketService,
      { provide: PrismaService, useValue: PrismaMock },
    ],
  }).compile();

  service = module.get<TicketService>(TicketService);
});

it('should create ticket', async () => {
  PrismaMock.ticket.create.mockResolvedValue(TicketMock);
  const ticket = await service.createTicket(TicketMock);
  expect(PrismaMock.ticket.create).toHaveBeenCalledWith({ data: TicketMock });
  expect(ticket).toEqual(TicketMock);
});

it('should get ticket by id', async () => {
  PrismaMock.ticket.findUnique.mockResolvedValue(TicketMock);
  const ticket = await service.getTicketById(TicketMock.id);
  expect(PrismaMock.ticket.findUnique).toHaveBeenCalledWith({
    where: expect.any(Object),
    include: { experience: true },
  });
  expect(ticket).toEqual(TicketMock);
});

it("should return null if ticket doesn't exist", async () => {
  PrismaMock.ticket.findUnique.mockResolvedValue(null);
  expect(await service.getTicketById(TicketMock.id)).toBe(null);
});

it('should get tickets for experience', async () => {
  PrismaMock.ticket.findMany.mockResolvedValue([TicketMock]);
  const tickets = await service.getTicketsForExperience(
    TicketMock.experienceId,
  );

  expect(tickets).toEqual([TicketMock]);
});

it('should get tickets', async () => {
  PrismaMock.ticket.findMany.mockResolvedValue([TicketMock]);
  const tickets = await service.getTickets();

  expect(PrismaMock.ticket.findMany).toHaveBeenCalledWith({
    include: { experience: true },
  });

  expect(tickets).toEqual([TicketMock]);
});

it('should update ticket', async () => {
  PrismaMock.ticket.update.mockResolvedValue(TicketMock);
  const ticket = await service.updateTicket(TicketMock.id, TicketMock);

  expect(PrismaMock.ticket.update).toHaveBeenCalledWith({
    where: { id: TicketMock.id },
    data: TicketMock,
  });

  expect(ticket).toEqual(TicketMock);
});

it('should delete ticket', async () => {
  await service.deleteTicket(TicketMock.id);

  expect(PrismaMock.ticket.delete).toHaveBeenCalledWith({
    where: { id: TicketMock.id },
  });
});

it('should get tickets for merchant', async () => {
  PrismaMock.ticket.findMany.mockResolvedValue([TicketMock]);
  const tickets = await service.getTicketsForMerchant('merchantId');

  expect(PrismaMock.ticket.findMany).toHaveBeenCalledWith({
    where: { experience: { merchantId: 'merchantId' } },
    include: { experience: true },
  });
  expect(tickets).toEqual([TicketMock]);
});

it('should check if ticket is owned by merchant', async () => {
  PrismaMock.ticket.findUnique.mockResolvedValue(TicketMock);
  const isOwned = await service.isOwnProperty(TicketMock.id, 'merchantId');

  expect(PrismaMock.ticket.findUnique).toHaveBeenCalledWith({
    where: { id: TicketMock.id, experience: { merchantId: 'merchantId' } },
  });
  expect(isOwned).toBe(true);
});

it('should check if experience is owned by merchant', async () => {
  PrismaMock.experience.findUnique.mockResolvedValue({
    merchantId: 'merchantId',
  });
  const isOwned = await service.isOwnExperience(
    TicketMock.experienceId,
    'merchantId',
  );

  expect(PrismaMock.experience.findUnique).toHaveBeenCalledWith({
    where: { id: TicketMock.experienceId, merchantId: 'merchantId' },
  });
  expect(isOwned).toBe(true);
});
