import { Test, TestingModule } from '@nestjs/testing';
import { Customer } from '@prisma/client';
import {
  DeepOrderWithCustomerDto,
  NotificationServiceInterface,
} from '@ticketpond-backend-nx/types';

import { NotificationServiceMock } from './__mocks__/notification-service.mock';
import { NotificationController } from './notification.controller';

let controller: NotificationController;

beforeEach(async () => {
  jest.clearAllMocks();
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      {
        provide: NotificationServiceInterface,
        useValue: NotificationServiceMock,
      },
    ],
    controllers: [NotificationController],
  }).compile();

  controller = module.get<NotificationController>(NotificationController);
});

it('should send welcome email', async () => {
  const customer = {} as Customer;
  await controller.sendWelcome(customer);
  expect(NotificationServiceMock.sendWelcome).toHaveBeenCalledWith(customer);
});

it('should send order confirmation email', async () => {
  const customer = {} as DeepOrderWithCustomerDto;
  await controller.sendOrderConfirmation(customer);
  expect(NotificationServiceMock.sendOrderSuccess).toHaveBeenCalledWith(
    customer,
  );
});
