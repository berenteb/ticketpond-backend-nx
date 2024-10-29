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
import { JwtGuard } from '@ticketpond-backend-nx/auth';
import {
  DeepOrderDto,
  OrderDto,
  OrderServiceInterface,
  type ReqWithUser,
} from '@ticketpond-backend-nx/types';

@UseGuards(JwtGuard)
@ApiTags('Order')
@Controller()
@ApiCookieAuth('jwt')
export class OrderController {
  constructor(private readonly orderService: OrderServiceInterface) {}

  @Get()
  @ApiOkResponse({ type: [OrderDto] })
  async getOrdersByUser(@Req() req: ReqWithUser): Promise<OrderDto[]> {
    return this.orderService.getOrdersForCustomer(req.user.sub);
  }

  @Get(':id')
  @ApiOkResponse({ type: DeepOrderDto })
  @ApiNotFoundResponse()
  async getOrder(
    @Param('id') id: string,
    @Req() req: ReqWithUser,
  ): Promise<DeepOrderDto> {
    const order = await this.orderService.getOrderByIdForCustomer(
      id,
      req.user.sub,
    );
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }
}
