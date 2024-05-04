import { PassServiceInterface } from '@ticketpond-backend-nx/types';

export const PassServiceMock: PassServiceInterface = {
  generatePasses: jest.fn(),
};
