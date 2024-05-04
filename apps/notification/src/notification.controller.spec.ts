import { Test, TestingModule } from '@nestjs/testing';
import { NotificationServiceInterface } from '@ticketpond-backend-nx/types';

import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

let controller: NotificationController;

beforeEach(async () => {
  jest.clearAllMocks();
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      {
        provide: NotificationServiceInterface,
        useValue: NotificationService,
      },
    ],
    controllers: [NotificationController],
  }).compile();

  controller = module.get<NotificationController>(NotificationController);
});

describe('NotificationController', () => {
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
