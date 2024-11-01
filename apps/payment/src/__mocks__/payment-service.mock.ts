import { OrderStatus, PaymentStatus } from '@prisma/client';
import { PaymentServiceInterface } from '@ticketpond-backend-nx/types';

export const PaymentServiceMock: PaymentServiceInterface = {
  getOrderForCustomer: jest.fn().mockResolvedValue({
    createdAt: new Date(),
    customerId: 'customerId',
    id: 'orderId',
    orderStatus: OrderStatus.PENDING,
    paymentStatus: PaymentStatus.UNPAID,
    serialNumber: 'serialNumber',
  }),
  createIntent: jest.fn().mockResolvedValue({
    clientSecret: '123456',
  }),
  handleWebhook: jest.fn(),
};
