import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CustomerMessagePattern } from '@ticketpond-backend-nx/message-patterns';
import type { ReqWithUser } from '@ticketpond-backend-nx/types';
import {
  CreateCustomerDto,
  CustomerDto,
  ServiceNames,
  ServiceResponse,
} from '@ticketpond-backend-nx/types';
import { firstValueFrom } from 'rxjs';

@ApiTags('customer')
@UseGuards(AuthGuard('jwt'))
@Controller('customer')
export class CustomerController {
  constructor(
    @Inject(ServiceNames.KAFKA_SERVICE)
    private readonly kafkaService: ClientKafka,
  ) {}

  @Get('me')
  @ApiOkResponse({ type: CustomerDto })
  async getMe(@Req() req: ReqWithUser): Promise<CustomerDto> {
    const response = await firstValueFrom(
      this.kafkaService.send<ServiceResponse<CustomerDto>>(
        CustomerMessagePattern.GET_CUSTOMER_BY_AUTH_ID,
        req.user.sub,
      ),
    );
    if (!response.success) throw new NotFoundException();
    return response.data;
  }

  @Get('permissions')
  @ApiOkResponse({ type: [String] })
  async getPermissions(@Req() req: ReqWithUser): Promise<string[]> {
    return req.user.permissions;
  }

  @Post('register')
  @ApiOkResponse({ type: CustomerDto })
  async registerCustomer(
    @Body() customer: CreateCustomerDto,
    @Req() req: ReqWithUser,
  ): Promise<CustomerDto> {
    const authId = req.user.sub;
    if (!authId) throw new UnauthorizedException();
    return firstValueFrom(
      this.kafkaService.send<CustomerDto>(
        CustomerMessagePattern.CREATE_CUSTOMER,
        { customer, authId },
      ),
    );
  }
}
