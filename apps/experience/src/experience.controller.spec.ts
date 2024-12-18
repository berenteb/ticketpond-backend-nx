import { Test, TestingModule } from '@nestjs/testing';
import { ExperienceServiceInterface } from '@ticketpond-backend-nx/types';

import { ExperienceMock } from './__mocks__/entities/experience.mock';
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

it('should get all experiences', async () => {
  const result = await controller.getExperiences();
  expect(result).toEqual([ExperienceMock]);
  expect(ExperienceServiceMock.getExperiences).toHaveBeenCalledTimes(1);
});

it('should get experience by id', async () => {
  const result = await controller.getExperienceById('1');
  expect(result).toEqual(ExperienceMock);
  expect(ExperienceServiceMock.getExperienceById).toHaveBeenCalledTimes(1);
});
