import { Test } from '@nestjs/testing';

import { AssetService } from './asset.service';

describe('AppService', () => {
  let service: AssetService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [AssetService],
    }).compile();

    service = app.get<AssetService>(AssetService);
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      expect(service.getData()).toEqual({ message: 'Hello API' });
    });
  });
});
