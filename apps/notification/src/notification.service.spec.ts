import { Test } from '@nestjs/testing';

import { NotificationService } from './notification.service';

describe('PaymentService', () => {
  let service: NotificationService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [NotificationService],
    }).compile();

    service = app.get<NotificationService>(NotificationService);
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {});
  });
});
