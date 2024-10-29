import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard, PermissionGuard } from '@ticketpond-backend-nx/auth';
import {
  DeepOrderWithCustomerDto,
  OrderServiceInterface,
  OrderWithCustomerDto,
  PermissionLevel,
  type ReqWithUser,
} from '@ticketpond-backend-nx/types';

@UseGuards(PermissionGuard(PermissionLevel.MERCHANT))
@UseGuards(JwtGuard)
@ApiTags('Order-Merchant')
@Controller('merchant')
@ApiCookieAuth('jwt')
export class OrderMerchantController {
  constructor(private readonly orderService: OrderServiceInterface) {}

  @Get()
  @ApiOkResponse({ type: [OrderWithCustomerDto] })
  async getOrders(@Req() req: ReqWithUser): Promise<OrderWithCustomerDto[]> {
    if (!req.user.merchantId) throw new NotFoundException('Merchant not found');
    return this.orderService.getOrdersForMerchant(req.user.merchantId);
  }

  @Get(':id')
  @ApiOkResponse({ type: DeepOrderWithCustomerDto })
  @ApiNotFoundResponse()
  async getOrder(
    @Param('id') id: string,
    @Req() req: ReqWithUser,
  ): Promise<DeepOrderWithCustomerDto> {
    const order = await this.orderService.getOrderByIdWithCustomer(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }
}
