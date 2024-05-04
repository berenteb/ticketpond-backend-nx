import { NotificationServiceInterface } from '@ticketpond-backend-nx/types';

export const NotificationServiceMock: NotificationServiceInterface = {
  sendOrderSuccess: jest.fn(),
  sendWelcome: jest.fn(),
};
