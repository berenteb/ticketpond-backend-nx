import { Test, TestingModule } from '@nestjs/testing';

import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [PaymentService],
    }).compile();
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      const appController = app.get<PaymentController>(PaymentController);
      expect(appController.getData()).toEqual({ message: 'Hello API' });
    });
  });
});
