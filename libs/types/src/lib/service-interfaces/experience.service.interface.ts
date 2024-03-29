import {
  CreateExperienceDto,
  DeepExperienceDto,
  ExperienceDto,
  UpdateExperienceDto,
  ValidationResponseDto,
} from '../dtos';
import { IsOwnProperty } from './common.interface';

export abstract class ExperienceServiceInterface implements IsOwnProperty {
  abstract getExperiences(): Promise<ExperienceDto[]>;
  abstract getExperiencesByMerchantId(id: string): Promise<ExperienceDto[]>;

  abstract getExperienceById(id: string): Promise<DeepExperienceDto>;

  abstract validateExperiencePass(
    ticketSerialNumber: string,
    experienceId: string,
  ): Promise<ValidationResponseDto>;

  abstract createExperience(
    experience: CreateExperienceDto,
    merchantId: string,
  ): Promise<ExperienceDto>;
  abstract isOwnProperty(itemId: string, ownerId: string): Promise<boolean>;

  abstract updateExperience(
    id: string,
    experience: UpdateExperienceDto,
  ): Promise<ExperienceDto>;
  abstract deleteExperience(id: string): Promise<void>;
}
