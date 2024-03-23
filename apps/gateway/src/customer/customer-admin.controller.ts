import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PermissionGuard } from '@ticketpond-backend-nx/authz';
import { CustomerMessagePattern } from '@ticketpond-backend-nx/message-patterns';
import {
  CreateCustomerDto,
  CustomerDto,
  PermissionLevel,
  UpdateCustomerDto,
} from '@ticketpond-backend-nx/types';
import { ServiceNames } from '@ticketpond-backend-nx/types';
import { firstValueFrom } from 'rxjs';

@UseGuards(PermissionGuard(PermissionLevel.ADMIN))
@UseGuards(AuthGuard('jwt'))
@ApiTags('customer-admin')
@Controller('customer')
export class CustomerAdminController {
  constructor(
    @Inject(ServiceNames.CUSTOMER_SERVICE)
    private readonly customerService: ClientProxy,
  ) {}

  @Get()
  @ApiOkResponse({ type: [CustomerDto] })
  async getCustomers(): Promise<CustomerDto[]> {
    return firstValueFrom(
      this.customerService.send<CustomerDto[]>(
        CustomerMessagePattern.LIST_CUSTOMERS,
        {},
      ),
    );
  }

  @Get(':id')
  @ApiOkResponse({ type: CustomerDto })
  @ApiNotFoundResponse()
  async getCustomerById(@Param('id') id: string): Promise<CustomerDto> {
    return firstValueFrom(
      this.customerService.send<CustomerDto>(
        CustomerMessagePattern.GET_CUSTOMER,
        id,
      ),
    );
  }

  @Post()
  @ApiOkResponse({ type: CustomerDto })
  async createCustomer(
    @Body() customer: CreateCustomerDto,
  ): Promise<CustomerDto> {
    return firstValueFrom(
      this.customerService.send<CustomerDto>(
        CustomerMessagePattern.CREATE_CUSTOMER,
        { customer },
      ),
    );
  }

  @Patch(':id')
  @ApiOkResponse({ type: CustomerDto })
  async updateCustomer(
    @Param('id') id: string,
    @Body() customer: UpdateCustomerDto,
  ): Promise<CustomerDto> {
    return firstValueFrom(
      this.customerService.send<CustomerDto>(
        CustomerMessagePattern.UPDATE_CUSTOMER,
        { id, customer },
      ),
    );
  }

  @Delete(':id')
  @ApiOkResponse()
  async deleteCustomer(@Param('id') id: string): Promise<void> {
    return firstValueFrom(
      this.customerService.send<void>(
        CustomerMessagePattern.DELETE_CUSTOMER,
        id,
      ),
    );
  }
}
