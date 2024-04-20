import { CartDto, DeepTicketDto, OrderDto } from '@ticketpond-backend-nx/types';

const ticketMock: DeepTicketDto = {
  description: 'ticket description',
  experience: {
    id: 'experience-id',
    name: 'experience name',
    merchantId: 'merchant-id',
    description: 'experience description',
    startDate: new Date(),
    endDate: new Date(),
    bannerImage: 'banner-image',
  },
  experienceId: 'experience-id',
  id: 'ticket-id',
  name: 'ticket name',
  price: 100,
  validFrom: new Date(),
  validTo: new Date(),
};

export const CartMock: CartDto = {
  id: 'cart-id',
  customerId: 'customer-id',
  items: [
    {
      cartId: 'cart-id',
      id: 'item-id',
      ticketId: 'ticket-id',
      ticket: ticketMock,
    },
  ],
};

export const OrderMock: OrderDto = {
  createdAt: new Date(),
  orderStatus: 'PENDING',
  paymentStatus: 'UNPAID',
  serialNumber: '',
  id: 'order-id',
  customerId: 'customer-id',
  items: [
    {
      id: 'item-id',
      orderId: 'order-id',
      ticketId: 'ticket-id',
      price: 100,
      serialNumber: 'serial-number',
    },
  ],
};
