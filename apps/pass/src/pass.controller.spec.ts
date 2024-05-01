import { Test, TestingModule } from '@nestjs/testing';

import { PassController } from './pass.controller';
import { PassService } from './pass.service';

describe('AssetController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [PassController],
      providers: [PassService],
    }).compile();
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {});
  });
});
