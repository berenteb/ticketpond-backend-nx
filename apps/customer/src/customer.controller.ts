import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { CustomerMessagePattern } from '@ticketpond-backend-nx/message-patterns';
import {
  CreateCustomerDto,
  CustomerDto,
  CustomerServiceInterface,
  UpdateCustomerDto,
} from '@ticketpond-backend-nx/types';
import { ServiceResponse } from '@ticketpond-backend-nx/types';
import { CreateServiceResponse } from '@ticketpond-backend-nx/utils';

@Controller()
export class CustomerController {
  constructor(private readonly customerService: CustomerServiceInterface) {}

  @MessagePattern(CustomerMessagePattern.GET_CUSTOMER)
  async getCustomer(
    @Payload() customerId: string,
  ): Promise<ServiceResponse<CustomerDto>> {
    const customer = await this.customerService.getCustomerById(customerId);
    if (!customer) {
      return CreateServiceResponse.error('Customer not found', 404);
    }
    return CreateServiceResponse.success(customer);
  }

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

  @MessagePattern(CustomerMessagePattern.LIST_CUSTOMERS)
  async listCustomers(): Promise<ServiceResponse<CustomerDto[]>> {
    const customers = await this.customerService.getCustomers();
    return CreateServiceResponse.success(customers);
  }

  @MessagePattern(CustomerMessagePattern.UPDATE_CUSTOMER)
  async updateCustomer(
    @Payload()
    {
      customerId,
      customer,
    }: {
      customerId: string;
      customer: UpdateCustomerDto;
    },
  ): Promise<ServiceResponse<CustomerDto>> {
    const updatedCustomer = await this.customerService.updateCustomer(
      customerId,
      customer,
    );
    if (!updatedCustomer) {
      return CreateServiceResponse.error('Customer not found', 404);
    }
    return CreateServiceResponse.success(updatedCustomer);
  }

  @MessagePattern(CustomerMessagePattern.UPDATE_CUSTOMER_BY_USER_ID)
  async updateCustomerByAuthId(
    @Payload()
    {
      customerId,
      customer,
    }: {
      customerId: string;
      customer: UpdateCustomerDto;
    },
  ): Promise<ServiceResponse<CustomerDto>> {
    const updatedCustomer = await this.customerService.updateCustomerById(
      customerId,
      customer,
    );
    if (!updatedCustomer) {
      return CreateServiceResponse.error('Customer not found', 404);
    }
    return CreateServiceResponse.success(updatedCustomer);
  }

  @EventPattern(CustomerMessagePattern.DELETE_CUSTOMER)
  async deleteCustomer(@Payload() customerId: string): Promise<void> {
    await this.customerService.deleteCustomer(customerId);
  }
}
