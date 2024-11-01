import { Test, TestingModule } from '@nestjs/testing';
import { ExperienceServiceInterface } from '@ticketpond-backend-nx/types';

import { ExperienceMock } from './__mocks__/entities/experience.mock';
import { ExperienceServiceMock } from './__mocks__/services/experience-service.mock';
import { ExperienceAdminController } from './experience-admin.controller';

let controller: ExperienceAdminController;

beforeEach(async () => {
  jest.clearAllMocks();
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      { provide: ExperienceServiceInterface, useValue: ExperienceServiceMock },
    ],
    controllers: [ExperienceAdminController],
  }).compile();

  controller = module.get<ExperienceAdminController>(ExperienceAdminController);
});

it('should get experiences', async () => {
  const result = await controller.getExperiences();
  expect(result).toEqual([ExperienceMock]);
  expect(ExperienceServiceMock.getExperiences).toHaveBeenCalledTimes(1);
});

it('should get experience by id', async () => {
  const result = await controller.getExperienceById('1');
  expect(result).toEqual(ExperienceMock);
  expect(ExperienceServiceMock.getExperienceById).toHaveBeenCalledWith('1');
});

it('should update experience', async () => {
  const result = await controller.updateExperience('1', {} as any);
  expect(result).toEqual(ExperienceMock);
  expect(ExperienceServiceMock.updateExperience).toHaveBeenCalledWith('1', {});
});

it('should delete experience', async () => {
  await controller.deleteExperience('1');
  expect(ExperienceServiceMock.deleteExperience).toHaveBeenCalledWith('1');
});
