import { PaymentServiceInterface } from '@ticketpond-backend-nx/types';

export const PaymentServiceMock: PaymentServiceInterface = {
  createIntent: jest.fn(),
  handleWebhook: jest.fn(),
};
