import { Test } from '@nestjs/testing';

import { PaymentService } from './payment.service';

describe('AppService', () => {
  let service: PaymentService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [PaymentService],
    }).compile();

    service = app.get<PaymentService>(PaymentService);
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      expect(service.getData()).toEqual({ message: 'Hello API' });
    });
  });
});
