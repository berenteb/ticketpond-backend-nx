import { Test, TestingModule } from '@nestjs/testing';

import { PassController } from './pass.controller';
import { PassService } from './pass.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [PassController],
      providers: [PassService],
    }).compile();
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      const appController = app.get<PassController>(PassController);
      expect(appController.getData()).toEqual({ message: 'Hello API' });
    });
  });
});
