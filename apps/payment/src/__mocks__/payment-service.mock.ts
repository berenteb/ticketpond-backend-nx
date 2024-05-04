import { PaymentServiceInterface } from '@ticketpond-backend-nx/types';

export const PaymentServiceMock: PaymentServiceInterface = {
  createIntent: jest.fn().mockResolvedValue({
    clientSecret: '123456',
  }),
  handleWebhook: jest.fn(),
};
