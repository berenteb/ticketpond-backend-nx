import { Test, TestingModule } from '@nestjs/testing';
import { AssetServiceInterface } from '@ticketpond-backend-nx/types';

import { AssetServiceMock } from './__mocks__/services/asset-service.mock';
import { AssetController } from './asset.controller';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AssetController],
      providers: [
        {
          provide: AssetServiceInterface,
          useValue: AssetServiceMock,
        },
      ],
    }).compile();
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      const appController = app.get<AssetController>(AssetController);
      expect(appController).toBeDefined();
    });
  });
});
