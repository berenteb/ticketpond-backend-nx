import { OrderDto } from '@ticketpond-backend-nx/types';

export const ClientProxyMock = {
  send: jest.fn().mockResolvedValue(OrderDto),
};
