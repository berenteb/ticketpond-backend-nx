import { AssetServiceInterface } from '@ticketpond-backend-nx/types';

export const AssetServiceMock: AssetServiceInterface = {
  deleteFile: jest.fn(),
  uploadFile: jest.fn(),
};
