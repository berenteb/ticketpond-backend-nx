import { AuthenticationServiceInterface } from '@ticketpond-backend-nx/types';

export const AuthenticationServiceMock: AuthenticationServiceInterface = {
  login: jest.fn().mockResolvedValue(''),
  getCustomerForProfile: jest.fn().mockResolvedValue({}),
  getMerchantForCustomer: jest.fn().mockResolvedValue({}),
  createCustomer: jest.fn().mockResolvedValue({}),
};
