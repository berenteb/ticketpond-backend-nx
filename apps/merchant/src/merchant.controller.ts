import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { MerchantPattern } from '@ticketpond-backend-nx/message-patterns';
import {
  CreateMerchantDto,
  MerchantDto,
  MerchantServiceInterface,
  UpdateMerchantDto,
} from '@ticketpond-backend-nx/types';

@Controller()
export class MerchantController {
  constructor(private readonly merchantService: MerchantServiceInterface) {}

  @MessagePattern(MerchantPattern.LIST_MERCHANTS)
  async listMerchants(): Promise<MerchantDto[]> {
    return this.merchantService.getMerchants();
  }

  @MessagePattern(MerchantPattern.GET_MERCHANT)
  async getMerchant(@Payload() id: string): Promise<MerchantDto> {
    return this.merchantService.getMerchantById(id);
  }

  @MessagePattern(MerchantPattern.GET_MERCHANT_BY_USER_ID)
  async getMerchantByUserId(@Payload() userId: string): Promise<MerchantDto> {
    return this.merchantService.getMerchantByCustomerAuthId(userId);
  }

  @MessagePattern(MerchantPattern.CREATE_MERCHANT)
  async createMerchant(
    @Payload() merchant: CreateMerchantDto,
  ): Promise<MerchantDto> {
    return this.merchantService.createMerchant(merchant);
  }

  @EventPattern(MerchantPattern.ASSIGN_CUSTOMER_TO_MERCHANT)
  async assignCustomerToMerchant(
    @Payload() data: { merchantId: string; customerAuthId: string },
  ): Promise<void> {
    return this.merchantService.assignCustomerToMerchant(
      data.merchantId,
      data.customerAuthId,
    );
  }

  @MessagePattern(MerchantPattern.UPDATE_MERCHANT)
  async updateMerchant(
    @Payload() data: { id: string; merchant: UpdateMerchantDto },
  ): Promise<MerchantDto> {
    return this.merchantService.updateMerchant(data.id, data.merchant);
  }

  @MessagePattern(MerchantPattern.UPDATE_MERCHANT_BY_USER_ID)
  async updateMerchantByUserId(
    @Payload() data: { userId: string; merchant: UpdateMerchantDto },
  ): Promise<MerchantDto> {
    return this.merchantService.updateMerchantByCustomerAuthId(
      data.userId,
      data.merchant,
    );
  }

  @MessagePattern(MerchantPattern.DELETE_MERCHANT)
  async deleteMerchant(@Payload() id: string): Promise<void> {
    return this.merchantService.deleteMerchant(id);
  }
}
