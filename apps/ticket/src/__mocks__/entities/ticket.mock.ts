import { Ticket } from '@prisma/client';

export const TicketMock: Ticket = {
  description: 'ticket description',
  experienceId: 'experienceId',
  id: 'ticketId',
  name: 'ticket name',
  price: 100,
  validFrom: new Date(),
  validTo: new Date(),
};
