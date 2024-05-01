import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  OnModuleInit,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientKafka, ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PermissionGuard } from '@ticketpond-backend-nx/authz';
import { ExperiencePatterns } from '@ticketpond-backend-nx/message-patterns';
import { MerchantPattern } from '@ticketpond-backend-nx/message-patterns';
import {
  CreateExperienceDto,
  DeepExperienceDto,
  ExperienceDto,
  MerchantDto,
  PermissionLevel,
  type ReqWithUser,
  UpdateExperienceDto,
  ValidationRequestDto,
  ValidationResponseDto,
} from '@ticketpond-backend-nx/types';
import { ServiceNames } from '@ticketpond-backend-nx/types';
import { firstValueFrom } from 'rxjs';

@ApiTags('experience-merchant')
@UseGuards(PermissionGuard(PermissionLevel.MERCHANT))
@UseGuards(AuthGuard('jwt'))
@Controller('merchant-admin/experience')
export class ExperienceMerchantController {
  constructor(
    @Inject(ServiceNames.KAFKA_SERVICE)
    private readonly kafkaService: ClientKafka,
  ) {}

  @Get()
  @ApiOkResponse({ type: [ExperienceDto] })
  async getExperiences(@Req() req: ReqWithUser): Promise<ExperienceDto[]> {
    const merchant = await this.getMerchantByUserId(req.user.sub);
    if (!merchant) throw new NotFoundException();
    return firstValueFrom(
      this.kafkaService.send<ExperienceDto[]>(
        ExperiencePatterns.GET_EXPERIENCES_BY_MERCHANT_ID,
        merchant.id,
      ),
    );
  }

  @Get(':id')
  @ApiOkResponse({ type: DeepExperienceDto })
  async getExperienceById(@Param('id') id: string): Promise<DeepExperienceDto> {
    return firstValueFrom(
      this.kafkaService.send<DeepExperienceDto>(
        ExperiencePatterns.GET_EXPERIENCE,
        id,
      ),
    );
  }

  @Post()
  @ApiOkResponse({ type: ExperienceDto })
  async createExperience(
    @Body() experience: CreateExperienceDto,
    @Req() req: ReqWithUser,
  ): Promise<ExperienceDto> {
    const merchant = await this.getMerchantByUserId(req.user.sub);
    return firstValueFrom(
      this.kafkaService.send<ExperienceDto>(
        ExperiencePatterns.CREATE_EXPERIENCE,
        { experience, merchantId: merchant.id },
      ),
    );
  }

  @Patch(':id')
  @ApiOkResponse({ type: ExperienceDto })
  async updateExperience(
    @Param('id') id: string,
    @Body() experience: UpdateExperienceDto,
    @Req() req: ReqWithUser,
  ): Promise<ExperienceDto> {
    const merchant = await this.getMerchantByUserId(req.user.sub);
    return firstValueFrom(
      this.kafkaService.send<ExperienceDto>(
        ExperiencePatterns.UPDATE_EXPERIENCE_BY_MERCHANT_ID,
        { id, experience, merchantId: merchant.id },
      ),
    );
  }

  @Post(':id/validate')
  @ApiOkResponse({ type: ValidationResponseDto })
  async validateExperiencePass(
    @Param('id') experienceId: string,
    @Body() validationRequest: ValidationRequestDto,
    @Req() req: ReqWithUser,
  ): Promise<ValidationResponseDto> {
    const merchant = await this.getMerchantByUserId(req.user.sub);
    return firstValueFrom(
      this.kafkaService.send<ValidationResponseDto>(
        ExperiencePatterns.VALIDATE_EXPERIENCE_PASS,
        {
          experienceId,
          ticketSerialNumber: validationRequest.ticketSerialNumber,
          merchantId: merchant.id,
        },
      ),
    );
  }

  @Delete(':id')
  @ApiOkResponse()
  async deleteExperience(
    @Param('id') id: string,
    @Req() req: ReqWithUser,
  ): Promise<void> {
    const merchant = await this.getMerchantByUserId(req.user.sub);

    return firstValueFrom(
      this.kafkaService.send<void>(
        ExperiencePatterns.DELETE_EXPERIENCE_BY_MERCHANT_ID,
        { id, merchantId: merchant.id },
      ),
    );
  }

  private async getMerchantByUserId(userId: string): Promise<MerchantDto> {
    return firstValueFrom(
      this.kafkaService.send<MerchantDto>(
        MerchantPattern.GET_MERCHANT_BY_USER_ID,
        userId,
      ),
    );
  }
}
