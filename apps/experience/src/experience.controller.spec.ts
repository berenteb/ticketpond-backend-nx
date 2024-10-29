import { Test, TestingModule } from '@nestjs/testing';
import { ExperienceServiceInterface } from '@ticketpond-backend-nx/types';

import { ExperienceServiceMock } from './__mocks__/services/experience-service.mock';
import { ExperienceController } from './experience.controller';

let controller: ExperienceController;

beforeEach(async () => {
  jest.clearAllMocks();
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      { provide: ExperienceServiceInterface, useValue: ExperienceServiceMock },
    ],
    controllers: [ExperienceController],
  }).compile();

  controller = module.get<ExperienceController>(ExperienceController);
});
