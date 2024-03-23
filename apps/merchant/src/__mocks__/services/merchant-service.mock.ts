import { MerchantServiceInterface } from '@ticketpond-backend-nx/types';

import { MerchantMock } from '../entities/merchantMock';

export const MerchantServiceMock: MerchantServiceInterface = {
  assignCustomerToMerchant: jest.fn().mockResolvedValue(undefined),
  createMerchant: jest.fn().mockResolvedValue(MerchantMock),
  deleteMerchant: jest.fn().mockResolvedValue(undefined),
  getMerchantById: jest.fn().mockResolvedValue(MerchantMock),
  getMerchantByUserId: jest.fn().mockResolvedValue(MerchantMock),
  getMerchants: jest.fn().mockResolvedValue([MerchantMock]),
  updateMerchant: jest.fn().mockResolvedValue(MerchantMock),
  updateMerchantByUserId: jest.fn().mockResolvedValue(MerchantMock),
};
