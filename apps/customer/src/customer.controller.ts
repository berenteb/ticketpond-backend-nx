import {
  Controller,
  Get,
  NotFoundException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@ticketpond-backend-nx/auth';
import {
  CustomerDto,
  CustomerServiceInterface,
  type ReqWithUser,
} from '@ticketpond-backend-nx/types';

@UseGuards(JwtGuard)
@Controller()
@ApiTags('Customer')
@ApiCookieAuth('jwt')
export class CustomerController {
  constructor(private readonly customerService: CustomerServiceInterface) {}

  @Get('me')
  @ApiOkResponse({ type: CustomerDto })
  async getMe(@Req() req: ReqWithUser): Promise<CustomerDto> {
    const customer = await this.customerService.getCustomerById(req.user.sub);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }

  @Get('permissions')
  @ApiOkResponse({ type: [String] })
  async getPermissions(@Req() req: ReqWithUser): Promise<string[]> {
    return req.user.permissions;
  }
}
