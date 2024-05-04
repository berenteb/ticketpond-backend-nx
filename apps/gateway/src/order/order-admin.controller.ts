import {
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PermissionGuard } from '@ticketpond-backend-nx/authz';
import { OrderPatterns } from '@ticketpond-backend-nx/message-patterns';
import {
  DeepOrderWithCustomerDto,
  OrderWithCustomerDto,
  PermissionLevel,
  ServiceNames,
  ServiceResponse,
} from '@ticketpond-backend-nx/types';
import { responseFrom } from '@ticketpond-backend-nx/utils';

@ApiTags('order-admin')
@UseGuards(PermissionGuard(PermissionLevel.ADMIN))
@UseGuards(AuthGuard('jwt'))
@Controller('admin/order')
export class OrderAdminController {
  constructor(
    @Inject(ServiceNames.KAFKA_SERVICE)
    private readonly kafkaService: ClientKafka,
  ) {}

  @Get()
  @ApiOkResponse({ type: [OrderWithCustomerDto] })
  async getOrders(): Promise<OrderWithCustomerDto[]> {
    return responseFrom(
      this.kafkaService.send<ServiceResponse<OrderWithCustomerDto[]>>(
        OrderPatterns.LIST_ORDERS,
        {},
      ),
    );
  }

  @Get(':id')
  @ApiOkResponse({ type: DeepOrderWithCustomerDto })
  @ApiNotFoundResponse()
  async getOrder(@Param('id') id: string): Promise<DeepOrderWithCustomerDto> {
    return responseFrom(
      this.kafkaService.send<ServiceResponse<DeepOrderWithCustomerDto>>(
        OrderPatterns.GET_ORDER_WITH_CUSTOMER,
        id,
      ),
    );
  }

  @Delete(':id')
  @ApiOkResponse()
  async deleteOrder(@Param('id') id: string): Promise<void> {
    this.kafkaService.emit(OrderPatterns.DELETE_ORDER, id);
  }

  @Post('fulfill/:id')
  @ApiOkResponse()
  async fulfillOrder(@Param('id') id: string): Promise<void> {
    this.kafkaService.emit(OrderPatterns.FULFILL_ORDER, id);
  }

  @Post('cancel/:id')
  @ApiOkResponse()
  async cancelOrder(@Param('id') id: string): Promise<void> {
    this.kafkaService.emit(OrderPatterns.CANCEL_ORDER, id);
  }

  @Post('fail/:id')
  @ApiOkResponse()
  async failOrder(@Param('id') id: string): Promise<void> {
    this.kafkaService.emit(OrderPatterns.FAIL_ORDER, id);
  }
}
