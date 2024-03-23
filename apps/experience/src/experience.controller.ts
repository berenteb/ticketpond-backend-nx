import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  CreateExperienceDto,
  DeepExperienceDto,
  ExperienceDto,
  ExperienceServiceInterface,
  UpdateExperienceDto,
  ValidationResponseDto,
} from '@ticketpond-backend-nx/types';

import { ExperiencePatterns } from '../../../libs/message-patterns/src/lib/experience.patterns';

@Controller()
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceServiceInterface) {}

  @MessagePattern(ExperiencePatterns.LIST_EXPERIENCES)
  async listExperiences(): Promise<ExperienceDto[]> {
    return this.experienceService.getExperiences();
  }

  @MessagePattern(ExperiencePatterns.GET_EXPERIENCE)
  async getExperienceById(id: string): Promise<DeepExperienceDto> {
    return this.experienceService.getExperienceById(id);
  }

  @MessagePattern(ExperiencePatterns.GET_EXPERIENCES_BY_MERCHANT_ID)
  async getExperiencesByMerchantId(id: string): Promise<ExperienceDto[]> {
    return this.experienceService.getExperiencesByMerchantId(id);
  }

  @MessagePattern(ExperiencePatterns.CREATE_EXPERIENCE)
  async createExperience(data: {
    experience: CreateExperienceDto;
    merchantId: string;
  }): Promise<ExperienceDto> {
    return this.experienceService.createExperience(
      data.experience,
      data.merchantId,
    );
  }

  @MessagePattern(ExperiencePatterns.UPDATE_EXPERIENCE)
  async updateExperience(data: {
    id: string;
    experience: UpdateExperienceDto;
  }): Promise<ExperienceDto | null> {
    return this.experienceService.updateExperience(data.id, data.experience);
  }

  @MessagePattern(ExperiencePatterns.UPDATE_EXPERIENCE_BY_MERCHANT_ID)
  async updateExperienceByMerchantId(data: {
    id: string;
    experience: UpdateExperienceDto;
    merchantId: string;
  }): Promise<ExperienceDto | null> {
    if (!(await this.experienceService.isOwnProperty(data.id, data.merchantId)))
      return null;
    return this.experienceService.updateExperience(data.id, data.experience);
  }

  @MessagePattern(ExperiencePatterns.DELETE_EXPERIENCE)
  async deleteExperience(id: string): Promise<void> {
    return this.experienceService.deleteExperience(id);
  }

  @MessagePattern(ExperiencePatterns.DELETE_EXPERIENCE_BY_MERCHANT_ID)
  async deleteExperienceByMerchantId(data: {
    id: string;
    merchantId: string;
  }): Promise<void> {
    if (!(await this.experienceService.isOwnProperty(data.id, data.merchantId)))
      return;
    return this.experienceService.deleteExperience(data.id);
  }

  @MessagePattern(ExperiencePatterns.VALIDATE_EXPERIENCE_PASS)
  async validateExperiencePass(data: {
    experienceId: string;
    ticketSerialNumber: string;
    merchantId: string;
  }): Promise<ValidationResponseDto | null> {
    if (
      !(await this.experienceService.isOwnProperty(
        data.experienceId,
        data.merchantId,
      ))
    )
      return null;
    return this.experienceService.validateExperiencePass(
      data.ticketSerialNumber,
      data.experienceId,
    );
  }
}
