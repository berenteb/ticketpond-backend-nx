import { Test, TestingModule } from '@nestjs/testing';

import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AssetController],
      providers: [AssetService],
    }).compile();
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      const appController = app.get<AssetController>(AssetController);
      expect(appController.getData()).toEqual({ message: 'Hello API' });
    });
  });
});
