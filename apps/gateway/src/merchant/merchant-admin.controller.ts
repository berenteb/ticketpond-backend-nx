import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse } from '@nestjs/swagger';
import { PermissionGuard } from '@ticketpond-backend-nx/authz';
import {
  CreateMerchantDto,
  MerchantDto,
  PermissionLevel,
  UpdateMerchantDto,
} from '@ticketpond-backend-nx/types';
import { firstValueFrom } from 'rxjs';

import { MerchantPattern } from '../../../../libs/message-patterns/src/lib/merchant.patterns';
import { ServiceNames } from '../utils/service-names';

@UseGuards(PermissionGuard(PermissionLevel.ADMIN))
@UseGuards(AuthGuard('jwt'))
@Controller('admin/merchant')
export class MerchantAdminController {
  constructor(
    @Inject(ServiceNames.MERCHANT_SERVICE)
    private readonly merchantService: ClientProxy,
  ) {}
  @Get()
  @ApiOkResponse({ type: [MerchantDto] })
  async getMerchants(): Promise<MerchantDto[]> {
    return firstValueFrom(
      this.merchantService.send<MerchantDto[]>(
        MerchantPattern.LIST_MERCHANTS,
        {},
      ),
    );
  }

  @Get(':id')
  @ApiOkResponse({ type: MerchantDto })
  async getMerchant(@Param('id') id: string): Promise<MerchantDto> {
    return firstValueFrom(
      this.merchantService.send<MerchantDto>(MerchantPattern.GET_MERCHANT, id),
    );
  }

  @Post()
  @ApiOkResponse({ type: MerchantDto })
  async createMerchant(
    @Body() merchant: CreateMerchantDto,
  ): Promise<MerchantDto> {
    return firstValueFrom(
      this.merchantService.send<MerchantDto>(
        MerchantPattern.CREATE_MERCHANT,
        merchant,
      ),
    );
  }

  @Patch(':id')
  @ApiOkResponse({ type: MerchantDto })
  async updateMerchant(
    @Param('id') id: string,
    @Body() merchant: UpdateMerchantDto,
  ): Promise<MerchantDto> {
    return firstValueFrom(
      this.merchantService.send<MerchantDto>(MerchantPattern.UPDATE_MERCHANT, {
        id,
        merchant,
      }),
    );
  }

  @Delete(':id')
  @ApiOkResponse()
  async deleteMerchant(@Param('id') id: string): Promise<void> {
    return firstValueFrom(
      this.merchantService.send<void>(MerchantPattern.DELETE_MERCHANT, id),
    );
  }
}
