import { ExperienceServiceInterface } from '@ticketpond-backend-nx/types';

import { ExperienceMock } from '../entities/experience.mock';

export const ExperienceServiceMock: ExperienceServiceInterface = {
  createExperience: jest.fn().mockResolvedValue(ExperienceMock),
  deleteExperience: jest.fn().mockResolvedValue(undefined),
  getExperienceById: jest.fn().mockResolvedValue(ExperienceMock),
  getExperiences: jest.fn().mockResolvedValue([ExperienceMock]),
  getExperiencesByMerchantId: jest.fn().mockResolvedValue([ExperienceMock]),
  updateExperience: jest.fn().mockResolvedValue(ExperienceMock),
  validateExperiencePass: jest.fn().mockResolvedValue({ isValid: true }),
  updateExperienceForMerchant: jest.fn().mockResolvedValue(ExperienceMock),
  deleteExperienceForMerchant: jest.fn().mockResolvedValue(undefined),
};
