import { Order, OrderStatus, PaymentStatus } from '@prisma/client';

export const OrderMock: Order = {
  createdAt: new Date(),
  customerId: 'customerId',
  id: 'orderId',
  orderStatus: OrderStatus.PENDING,
  paymentStatus: PaymentStatus.UNPAID,
  serialNumber: 'serialNumber',
};
