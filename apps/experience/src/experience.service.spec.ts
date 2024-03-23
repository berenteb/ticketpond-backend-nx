import { Test } from '@nestjs/testing';

import { ExperienceService } from './experience.service';

describe('AppService', () => {
  let service: ExperienceService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [ExperienceService],
    }).compile();

    service = app.get<ExperienceService>(ExperienceService);
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      expect(service.getData()).toEqual({ message: 'Hello API' });
    });
  });
});
