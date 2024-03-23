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

it('should list experiences', async () => {
  const experiences = await controller.listExperiences();
  expect(ExperienceServiceMock.getExperiences).toHaveBeenCalled();
  expect(experiences).toEqual([ExperienceMock]);
});

it('should get experience by id', async () => {
  const experience = await controller.getExperienceById('test-experience-id');
  expect(ExperienceServiceMock.getExperienceById).toHaveBeenCalledWith(
    'test-experience-id',
  );
  expect(experience).toEqual(ExperienceMock);
});

it('should get experiences by merchant id', async () => {
  const experiences =
    await controller.getExperiencesByMerchantId('test-merchant-id');
  expect(ExperienceServiceMock.getExperiencesByMerchantId).toHaveBeenCalledWith(
    'test-merchant-id',
  );
  expect(experiences).toEqual([ExperienceMock]);
});

it('should create experience', async () => {
  const experience = await controller.createExperience({
    experience: ExperienceMock,
    merchantId: 'test-merchant-id',
  });
  expect(ExperienceServiceMock.createExperience).toHaveBeenCalledWith(
    ExperienceMock,
    'test-merchant-id',
  );
  expect(experience).toEqual(ExperienceMock);
});

it('should update experience', async () => {
  const experience = await controller.updateExperience({
    id: 'test-experience-id',
    experience: ExperienceMock,
  });
  expect(ExperienceServiceMock.updateExperience).toHaveBeenCalledWith(
    'test-experience-id',
    ExperienceMock,
  );
  expect(experience).toEqual(ExperienceMock);
});

it('should update experience by merchant id', async () => {
  (ExperienceServiceMock.isOwnProperty as jest.Mock).mockResolvedValue(true);
  const experience = await controller.updateExperienceByMerchantId({
    id: 'test-experience-id',
    experience: ExperienceMock,
    merchantId: 'test-merchant-id',
  });
  expect(ExperienceServiceMock.isOwnProperty).toHaveBeenCalledWith(
    'test-experience-id',
    'test-merchant-id',
  );
  expect(ExperienceServiceMock.updateExperience).toHaveBeenCalledWith(
    'test-experience-id',
    ExperienceMock,
  );
  expect(experience).toEqual(ExperienceMock);
});

it('should not update experience by merchant id', async () => {
  (ExperienceServiceMock.isOwnProperty as jest.Mock).mockResolvedValue(false);
  const experience = await controller.updateExperienceByMerchantId({
    id: 'test-experience-id',
    experience: ExperienceMock,
    merchantId: 'test-merchant-id',
  });
  expect(ExperienceServiceMock.isOwnProperty).toHaveBeenCalledWith(
    'test-experience-id',
    'test-merchant-id',
  );
  expect(ExperienceServiceMock.updateExperience).not.toHaveBeenCalled();
  expect(experience).toBeNull();
});

it('should delete experience', async () => {
  await controller.deleteExperience('test-experience-id');
  expect(ExperienceServiceMock.deleteExperience).toHaveBeenCalledWith(
    'test-experience-id',
  );
});

it('should delete experience by merchant id', async () => {
  (ExperienceServiceMock.isOwnProperty as jest.Mock).mockResolvedValue(true);
  await controller.deleteExperienceByMerchantId({
    id: 'test-experience-id',
    merchantId: 'test-merchant-id',
  });
  expect(ExperienceServiceMock.isOwnProperty).toHaveBeenCalledWith(
    'test-experience-id',
    'test-merchant-id',
  );
  expect(ExperienceServiceMock.deleteExperience).toHaveBeenCalledWith(
    'test-experience-id',
  );
});

it('should not delete experience by merchant id', async () => {
  (ExperienceServiceMock.isOwnProperty as jest.Mock).mockResolvedValue(false);
  await controller.deleteExperienceByMerchantId({
    id: 'test-experience-id',
    merchantId: 'test-merchant-id',
  });
  expect(ExperienceServiceMock.isOwnProperty).toHaveBeenCalledWith(
    'test-experience-id',
    'test-merchant-id',
  );
  expect(ExperienceServiceMock.deleteExperience).not.toHaveBeenCalled();
});

it('should validate experience pass', async () => {
  (ExperienceServiceMock.isOwnProperty as jest.Mock).mockResolvedValue(true);
  const validationResponse = await controller.validateExperiencePass({
    experienceId: 'test-experience-id',
    ticketSerialNumber: 'test-ticket-serial-number',
    merchantId: 'test-merchant-id',
  });
  expect(ExperienceServiceMock.isOwnProperty).toHaveBeenCalledWith(
    'test-experience-id',
    'test-merchant-id',
  );
  expect(ExperienceServiceMock.validateExperiencePass).toHaveBeenCalledWith(
    'test-ticket-serial-number',
    'test-experience-id',
  );
  expect(validationResponse).toEqual({ isValid: true });
});

it('should not validate experience pass', async () => {
  (ExperienceServiceMock.isOwnProperty as jest.Mock).mockResolvedValue(false);
  const validationResponse = await controller.validateExperiencePass({
    experienceId: 'test-experience-id',
    ticketSerialNumber: 'test-ticket-serial-number',
    merchantId: 'test-merchant-id',
  });
  expect(ExperienceServiceMock.isOwnProperty).toHaveBeenCalledWith(
    'test-experience-id',
    'test-merchant-id',
  );
  expect(ExperienceServiceMock.validateExperiencePass).not.toHaveBeenCalled();
  expect(validationResponse).toBeNull();
});
