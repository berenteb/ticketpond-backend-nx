import { Test, TestingModule } from '@nestjs/testing';

import { MerchantController } from './merchant.controller';
import { MerchantService } from './merchant.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [MerchantController],
      providers: [MerchantService],
    }).compile();
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      const appController = app.get<MerchantController>(MerchantController);
    });
  });
});
