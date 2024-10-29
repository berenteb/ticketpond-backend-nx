import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard, PermissionGuard } from '@ticketpond-backend-nx/auth';
import {
  DeepExperienceDto,
  ExperienceDto,
  ExperienceServiceInterface,
  PermissionLevel,
  UpdateExperienceDto,
} from '@ticketpond-backend-nx/types';

@UseGuards(PermissionGuard(PermissionLevel.ADMIN))
@UseGuards(JwtGuard)
@ApiTags('Experience-Admin')
@Controller('admin')
@ApiCookieAuth('jwt')
export class ExperienceAdminController {
  constructor(private readonly experienceService: ExperienceServiceInterface) {}

  @Get()
  @ApiOkResponse({ type: [ExperienceDto] })
  async getExperiences(): Promise<ExperienceDto[]> {
    return this.experienceService.getExperiences();
  }

  @Get(':id')
  @ApiOkResponse({ type: ExperienceDto })
  async getExperienceById(@Param('id') id: string): Promise<DeepExperienceDto> {
    const experience = await this.experienceService.getExperienceById(id);
    if (!experience) {
      throw new NotFoundException('Experience not found');
    }
    return experience;
  }

  @Patch(':id')
  @ApiOkResponse({ type: ExperienceDto })
  async updateExperience(
    @Param('id') id: string,
    @Body() experience: UpdateExperienceDto,
  ): Promise<ExperienceDto> {
    const updatedExperience = await this.experienceService.updateExperience(
      id,
      experience,
    );
    if (!updatedExperience) {
      throw new NotFoundException('Experience not found');
    }
    return updatedExperience;
  }

  @Delete(':id')
  @ApiOkResponse()
  deleteExperience(@Param('id') id: string): Promise<void> {
    return this.experienceService.deleteExperience(id);
  }
}
