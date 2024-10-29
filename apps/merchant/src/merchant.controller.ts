import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@ticketpond-backend-nx/auth';
import { MerchantPattern } from '@ticketpond-backend-nx/message-patterns';
import {
  CreateMerchantDto,
  MerchantDto,
  MerchantServiceInterface,
  type ReqWithUser,
  ServiceResponse,
  UpdateMerchantDto,
} from '@ticketpond-backend-nx/types';
import { CreateServiceResponse } from '@ticketpond-backend-nx/utils';

@ApiTags('Merchant')
@Controller()
export class MerchantController {
  constructor(private readonly merchantService: MerchantServiceInterface) {}

  @Get(':id')
  @ApiOkResponse({ type: MerchantDto })
  async getMerchant(@Param('id') id: string): Promise<MerchantDto> {
    const merchant = await this.merchantService.getMerchantById(id);
    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }
    return merchant;
  }

  @UseGuards(JwtGuard)
  @Post('register')
  @ApiOkResponse({ type: MerchantDto })
  async registerMerchant(
    @Body() merchant: CreateMerchantDto,
    @Req() req: ReqWithUser,
  ): Promise<MerchantDto> {
    const userId = req.user.sub;
    if (!userId) throw new UnauthorizedException();
    const createdMerchant = await this.merchantService.createMerchant(merchant);
    await this.merchantService.assignCustomerToMerchant(
      createdMerchant.id,
      userId,
    );
    return createdMerchant;
  }

  @MessagePattern(MerchantPattern.LIST_MERCHANTS)
  async listMerchants(): Promise<ServiceResponse<MerchantDto[]>> {
    const merchants = await this.merchantService.getMerchants();
    return CreateServiceResponse.success(merchants);
  }

  @MessagePattern(MerchantPattern.GET_MERCHANT_BY_USER_ID)
  async getMerchantByCustomerId(
    @Payload() customerId: string,
  ): Promise<ServiceResponse<MerchantDto>> {
    const merchant =
      await this.merchantService.getMerchantByCustomerId(customerId);
    if (!merchant) {
      return CreateServiceResponse.error('Merchant not found', 404);
    }
    return CreateServiceResponse.success(merchant);
  }

  @MessagePattern(MerchantPattern.UPDATE_MERCHANT)
  async updateMerchant(
    @Payload() data: { id: string; merchant: UpdateMerchantDto },
  ): Promise<ServiceResponse<MerchantDto>> {
    const updatedMerchant = await this.merchantService.updateMerchant(
      data.id,
      data.merchant,
    );
    if (!updatedMerchant) {
      return CreateServiceResponse.error('Merchant not found', 404);
    }
    return CreateServiceResponse.success(updatedMerchant);
  }

  @MessagePattern(MerchantPattern.UPDATE_MERCHANT_BY_USER_ID)
  async updateMerchantByUserId(
    @Payload() data: { customerId: string; merchant: UpdateMerchantDto },
  ): Promise<ServiceResponse<MerchantDto>> {
    const updatedMerchant =
      await this.merchantService.updateMerchantByCustomerId(
        data.customerId,
        data.merchant,
      );
    if (!updatedMerchant) {
      return CreateServiceResponse.error('Merchant not found', 404);
    }
    return CreateServiceResponse.success(updatedMerchant);
  }

  @EventPattern(MerchantPattern.DELETE_MERCHANT)
  async deleteMerchant(@Payload() id: string): Promise<void> {
    await this.merchantService.deleteMerchant(id);
  }
}
