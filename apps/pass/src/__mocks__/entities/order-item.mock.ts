import { DeepOrderItemDto } from '@ticketpond-backend-nx/types';

export const OrderItemMock: DeepOrderItemDto = {
  id: 'orderItemId',
  orderId: 'orderId',
  price: 0,
  serialNumber: 'serialNumber',
  ticket: {
    experience: {
      name: 'Experience Name',
      id: 'experienceId',
      merchantId: 'merchantId',
      description: 'Description',
      startDate: new Date('2022-01-01T00:00:00.000Z'),
      endDate: new Date('2022-01-01T00:00:00.000Z'),
      bannerImage: 'bannerImage',
    },
    id: 'ticketId',
    name: 'Ticket Name',
    description: 'Description',
    price: 0,
    validFrom: new Date('2022-01-01T00:00:00.000Z'),
    validTo: new Date('2022-01-01T00:00:00.000Z'),
    experienceId: 'experienceId',
  },
  ticketId: 'ticketId',
};
