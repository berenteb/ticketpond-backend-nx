import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { OrderPatterns } from '@ticketpond-backend-nx/message-patterns';
import {
  CartDto,
  OrderDto,
  OrderServiceInterface,
  ServiceResponse,
} from '@ticketpond-backend-nx/types';
import { CreateServiceResponse } from '@ticketpond-backend-nx/utils';

@Controller()
export class OrderInternalController {
  constructor(private readonly orderService: OrderServiceInterface) {}

  @MessagePattern(OrderPatterns.GET_ORDER_FOR_CUSTOMER)
  async getOrderForCustomer(data: {
    id: string;
    customerAuthId: string;
  }): Promise<ServiceResponse<OrderDto>> {
    const order = await this.orderService.getOrderByIdForCustomer(
      data.id,
      data.customerAuthId,
    );
    return CreateServiceResponse.success(order);
  }

  @MessagePattern(OrderPatterns.CREATE_ORDER)
  async createOrder(data: CartDto): Promise<ServiceResponse<OrderDto>> {
    const order = await this.orderService.createOrder(data);
    return CreateServiceResponse.success(order);
  }

  @EventPattern(OrderPatterns.FULFILL_ORDER)
  async fulfillOrder(data: string): Promise<void> {
    await this.orderService.fulfillOrder(data);
  }

  @EventPattern(OrderPatterns.FAIL_ORDER)
  async failOrder(data: string): Promise<void> {
    await this.orderService.failOrder(data);
  }
}
