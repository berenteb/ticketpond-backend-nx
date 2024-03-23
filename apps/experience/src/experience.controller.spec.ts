import { Test, TestingModule } from '@nestjs/testing';

import { ExperienceController } from './experience.controller';
import { ExperienceService } from './experience.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [ExperienceController],
      providers: [ExperienceService],
    }).compile();
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      const appController = app.get<ExperienceController>(ExperienceController);
      expect(appController.getData()).toEqual({ message: 'Hello API' });
    });
  });
});
