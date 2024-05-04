import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { MerchantPattern } from '@ticketpond-backend-nx/message-patterns';
import {
  CreateMerchantDto,
  MerchantDto,
  MerchantServiceInterface,
  ServiceResponse,
  UpdateMerchantDto,
} from '@ticketpond-backend-nx/types';
import { CreateServiceResponse } from '@ticketpond-backend-nx/utils';

@Controller()
export class MerchantController {
  constructor(private readonly merchantService: MerchantServiceInterface) {}

  @MessagePattern(MerchantPattern.LIST_MERCHANTS)
  async listMerchants(): Promise<ServiceResponse<MerchantDto[]>> {
    const merchants = await this.merchantService.getMerchants();
    return CreateServiceResponse.success(merchants);
  }

  @MessagePattern(MerchantPattern.GET_MERCHANT)
  async getMerchant(
    @Payload() id: string,
  ): Promise<ServiceResponse<MerchantDto>> {
    const merchant = await this.merchantService.getMerchantById(id);
    if (!merchant) {
      return CreateServiceResponse.error('Merchant not found', 404);
    }
    return CreateServiceResponse.success(merchant);
  }

  @MessagePattern(MerchantPattern.GET_MERCHANT_BY_USER_ID)
  async getMerchantByUserId(
    @Payload() userId: string,
  ): Promise<ServiceResponse<MerchantDto>> {
    const merchant =
      await this.merchantService.getMerchantByCustomerAuthId(userId);
    if (!merchant) {
      return CreateServiceResponse.error('Merchant not found', 404);
    }
    return CreateServiceResponse.success(merchant);
  }

  @MessagePattern(MerchantPattern.CREATE_MERCHANT)
  async createMerchant(
    @Payload() merchant: CreateMerchantDto,
  ): Promise<ServiceResponse<MerchantDto>> {
    const createdMerchant = await this.merchantService.createMerchant(merchant);
    return CreateServiceResponse.success(createdMerchant);
  }

  @EventPattern(MerchantPattern.ASSIGN_CUSTOMER_TO_MERCHANT)
  async assignCustomerToMerchant(
    @Payload() data: { merchantId: string; customerAuthId: string },
  ): Promise<void> {
    await this.merchantService.assignCustomerToMerchant(
      data.merchantId,
      data.customerAuthId,
    );
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
    @Payload() data: { userId: string; merchant: UpdateMerchantDto },
  ): Promise<ServiceResponse<MerchantDto>> {
    const updatedMerchant =
      await this.merchantService.updateMerchantByCustomerAuthId(
        data.userId,
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
