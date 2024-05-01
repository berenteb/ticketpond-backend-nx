import { Controller, Get, Inject, OnModuleInit, Param } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ExperiencePatterns } from '@ticketpond-backend-nx/message-patterns';
import {
  DeepExperienceDto,
  ExperienceDto,
  ServiceNames,
} from '@ticketpond-backend-nx/types';
import { firstValueFrom } from 'rxjs';

@ApiTags('experience')
@Controller('experience')
export class ExperienceController implements OnModuleInit {
  constructor(
    @Inject(ServiceNames.EXPERIENCE_SERVICE)
    private readonly experienceService: ClientKafka,
  ) {}

  async onModuleInit() {
    this.experienceService.subscribeToResponseOf(
      ExperiencePatterns.LIST_EXPERIENCES,
    );
    this.experienceService.subscribeToResponseOf(
      ExperiencePatterns.GET_EXPERIENCE,
    );
    await this.experienceService.connect();
  }

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
