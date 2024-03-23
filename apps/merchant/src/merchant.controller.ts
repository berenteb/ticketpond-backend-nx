import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
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
  async getMerchant(id: string): Promise<MerchantDto> {
    return this.merchantService.getMerchantById(id);
  }

  @MessagePattern(MerchantPattern.GET_MERCHANT_BY_USER_ID)
  async getMerchantByUserId(userId: string): Promise<MerchantDto> {
    return this.merchantService.getMerchantByUserId(userId);
  }

  @MessagePattern(MerchantPattern.CREATE_MERCHANT)
  async createMerchant(merchant: CreateMerchantDto): Promise<MerchantDto> {
    return this.merchantService.createMerchant(merchant);
  }

  @MessagePattern(MerchantPattern.ASSIGN_CUSTOMER_TO_MERCHANT)
  async assignCustomerToMerchant(data: {
    merchantId: string;
    customerId: string;
  }): Promise<void> {
    return this.merchantService.assignCustomerToMerchant(
      data.merchantId,
      data.customerId,
    );
  }

  @MessagePattern(MerchantPattern.UPDATE_MERCHANT)
  async updateMerchant(data: {
    id: string;
    merchant: UpdateMerchantDto;
  }): Promise<MerchantDto> {
    return this.merchantService.updateMerchant(data.id, data.merchant);
  }

  @MessagePattern(MerchantPattern.UPDATE_MERCHANT_BY_USER_ID)
  async updateMerchantByUserId(data: {
    userId: string;
    merchant: UpdateMerchantDto;
  }): Promise<MerchantDto> {
    return this.merchantService.updateMerchantByUserId(
      data.userId,
      data.merchant,
    );
  }

  @MessagePattern(MerchantPattern.DELETE_MERCHANT)
  async deleteMerchant(id: string): Promise<void> {
    return this.merchantService.deleteMerchant(id);
  }
}
