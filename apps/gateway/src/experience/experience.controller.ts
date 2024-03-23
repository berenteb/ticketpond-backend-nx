import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DeepExperienceDto, ExperienceDto } from '@ticketpond-backend-nx/types';
import { firstValueFrom } from 'rxjs';

import { ExperiencePatterns } from '../../../../libs/message-patterns/src/lib/experience.patterns';
import { ServiceNames } from '../utils/service-names';

@ApiTags('experience')
@Controller('experience')
export class ExperienceController {
  constructor(
    @Inject(ServiceNames.EXPERIENCE_SERVICE)
    private readonly experienceService: ClientProxy,
  ) {}

  @Get()
  @ApiOkResponse({ type: [ExperienceDto] })
  async getExperiences(): Promise<ExperienceDto[]> {
    return firstValueFrom(
      this.experienceService.send<ExperienceDto[]>(
        ExperiencePatterns.LIST_EXPERIENCES,
        {},
      ),
    );
  }

  @Get(':id')
  @ApiOkResponse({ type: DeepExperienceDto })
  @ApiNotFoundResponse()
  async getExperienceById(@Param('id') id: string): Promise<DeepExperienceDto> {
    return firstValueFrom(
      this.experienceService.send<DeepExperienceDto>(
        ExperiencePatterns.GET_EXPERIENCE,
        id,
      ),
    );
  }
}
