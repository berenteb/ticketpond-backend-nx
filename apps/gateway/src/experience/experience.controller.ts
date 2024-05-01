import { Controller, Get, Inject, Param } from '@nestjs/common';
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
export class ExperienceController {
  constructor(
    @Inject(ServiceNames.KAFKA_SERVICE)
    private readonly kafkaService: ClientKafka,
  ) {}

  @Get()
  @ApiOkResponse({ type: [ExperienceDto] })
  async getExperiences(): Promise<ExperienceDto[]> {
    console.log(this.kafkaService);
    return firstValueFrom(
      this.kafkaService.send<ExperienceDto[]>(
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
      this.kafkaService.send<DeepExperienceDto>(
        ExperiencePatterns.GET_EXPERIENCE,
        id,
      ),
    );
  }
}
