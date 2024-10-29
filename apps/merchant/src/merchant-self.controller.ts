import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard, PermissionGuard } from '@ticketpond-backend-nx/auth';
import {
  MerchantDto,
  MerchantServiceInterface,
  PermissionLevel,
  type ReqWithUser,
  UpdateMerchantDto,
} from '@ticketpond-backend-nx/types';

@UseGuards(PermissionGuard(PermissionLevel.MERCHANT))
@UseGuards(JwtGuard)
@ApiTags('Merchant-Self')
@Controller('me')
@ApiCookieAuth('jwt')
export class MerchantSelfController {
  constructor(private readonly merchantService: MerchantServiceInterface) {}

  @Get()
  async getMerchantByCustomerId(@Req() req: ReqWithUser): Promise<MerchantDto> {
    if (!req.user.merchantId) throw new NotFoundException('Merchant not found');
    const merchant = await this.merchantService.getMerchantById(
      req.user.merchantId,
    );
    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }
    return merchant;
  }

  @Patch()
  @ApiOkResponse({ type: MerchantDto })
  async updateMerchantById(
    @Body() updateMerchantDto: UpdateMerchantDto,
    @Req() req: ReqWithUser,
  ): Promise<MerchantDto> {
    const updatedMerchant = await this.merchantService.updateMerchant(
      req.user.merchantId,
      updateMerchantDto,
    );
    if (!updatedMerchant) {
      throw new NotFoundException('Merchant not found');
    }
    return updatedMerchant;
  }
}
