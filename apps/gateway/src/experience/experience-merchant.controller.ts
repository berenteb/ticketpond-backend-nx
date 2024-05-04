import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PermissionGuard } from '@ticketpond-backend-nx/authz';
import {
  ExperiencePatterns,
  MerchantPattern,
} from '@ticketpond-backend-nx/message-patterns';
import {
  CreateExperienceDto,
  DeepExperienceDto,
  ExperienceDto,
  MerchantDto,
  PermissionLevel,
  type ReqWithUser,
  ServiceNames,
  ServiceResponse,
  UpdateExperienceDto,
  ValidationRequestDto,
  ValidationResponseDto,
} from '@ticketpond-backend-nx/types';
import { responseFrom } from '@ticketpond-backend-nx/utils';

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
    return responseFrom(
      this.kafkaService.send<ServiceResponse<ExperienceDto[]>>(
        ExperiencePatterns.GET_EXPERIENCES_BY_MERCHANT_ID,
        merchant.id,
      ),
    );
  }

  @Get(':id')
  @ApiOkResponse({ type: DeepExperienceDto })
  async getExperienceById(@Param('id') id: string): Promise<DeepExperienceDto> {
    return responseFrom(
      this.kafkaService.send<ServiceResponse<DeepExperienceDto>>(
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
    return responseFrom(
      this.kafkaService.send<ServiceResponse<ExperienceDto>>(
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
    return responseFrom(
      this.kafkaService.send<ServiceResponse<ExperienceDto>>(
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
    return responseFrom(
      this.kafkaService.send<ServiceResponse<ValidationResponseDto>>(
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

    this.kafkaService.emit(
      ExperiencePatterns.DELETE_EXPERIENCE_BY_MERCHANT_ID,
      { id, merchantId: merchant.id },
    );
  }

  private async getMerchantByUserId(userId: string): Promise<MerchantDto> {
    return responseFrom(
      this.kafkaService.send<ServiceResponse<MerchantDto>>(
        MerchantPattern.GET_MERCHANT_BY_USER_ID,
        userId,
      ),
    );
  }
}
