import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Customer } from '@prisma/client';
import { PrismaService } from '@ticketpond-backend-nx/prisma';
import {
  CreateCustomerDto,
  CustomerDto,
  CustomerServiceInterface,
  UpdateCustomerDto,
} from '@ticketpond-backend-nx/types';

@Injectable()
export class CustomerService extends CustomerServiceInterface {
  private readonly logger = new Logger(CustomerService.name);
  constructor(
    private readonly prismaService: PrismaService,
    // private readonly notificationService: NotificationServiceInterface,
  ) {
    super();
  }

  async createCustomer(
    customer: CreateCustomerDto,
    authId?: string,
  ): Promise<Customer> {
    const created = await this.prismaService.customer.create({
      data: { ...customer, authId },
    });
    this.logger.debug(`Created customer with id ${created.id}`);
    // this.notificationService.sendWelcome(created);
    return created;
  }

  async deleteCustomer(id: string): Promise<void> {
    await this.prismaService.customer.delete({ where: { id } });
    this.logger.debug(`Deleted customer with id ${id}`);
  }

  async getCustomerById(id: string): Promise<Customer | null> {
    const customer = await this.prismaService.customer.findUnique({
      where: { id },
    });
    if (!customer) {
      return null;
    }
    this.logger.debug(`Found customer with id ${id}`);
    return customer;
  }

  async getCustomerByAuthId(authId: string): Promise<CustomerDto> {
    const customer = await this.prismaService.customer.findUnique({
      where: { authId },
    });
    if (!customer) {
      return null;
    }
    this.logger.debug(`Found customer with authId ${authId}`);
    return customer;
  }

  async getCustomers(): Promise<Customer[]> {
    const customers = await this.prismaService.customer.findMany();
    this.logger.debug(`Found ${customers.length} customers`);
    return customers;
  }

  async updateCustomer(
    id: string,
    customer: UpdateCustomerDto,
  ): Promise<Customer> {
    const updatedCustomer = await this.prismaService.customer.update({
      where: { id },
      data: customer,
    });
    this.logger.debug(`Updated customer with id ${id}`);
    return updatedCustomer;
  }

  async updateCustomerByAuthId(
    authId: string,
    customer: UpdateCustomerDto,
  ): Promise<CustomerDto> {
    const updatedCustomer = await this.prismaService.customer.update({
      where: { authId },
      data: customer,
    });
    this.logger.debug(`Updated customer with authId ${authId}`);
    return updatedCustomer;
  }
}
