import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MerchantPattern } from '@ticketpond-backend-nx/message-patterns';
import {
  MerchantDto,
  MerchantServiceInterface,
  ServiceResponse,
} from '@ticketpond-backend-nx/types';
import { CreateServiceResponse } from '@ticketpond-backend-nx/utils';

@Controller()
export class MerchantInnerController {
  constructor(private readonly merchantService: MerchantServiceInterface) {}

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
}
