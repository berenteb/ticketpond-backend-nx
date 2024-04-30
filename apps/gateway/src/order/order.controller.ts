import { Controller, Get, Inject, Param, Req, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { OrderPatterns } from '@ticketpond-backend-nx/message-patterns';
import {
  DeepOrderDto,
  OrderDto,
  type ReqWithUser,
  ServiceNames,
} from '@ticketpond-backend-nx/types';
import { firstValueFrom } from 'rxjs';

@ApiTags('order')
@UseGuards(AuthGuard('jwt'))
@Controller('order')
export class OrderController {
  constructor(
    @Inject(ServiceNames.ORDER_SERVICE)
    private readonly orderService: ClientProxy,
  ) {}

  @Get('me')
  @ApiOkResponse({ type: [OrderDto] })
  async getOrdersByUser(@Req() req: ReqWithUser): Promise<OrderDto[]> {
    return firstValueFrom(
      this.orderService.send<OrderDto[]>(
        OrderPatterns.LIST_ORDERS_FOR_CUSTOMER,
        req.user.sub,
      ),
    );
  }

  @Get(':id')
  @ApiOkResponse({ type: DeepOrderDto })
  @ApiNotFoundResponse()
  async getOrder(
    @Param('id') id: string,
    @Req() req: ReqWithUser,
  ): Promise<DeepOrderDto> {
    return firstValueFrom(
      this.orderService.send<DeepOrderDto>(
        OrderPatterns.GET_ORDER_FOR_CUSTOMER,
        {
          id,
          customerAuthId: req.user.sub,
        },
      ),
    );
  }
}
