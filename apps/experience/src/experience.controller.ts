import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  DeepExperienceDto,
  ExperienceDto,
  ExperienceServiceInterface,
} from '@ticketpond-backend-nx/types';

@ApiTags('Experience')
@Controller()
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceServiceInterface) {}

  @Get()
  @ApiOkResponse({ type: [ExperienceDto] })
  async getExperiences(): Promise<ExperienceDto[]> {
    return this.experienceService.getExperiences();
  }

  @Get(':id')
  @ApiOkResponse({ type: DeepExperienceDto })
  @ApiNotFoundResponse()
  async getExperienceById(@Param('id') id: string): Promise<DeepExperienceDto> {
    const experience = await this.experienceService.getExperienceById(id);
    if (!experience) {
      throw new NotFoundException('Experience not found');
    }
    return experience;
  }
}
