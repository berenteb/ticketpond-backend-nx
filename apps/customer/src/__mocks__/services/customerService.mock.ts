import { CustomerServiceInterface } from '@ticketpond-backend-nx/types';

import { CustomerMock } from '../entities/customer.mock';

export const CustomerServiceMock: CustomerServiceInterface = {
  createCustomer: jest.fn().mockResolvedValue(CustomerMock),
  deleteCustomer: jest.fn().mockResolvedValue(void 0),
  getCustomerById: jest.fn().mockResolvedValue(CustomerMock),
  getCustomerByAuthId: jest.fn().mockResolvedValue(CustomerMock),
  getCustomers: jest.fn().mockResolvedValue([CustomerMock]),
  updateCustomer: jest.fn().mockResolvedValue(CustomerMock),
  updateCustomerById: jest.fn().mockResolvedValue(CustomerMock),
};
