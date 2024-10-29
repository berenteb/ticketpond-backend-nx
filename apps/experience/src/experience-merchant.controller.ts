import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard, PermissionGuard } from '@ticketpond-backend-nx/auth';
import {
  CreateExperienceDto,
  DeepExperienceDto,
  ExperienceDto,
  ExperienceServiceInterface,
  PermissionLevel,
  type ReqWithUser,
  UpdateExperienceDto,
  ValidationRequestDto,
  ValidationResponseDto,
} from '@ticketpond-backend-nx/types';

@UseGuards(PermissionGuard(PermissionLevel.MERCHANT))
@UseGuards(JwtGuard)
@ApiTags('Experience-Merchant')
@Controller('merchant')
@ApiCookieAuth('jwt')
export class ExperienceMerchantController {
  constructor(private readonly experienceService: ExperienceServiceInterface) {}

  @Get()
  @ApiOkResponse({ type: [ExperienceDto] })
  async getExperiences(@Req() req: ReqWithUser): Promise<ExperienceDto[]> {
    if (!req.user.merchantId) throw new NotFoundException('Merchant not found');
    return this.experienceService.getExperiencesByMerchantId(
      req.user.merchantId,
    );
  }

  @Get(':id')
  @ApiOkResponse({ type: DeepExperienceDto })
  async getExperienceById(@Param('id') id: string): Promise<DeepExperienceDto> {
    const experience = await this.experienceService.getExperienceById(id);
    if (!experience) {
      throw new NotFoundException('Experience not found');
    }
    return experience;
  }

  @Post()
  @ApiOkResponse({ type: ExperienceDto })
  async createExperience(
    @Body() experience: CreateExperienceDto,
    @Req() req: ReqWithUser,
  ): Promise<ExperienceDto> {
    if (!req.user.merchantId) {
      throw new NotFoundException('Merchant not found');
    }
    return this.experienceService.createExperience(
      experience,
      req.user.merchantId,
    );
  }

  @Patch(':id')
  @ApiOkResponse({ type: ExperienceDto })
  async updateExperience(
    @Param('id') id: string,
    @Body() experience: UpdateExperienceDto,
    @Req() req: ReqWithUser,
  ): Promise<ExperienceDto> {
    if (!req.user.merchantId) throw new NotFoundException('Merchant not found');
    const updatedExperience =
      await this.experienceService.updateExperienceForMerchant(
        id,
        experience,
        req.user.merchantId,
      );
    if (!updatedExperience) {
      throw new NotFoundException('Experience not found');
    }
    return updatedExperience;
  }

  @Post(':id/validate')
  @ApiOkResponse({ type: ValidationResponseDto })
  async validateExperiencePass(
    @Param('id') experienceId: string,
    @Body() validationRequest: ValidationRequestDto,
    @Req() req: ReqWithUser,
  ): Promise<ValidationResponseDto> {
    if (!req.user.merchantId) throw new NotFoundException('Merchant not found');
    return this.experienceService.validateExperiencePass(
      validationRequest.ticketSerialNumber,
      experienceId,
      req.user.merchantId,
    );
  }

  @Delete(':id')
  @ApiOkResponse()
  async deleteExperience(
    @Param('id') id: string,
    @Req() req: ReqWithUser,
  ): Promise<void> {
    if (!req.user.merchantId) throw new NotFoundException('Merchant not found');
    return this.experienceService.deleteExperienceForMerchant(
      id,
      req.user.merchantId,
    );
  }
}
