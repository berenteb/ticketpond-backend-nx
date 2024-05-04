import {
  Body,
  Controller,
  Get,
  Inject,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PermissionGuard } from '@ticketpond-backend-nx/authz';
import { MerchantPattern } from '@ticketpond-backend-nx/message-patterns';
import {
  MerchantDto,
  PermissionLevel,
  type ReqWithUser,
  ServiceResponse,
  UpdateMerchantDto,
} from '@ticketpond-backend-nx/types';
import { ServiceNames } from '@ticketpond-backend-nx/types';
import { responseFrom } from '@ticketpond-backend-nx/utils';

@ApiTags('merchant-self')
@UseGuards(PermissionGuard(PermissionLevel.MERCHANT))
@UseGuards(AuthGuard('jwt'))
@Controller('merchant-admin/me')
export class MerchantSelfController {
  constructor(
    @Inject(ServiceNames.KAFKA_SERVICE)
    private readonly kafkaService: ClientProxy,
  ) {}

  @Get()
  @ApiOkResponse({ type: MerchantDto })
  async getMerchantMe(@Req() req: ReqWithUser): Promise<MerchantDto> {
    return responseFrom(
      this.kafkaService.send<ServiceResponse<MerchantDto>>(
        MerchantPattern.GET_MERCHANT_BY_USER_ID,
        req.user.sub,
      ),
    );
  }

  @Patch()
  @ApiOkResponse({ type: MerchantDto })
  async updateMerchantMe(
    @Body() updateMerchantDto: UpdateMerchantDto,
    @Req() req: ReqWithUser,
  ): Promise<MerchantDto> {
    return responseFrom(
      this.kafkaService.send<ServiceResponse<MerchantDto>>(
        MerchantPattern.UPDATE_MERCHANT_BY_USER_ID,
        {
          merchant: updateMerchantDto,
          userId: req.user.sub,
        },
      ),
    );
  }
}
