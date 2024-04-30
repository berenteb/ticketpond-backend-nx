import { Test } from '@nestjs/testing';

import { PassService } from './pass.service';

describe('AppService', () => {
  let service: PassService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [PassService],
    }).compile();

    service = app.get<PassService>(PassService);
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {});
  });
});
