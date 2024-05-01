import { Controller, ForbiddenException } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { OrderPatterns } from '@ticketpond-backend-nx/message-patterns';
import {
  CartDto,
  DeepOrderDto,
  DeepOrderWithCustomerDto,
  OrderDto,
  OrderServiceInterface,
  OrderWithCustomerDto,
} from '@ticketpond-backend-nx/types';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderServiceInterface) {}

  @MessagePattern(OrderPatterns.GET_ORDER)
  async getOrder(@Payload() id: string): Promise<DeepOrderDto> {
    return this.orderService.getOrderById(id);
  }

  @MessagePattern(OrderPatterns.GET_ORDER_FOR_CUSTOMER)
  async getOrderForCustomer(
    @Payload() data: { id: string; customerAuthId: string },
  ): Promise<DeepOrderDto> {
    return this.orderService.getOrderByIdForCustomer(
      data.id,
      data.customerAuthId,
    );
  }

  @MessagePattern(OrderPatterns.LIST_ORDERS)
  async getOrders(): Promise<OrderWithCustomerDto[]> {
    return this.orderService.getOrders();
  }

  @MessagePattern(OrderPatterns.LIST_ORDERS_FOR_CUSTOMER)
  async getOrdersForCustomer(
    @Payload() customerAuthId: string,
  ): Promise<OrderDto[]> {
    return this.orderService.getOrdersForCustomer(customerAuthId);
  }

  @MessagePattern(OrderPatterns.DELETE_ORDER)
  async deleteOrder(@Payload() id: string): Promise<void> {
    return this.orderService.deleteOrder(id);
  }

  @MessagePattern(OrderPatterns.CREATE_ORDER)
  async createOrder(@Payload() cart: CartDto): Promise<DeepOrderDto> {
    return this.orderService.createOrder(cart);
  }

  @MessagePattern(OrderPatterns.GET_ORDER_WITH_CUSTOMER)
  async getOrderWithCustomer(
    @Payload() id: string,
  ): Promise<DeepOrderWithCustomerDto> {
    return this.orderService.getOrderByIdWithCustomer(id);
  }

  @MessagePattern(OrderPatterns.GET_ORDER_WITH_CUSTOMER_FOR_MERCHANT)
  async getOrderWithCustomerForMerchant(
    @Payload() data: { id: string; merchantId: string },
  ): Promise<DeepOrderWithCustomerDto> {
    const isConnectedToMerchant = await this.orderService.isConnectedToMerchant(
      data.id,
      data.merchantId,
    );
    if (!isConnectedToMerchant) {
      throw new ForbiddenException();
    }
    return this.orderService.getOrderByIdWithCustomer(data.id);
  }

  @MessagePattern(OrderPatterns.LIST_ORDERS_FOR_MERCHANT)
  async getOrdersForMerchant(
    @Payload() merchantId: string,
  ): Promise<OrderWithCustomerDto[]> {
    return this.orderService.getOrdersForMerchant(merchantId);
  }

  @EventPattern(OrderPatterns.FULFILL_ORDER)
  async fulfillOrder(@Payload() id: string): Promise<void> {
    return this.orderService.fulfillOrder(id);
  }

  @EventPattern(OrderPatterns.FAIL_ORDER)
  async failOrder(@Payload() id: string): Promise<void> {
    return this.orderService.failOrder(id);
  }

  @EventPattern(OrderPatterns.CANCEL_ORDER)
  async cancelOrder(@Payload() id: string): Promise<void> {
    return this.orderService.cancelOrder(id);
  }
}
