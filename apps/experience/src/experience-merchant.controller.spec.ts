import { Test, TestingModule } from '@nestjs/testing';
import { ReqWithUserMock } from '@ticketpond-backend-nx/testing';
import { ExperienceServiceInterface } from '@ticketpond-backend-nx/types';

import { ExperienceMock } from './__mocks__/entities/experience.mock';
import { ExperienceServiceMock } from './__mocks__/services/experience-service.mock';
import { ExperienceMerchantController } from './experience-merchant.controller';

let controller: ExperienceMerchantController;

beforeEach(async () => {
  jest.clearAllMocks();
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      { provide: ExperienceServiceInterface, useValue: ExperienceServiceMock },
    ],
    controllers: [ExperienceMerchantController],
  }).compile();

  controller = module.get<ExperienceMerchantController>(
    ExperienceMerchantController,
  );
});

it('should get experiences by merchant id', async () => {
  const experiences = await controller.getExperiences(ReqWithUserMock);

  expect(experiences).toEqual([ExperienceMock]);

  expect(ExperienceServiceMock.getExperiencesByMerchantId).toHaveBeenCalledWith(
    ReqWithUserMock.user.merchantId,
  );
});

it('should get experience by id', async () => {
  const experience = await controller.getExperienceById('1');

  expect(experience).toEqual(ExperienceMock);

  expect(ExperienceServiceMock.getExperienceById).toHaveBeenCalledWith('1');
});

it('should create experience', async () => {
  const experience = await controller.createExperience(
    ExperienceMock,
    ReqWithUserMock,
  );

  expect(experience).toEqual(ExperienceMock);

  expect(ExperienceServiceMock.createExperience).toHaveBeenCalledWith(
    ExperienceMock,
    ReqWithUserMock.user.merchantId,
  );
});

it('should update experience', async () => {
  const experience = await controller.updateExperience(
    ExperienceMock.id,
    ExperienceMock,
    ReqWithUserMock,
  );

  expect(experience).toEqual(ExperienceMock);

  expect(
    ExperienceServiceMock.updateExperienceForMerchant,
  ).toHaveBeenCalledWith(
    ExperienceMock.id,
    ExperienceMock,
    ReqWithUserMock.user.merchantId,
  );
});

it('should validate pass', async () => {
  const validationResponse = await controller.validateExperiencePass(
    ExperienceMock.id,
    {
      ticketSerialNumber: '1234567890',
    },
    ReqWithUserMock,
  );

  expect(validationResponse).toEqual({
    isValid: true,
  });

  expect(ExperienceServiceMock.validateExperiencePass).toHaveBeenCalledWith(
    '1234567890',
    ExperienceMock.id,
    ReqWithUserMock.user.merchantId,
  );
});

it('should delete experience', async () => {
  await controller.deleteExperience(ExperienceMock.id, ReqWithUserMock);

  expect(
    ExperienceServiceMock.deleteExperienceForMerchant,
  ).toHaveBeenCalledWith(ExperienceMock.id, ReqWithUserMock.user.merchantId);
});
