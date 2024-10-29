import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard, PermissionGuard } from '@ticketpond-backend-nx/auth';
import {
  CustomerDto,
  CustomerServiceInterface,
  PermissionLevel,
  UpdateCustomerDto,
} from '@ticketpond-backend-nx/types';

@UseGuards(PermissionGuard(PermissionLevel.ADMIN))
@UseGuards(JwtGuard)
@ApiTags('Customer-Admin')
@Controller('admin')
@ApiCookieAuth('jwt')
export class CustomerAdminController {
  constructor(private readonly customerService: CustomerServiceInterface) {}

  @Get()
  @ApiOkResponse({ type: [CustomerDto] })
  async listCustomers(): Promise<CustomerDto[]> {
    return await this.customerService.getCustomers();
  }

  @Get(':id')
  @ApiOkResponse({ type: CustomerDto })
  async getCustomerById(@Param('id') customerId: string): Promise<CustomerDto> {
    const customer = await this.customerService.getCustomerById(customerId);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }

  @Patch(':id')
  @ApiOkResponse({ type: CustomerDto })
  async updateCustomer(
    @Param('id') id: string,
    @Body() customer: UpdateCustomerDto,
  ): Promise<CustomerDto> {
    const updatedCustomer = await this.customerService.updateCustomer(
      id,
      customer,
    );
    if (!updatedCustomer) {
      throw new NotFoundException('Customer not found');
    }
    return updatedCustomer;
  }

  @Delete(':id')
  @ApiOkResponse()
  async deleteCustomer(@Param('id') id: string): Promise<void> {
    await this.customerService.deleteCustomer(id);
  }
}
