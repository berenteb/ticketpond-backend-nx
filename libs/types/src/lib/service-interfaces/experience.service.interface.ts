import {
  CreateExperienceDto,
  DeepExperienceDto,
  ExperienceDto,
  UpdateExperienceDto,
  ValidationResponseDto,
} from '../dtos';

export abstract class ExperienceServiceInterface {
  abstract getExperiences(): Promise<ExperienceDto[]>;
  abstract getExperiencesByMerchantId(id: string): Promise<ExperienceDto[]>;

  abstract getExperienceById(id: string): Promise<DeepExperienceDto>;

  abstract validateExperiencePass(
    ticketSerialNumber: string,
    experienceId: string,
    merchantId: string,
  ): Promise<ValidationResponseDto>;

  abstract createExperience(
    experience: CreateExperienceDto,
    merchantId: string,
  ): Promise<ExperienceDto>;

  abstract updateExperience(
    id: string,
    experience: UpdateExperienceDto,
  ): Promise<ExperienceDto>;

  abstract updateExperienceForMerchant(
    id: string,
    experience: UpdateExperienceDto,
    merchantId: string,
  ): Promise<ExperienceDto>;

  abstract deleteExperience(id: string): Promise<void>;
  abstract deleteExperienceForMerchant(
    id: string,
    merchantId: string,
  ): Promise<void>;
}
