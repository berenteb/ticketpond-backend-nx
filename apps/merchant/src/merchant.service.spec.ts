import { Test } from '@nestjs/testing';

import { MerchantService } from './merchant.service';

describe('AppService', () => {
  let service: MerchantService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [MerchantService],
    }).compile();

    service = app.get<MerchantService>(MerchantService);
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {});
  });
});
