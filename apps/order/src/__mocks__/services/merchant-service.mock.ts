import { OrderServiceInterface } from '@ticketpond-backend-nx/types';

import { OrderMock } from '../entities/orderMock';

export const OrderServiceMock: OrderServiceInterface = {
  cancelOrder: jest.fn(),
  createOrder: jest.fn().mockResolvedValue(OrderMock),
  deleteOrder: jest.fn(),
  failOrder: jest.fn(),
  fulfillOrder: jest.fn(),
  getOrderById: jest.fn().mockResolvedValue(OrderMock),
  getOrderByIdForCustomer: jest.fn().mockResolvedValue(OrderMock),
  getOrderByIdWithCustomer: jest.fn().mockResolvedValue(OrderMock),
  getOrders: jest.fn().mockResolvedValue([OrderMock]),
  getOrdersForCustomer: jest.fn().mockResolvedValue([OrderMock]),
  getOrdersForMerchant: jest.fn().mockResolvedValue([OrderMock]),
  isConnectedToMerchant: jest.fn().mockResolvedValue(true),
};
