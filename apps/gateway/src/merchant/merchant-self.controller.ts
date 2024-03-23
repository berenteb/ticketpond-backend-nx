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
import { ApiOkResponse } from '@nestjs/swagger';
import { PermissionGuard } from '@ticketpond-backend-nx/authz';
import {
  MerchantDto,
  PermissionLevel,
  type ReqWithUser,
  UpdateMerchantDto,
} from '@ticketpond-backend-nx/types';
import { firstValueFrom } from 'rxjs';

import { MerchantPattern } from '../../../../libs/message-patterns/src/lib/merchant.patterns';
import { ServiceNames } from '../utils/service-names';

@UseGuards(PermissionGuard(PermissionLevel.MERCHANT))
@UseGuards(AuthGuard('jwt'))
@Controller('merchant-admin/me')
export class MerchantSelfController {
  constructor(
    @Inject(ServiceNames.MERCHANT_SERVICE)
    private readonly merchantService: ClientProxy,
  ) {}

  @Get()
  @ApiOkResponse({ type: MerchantDto })
  async getMerchantMe(@Req() req: ReqWithUser): Promise<MerchantDto> {
    return firstValueFrom(
      this.merchantService.send<MerchantDto>(
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
    return firstValueFrom(
      this.merchantService.send<MerchantDto>(
        MerchantPattern.UPDATE_MERCHANT_BY_USER_ID,
        {
          merchant: updateMerchantDto,
          userId: req.user.sub,
        },
      ),
    );
  }
}
