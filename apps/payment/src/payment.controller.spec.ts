import { Test, TestingModule } from '@nestjs/testing';

import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

describe('PassController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [PaymentService],
    }).compile();
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {});
  });
});
