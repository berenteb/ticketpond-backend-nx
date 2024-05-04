import { Test, TestingModule } from '@nestjs/testing';
import { PaymentServiceInterface } from '@ticketpond-backend-nx/types';

import { PaymentServiceMock } from './__mocks__/payment-service.mock';
import { PaymentController } from './payment.controller';

describe('PassController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        {
          provide: PaymentServiceInterface,
          useValue: PaymentServiceMock,
        },
      ],
    }).compile();
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {});
  });
});
