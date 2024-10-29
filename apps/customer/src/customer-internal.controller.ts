import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CustomerMessagePattern } from '@ticketpond-backend-nx/message-patterns';
import {
  CreateCustomerDto,
  CustomerDto,
  CustomerServiceInterface,
  ServiceResponse,
} from '@ticketpond-backend-nx/types';
import { CreateServiceResponse } from '@ticketpond-backend-nx/utils';

@Controller()
export class CustomerInternalController {
  constructor(private readonly customerService: CustomerServiceInterface) {}

  @MessagePattern(CustomerMessagePattern.GET_CUSTOMER_BY_AUTH_ID)
  async getCustomerByAuthId(
    @Payload() authId: string,
  ): Promise<ServiceResponse<CustomerDto>> {
    const customer = await this.customerService.getCustomerByAuthId(authId);
    if (!customer) {
      return CreateServiceResponse.error('Customer not found', 404);
    }

    return CreateServiceResponse.success(customer);
  }

  @MessagePattern(CustomerMessagePattern.CREATE_CUSTOMER)
  async createCustomer(
    @Payload()
    { customer, authId }: { customer: CreateCustomerDto; authId?: string },
  ): Promise<ServiceResponse<CustomerDto>> {
    const created = await this.customerService.createCustomer(customer, authId);
    return CreateServiceResponse.success(created);
  }
}
