import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ExperiencePatterns } from '@ticketpond-backend-nx/message-patterns';
import {
  DeepExperienceDto,
  ExperienceDto,
  ServiceNames,
  ServiceResponse,
} from '@ticketpond-backend-nx/types';
import { responseFrom } from '@ticketpond-backend-nx/utils';

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
    return responseFrom(
      this.kafkaService.send<ServiceResponse<ExperienceDto[]>>(
        ExperiencePatterns.LIST_EXPERIENCES,
        {},
      ),
    );
  }

  @Get(':id')
  @ApiOkResponse({ type: DeepExperienceDto })
  @ApiNotFoundResponse()
  async getExperienceById(@Param('id') id: string): Promise<DeepExperienceDto> {
    return responseFrom(
      this.kafkaService.send<ServiceResponse<DeepExperienceDto>>(
        ExperiencePatterns.GET_EXPERIENCE,
        id,
      ),
    );
  }
}
