import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PermissionGuard } from '@ticketpond-backend-nx/authz';
import { ExperiencePatterns } from '@ticketpond-backend-nx/message-patterns';
import {
  DeepExperienceDto,
  ExperienceDto,
  PermissionLevel,
  ServiceNames,
  UpdateExperienceDto,
} from '@ticketpond-backend-nx/types';
import { firstValueFrom } from 'rxjs';

@ApiTags('experience-admin')
@UseGuards(PermissionGuard(PermissionLevel.ADMIN))
@UseGuards(AuthGuard('jwt'))
@Controller('admin/experience')
export class ExperienceAdminController {
  constructor(
    @Inject(ServiceNames.KAFKA_SERVICE)
    private readonly kafkaService: ClientKafka,
  ) {}

  @Get()
  @ApiOkResponse({ type: [ExperienceDto] })
  async getExperiences(): Promise<ExperienceDto[]> {
    return firstValueFrom(
      this.kafkaService.send<ExperienceDto[]>(
        ExperiencePatterns.LIST_EXPERIENCES,
        {},
      ),
    );
  }

  @Get(':id')
  @ApiOkResponse({ type: ExperienceDto })
  async getExperienceById(@Param('id') id: string): Promise<DeepExperienceDto> {
    return firstValueFrom(
      this.kafkaService.send<DeepExperienceDto>(
        ExperiencePatterns.GET_EXPERIENCE,
        id,
      ),
    );
  }

  @Patch(':id')
  @ApiOkResponse({ type: ExperienceDto })
  async updateExperience(
    @Param('id') id: string,
    @Body() experience: UpdateExperienceDto,
  ): Promise<ExperienceDto> {
    return firstValueFrom(
      this.kafkaService.send(ExperiencePatterns.UPDATE_EXPERIENCE, {
        id,
        experience,
      }),
    );
  }

  @Delete(':id')
  @ApiOkResponse()
  async deleteExperience(@Param('id') id: string): Promise<void> {
    return firstValueFrom(
      this.kafkaService.send(ExperiencePatterns.DELETE_EXPERIENCE, id),
    );
  }
}
