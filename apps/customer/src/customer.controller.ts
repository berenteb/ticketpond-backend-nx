import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CustomerMessagePattern } from '@ticketpond-backend-nx/message-patterns';
import {
  CreateCustomerDto,
  UpdateCustomerDto,
} from '@ticketpond-backend-nx/types';

import { CustomerService } from './customer.service';

@Controller()
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @MessagePattern(CustomerMessagePattern.GET_CUSTOMER)
  async getCustomer(id: string) {
    return await this.customerService.getCustomerById(id);
  }

  @MessagePattern(CustomerMessagePattern.GET_CUSTOMER_BY_AUTH_ID)
  async getCustomerByAuthId(authId: string) {
    return await this.customerService.getCustomerByAuthId(authId);
  }

  @MessagePattern(CustomerMessagePattern.CREATE_CUSTOMER)
  async createCustomer({
    customer,
    authId,
  }: {
    customer: CreateCustomerDto;
    authId?: string;
  }) {
    return await this.customerService.createCustomer(customer, authId);
  }

  @MessagePattern(CustomerMessagePattern.LIST_CUSTOMERS)
  async listCustomers() {
    return await this.customerService.getCustomers();
  }

  @MessagePattern(CustomerMessagePattern.UPDATE_CUSTOMER)
  async updateCustomer({
    id,
    customer,
  }: {
    id: string;
    customer: UpdateCustomerDto;
  }) {
    return await this.customerService.updateCustomer(id, customer);
  }

  @MessagePattern(CustomerMessagePattern.UPDATE_CUSTOMER_BY_AUTH_ID)
  async updateCustomerByAuthId({
    authId,
    customer,
  }: {
    authId: string;
    customer: UpdateCustomerDto;
  }) {
    return await this.customerService.updateCustomerByAuthId(authId, customer);
  }

  @MessagePattern(CustomerMessagePattern.DELETE_CUSTOMER)
  async deleteCustomer(id: string) {
    return await this.customerService.deleteCustomer(id);
  }
}
