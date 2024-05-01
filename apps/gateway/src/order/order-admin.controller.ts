import {
  Controller,
  Delete,
  Get,
  Inject,
  OnModuleInit,
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
} from '@ticketpond-backend-nx/types';
import { firstValueFrom } from 'rxjs';

@ApiTags('order-admin')
@UseGuards(PermissionGuard(PermissionLevel.ADMIN))
@UseGuards(AuthGuard('jwt'))
@Controller('admin/order')
export class OrderAdminController implements OnModuleInit {
  constructor(
    @Inject(ServiceNames.ORDER_SERVICE)
    private readonly orderService: ClientKafka,
  ) {}

  async onModuleInit() {
    this.orderService.subscribeToResponseOf(OrderPatterns.LIST_ORDERS);
    this.orderService.subscribeToResponseOf(
      OrderPatterns.GET_ORDER_WITH_CUSTOMER,
    );
    this.orderService.subscribeToResponseOf(OrderPatterns.DELETE_ORDER);
    await this.orderService.connect();
  }

  @Get()
  @ApiOkResponse({ type: [OrderWithCustomerDto] })
  async getOrders(): Promise<OrderWithCustomerDto[]> {
    return firstValueFrom(
      this.orderService.send<OrderWithCustomerDto[]>(
        OrderPatterns.LIST_ORDERS,
        {},
      ),
    );
  }

  @Get(':id')
  @ApiOkResponse({ type: DeepOrderWithCustomerDto })
  @ApiNotFoundResponse()
  async getOrder(@Param('id') id: string): Promise<DeepOrderWithCustomerDto> {
    return firstValueFrom(
      this.orderService.send<DeepOrderWithCustomerDto>(
        OrderPatterns.GET_ORDER_WITH_CUSTOMER,
        id,
      ),
    );
  }

  @Delete(':id')
  @ApiOkResponse()
  async deleteOrder(@Param('id') id: string): Promise<void> {
    return firstValueFrom(
      this.orderService.send(OrderPatterns.DELETE_ORDER, id),
    );
  }

  @Post('fulfill/:id')
  @ApiOkResponse()
  async fulfillOrder(@Param('id') id: string): Promise<void> {
    this.orderService.emit(OrderPatterns.FULFILL_ORDER, id);
  }

  @Post('cancel/:id')
  @ApiOkResponse()
  async cancelOrder(@Param('id') id: string): Promise<void> {
    this.orderService.emit(OrderPatterns.CANCEL_ORDER, id);
  }

  @Post('fail/:id')
  @ApiOkResponse()
  async failOrder(@Param('id') id: string): Promise<void> {
    this.orderService.emit(OrderPatterns.FAIL_ORDER, id);
  }
}
