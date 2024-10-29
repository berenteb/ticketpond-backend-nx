import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
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
} from '@ticketpond-backend-nx/types';

@UseGuards(PermissionGuard(PermissionLevel.ADMIN))
@UseGuards(JwtGuard)
@ApiTags('Order-Admin')
@Controller('admin')
@ApiCookieAuth('jwt')
export class OrderAdminController {
  constructor(private readonly orderService: OrderServiceInterface) {}

  @Get()
  @ApiOkResponse({ type: [OrderWithCustomerDto] })
  async getOrders(): Promise<OrderWithCustomerDto[]> {
    return this.orderService.getOrders();
  }

  @Get(':id')
  @ApiOkResponse({ type: DeepOrderWithCustomerDto })
  @ApiNotFoundResponse()
  async getOrder(@Param('id') id: string): Promise<DeepOrderWithCustomerDto> {
    const order = await this.orderService.getOrderByIdWithCustomer(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  @Delete(':id')
  @ApiOkResponse()
  deleteOrder(@Param('id') id: string): Promise<void> {
    return this.orderService.deleteOrder(id);
  }

  @Post('fulfill/:id')
  @ApiOkResponse()
  fulfillOrder(@Param('id') id: string): Promise<void> {
    return this.orderService.fulfillOrder(id);
  }

  @Post('cancel/:id')
  @ApiOkResponse()
  cancelOrder(@Param('id') id: string): Promise<void> {
    return this.orderService.cancelOrder(id);
  }

  @Post('fail/:id')
  @ApiOkResponse()
  failOrder(@Param('id') id: string): Promise<void> {
    return this.orderService.failOrder(id);
  }
}
