import { Controller, Get, Inject, Param, Req, UseGuards } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { OrderPatterns } from '@ticketpond-backend-nx/message-patterns';
import {
  DeepOrderDto,
  OrderDto,
  type ReqWithUser,
  ServiceNames,
  ServiceResponse,
} from '@ticketpond-backend-nx/types';
import { responseFrom } from '@ticketpond-backend-nx/utils';

@ApiTags('order')
@UseGuards(AuthGuard('jwt'))
@Controller('order')
export class OrderController {
  constructor(
    @Inject(ServiceNames.KAFKA_SERVICE)
    private readonly kafkaService: ClientKafka,
  ) {}

  @Get('me')
  @ApiOkResponse({ type: [OrderDto] })
  async getOrdersByUser(@Req() req: ReqWithUser): Promise<OrderDto[]> {
    return responseFrom(
      this.kafkaService.send<ServiceResponse<OrderDto[]>>(
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
    return responseFrom(
      this.kafkaService.send<ServiceResponse<DeepOrderDto>>(
        OrderPatterns.GET_ORDER_FOR_CUSTOMER,
        {
          id,
          customerId: req.user.sub,
        },
      ),
    );
  }
}
