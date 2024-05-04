import { OrderDto } from '@ticketpond-backend-nx/types';

export const ClientKafkaMock = {
  send: jest.fn().mockResolvedValue(OrderDto),
};
