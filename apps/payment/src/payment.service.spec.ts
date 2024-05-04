import { Test } from '@nestjs/testing';
import { ConfigServiceMock, KafkaMock } from '@ticketpond-backend-nx/testing';
import { ServiceNames } from '@ticketpond-backend-nx/types';

import { ConfigService } from './config.service';
import { PaymentService } from './payment.service';

describe('PassService', () => {
  let service: PaymentService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: ConfigService,
          useValue: ConfigServiceMock,
        },
        {
          provide: ServiceNames.KAFKA_SERVICE,
          useValue: KafkaMock,
        },
      ],
    }).compile();

    service = app.get<PaymentService>(PaymentService);
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      expect(true).toBe(true);
    });
  });
});
