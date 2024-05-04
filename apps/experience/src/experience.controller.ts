import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { ExperiencePatterns } from '@ticketpond-backend-nx/message-patterns';
import {
  CreateExperienceDto,
  DeepExperienceDto,
  ExperienceDto,
  ExperienceServiceInterface,
  ServiceResponse,
  UpdateExperienceDto,
  ValidationResponseDto,
} from '@ticketpond-backend-nx/types';
import { CreateServiceResponse } from '@ticketpond-backend-nx/utils';

@Controller()
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceServiceInterface) {}

  @MessagePattern(ExperiencePatterns.LIST_EXPERIENCES)
  async listExperiences(): Promise<ServiceResponse<ExperienceDto[]>> {
    const experiences = await this.experienceService.getExperiences();
    return CreateServiceResponse.success(experiences);
  }

  @MessagePattern(ExperiencePatterns.GET_EXPERIENCE)
  async getExperienceById(
    @Payload() id: string,
  ): Promise<ServiceResponse<DeepExperienceDto>> {
    const experience = await this.experienceService.getExperienceById(id);
    if (!experience)
      return CreateServiceResponse.error('Experience not found', 404);
    return CreateServiceResponse.success(experience);
  }

  @MessagePattern(ExperiencePatterns.GET_EXPERIENCES_BY_MERCHANT_ID)
  async getExperiencesByMerchantId(
    @Payload() id: string,
  ): Promise<ServiceResponse<ExperienceDto[]>> {
    const experiences =
      await this.experienceService.getExperiencesByMerchantId(id);
    return CreateServiceResponse.success(experiences);
  }

  @MessagePattern(ExperiencePatterns.CREATE_EXPERIENCE)
  async createExperience(
    @Payload() data: { experience: CreateExperienceDto; merchantId: string },
  ): Promise<ServiceResponse<ExperienceDto>> {
    const created = await this.experienceService.createExperience(
      data.experience,
      data.merchantId,
    );
    return CreateServiceResponse.success(created);
  }

  @MessagePattern(ExperiencePatterns.UPDATE_EXPERIENCE)
  async updateExperience(
    @Payload() data: { id: string; experience: UpdateExperienceDto },
  ): Promise<ServiceResponse<ExperienceDto>> {
    const updatedExperience = await this.experienceService.updateExperience(
      data.id,
      data.experience,
    );
    if (!updatedExperience)
      return CreateServiceResponse.error('Experience not found', 404);
    return CreateServiceResponse.success(updatedExperience);
  }

  @MessagePattern(ExperiencePatterns.UPDATE_EXPERIENCE_BY_MERCHANT_ID)
  async updateExperienceByMerchantId(
    @Payload()
    data: {
      id: string;
      experience: UpdateExperienceDto;
      merchantId: string;
    },
  ): Promise<ServiceResponse<ExperienceDto>> {
    if (!(await this.experienceService.isOwnProperty(data.id, data.merchantId)))
      return CreateServiceResponse.error('Forbidden', 403);
    const updatedExperience = await this.experienceService.updateExperience(
      data.id,
      data.experience,
    );
    if (!updatedExperience)
      return CreateServiceResponse.error('Experience not found', 404);
    return CreateServiceResponse.success(updatedExperience);
  }

  @EventPattern(ExperiencePatterns.DELETE_EXPERIENCE)
  async deleteExperience(@Payload() id: string): Promise<void> {
    await this.experienceService.deleteExperience(id);
  }

  @MessagePattern(ExperiencePatterns.DELETE_EXPERIENCE_BY_MERCHANT_ID)
  async deleteExperienceByMerchantId(
    @Payload() data: { id: string; merchantId: string },
  ): Promise<void> {
    if (await this.experienceService.isOwnProperty(data.id, data.merchantId)) {
      await this.experienceService.deleteExperience(data.id);
    }
  }

  @MessagePattern(ExperiencePatterns.VALIDATE_EXPERIENCE_PASS)
  async validateExperiencePass(
    @Payload()
    data: {
      experienceId: string;
      ticketSerialNumber: string;
      merchantId: string;
    },
  ): Promise<ServiceResponse<ValidationResponseDto>> {
    if (
      !(await this.experienceService.isOwnProperty(
        data.experienceId,
        data.merchantId,
      ))
    )
      return CreateServiceResponse.error('Forbidden', 403);
    const result = await this.experienceService.validateExperiencePass(
      data.ticketSerialNumber,
      data.experienceId,
    );
    return CreateServiceResponse.success(result);
  }
}
