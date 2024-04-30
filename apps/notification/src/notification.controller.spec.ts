import { Test, TestingModule } from '@nestjs/testing';

import { NotificationController } from './notification.controller';

let controller: NotificationController;

beforeEach(async () => {
  jest.clearAllMocks();
  const module: TestingModule = await Test.createTestingModule({
    providers: [],
    controllers: [NotificationController],
  }).compile();

  controller = module.get<NotificationController>(NotificationController);
});

describe('NotificationController', () => {
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
