import {
  Controller,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
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
  async getOrder(id: string): Promise<DeepOrderDto> {
    return this.orderService.getOrderById(id);
  }

  @MessagePattern(OrderPatterns.GET_ORDER_FOR_CUSTOMER)
  async getOrderForCustomer(data: {
    id: string;
    customerId: string;
  }): Promise<DeepOrderDto> {
    return this.orderService.getOrderByIdForCustomer(data.id, data.customerId);
  }

  @MessagePattern(OrderPatterns.LIST_ORDERS)
  async getOrders(): Promise<OrderWithCustomerDto[]> {
    return this.orderService.getOrders();
  }

  @MessagePattern(OrderPatterns.LIST_ORDERS_FOR_CUSTOMER)
  async getOrdersForCustomer(customerId: string): Promise<OrderDto[]> {
    return this.orderService.getOrdersForCustomer(customerId);
  }

  @MessagePattern(OrderPatterns.DELETE_ORDER)
  async deleteOrder(id: string): Promise<void> {
    return this.orderService.deleteOrder(id);
  }

  @MessagePattern(OrderPatterns.CREATE_ORDER)
  async createOrder(cart: CartDto): Promise<DeepOrderDto> {
    return this.orderService.createOrder(cart);
  }

  @MessagePattern(OrderPatterns.GET_ORDER_WITH_CUSTOMER)
  async getOrderWithCustomer(id: string): Promise<DeepOrderWithCustomerDto> {
    return this.orderService.getOrderByIdWithCustomer(id);
  }

  @MessagePattern(OrderPatterns.GET_ORDER_WITH_CUSTOMER_FOR_MERCHANT)
  async getOrderWithCustomerForMerchant(data: {
    id: string;
    merchantId: string;
  }): Promise<DeepOrderWithCustomerDto> {
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
    merchantId: string,
  ): Promise<OrderWithCustomerDto[]> {
    return this.orderService.getOrdersForMerchant(merchantId);
  }

  @MessagePattern(OrderPatterns.FULFILL_ORDER)
  async fulfillOrder(id: string): Promise<void> {
    return this.orderService.fulfillOrder(id);
  }

  @MessagePattern(OrderPatterns.FAIL_ORDER)
  async failOrder(id: string): Promise<void> {
    return this.orderService.failOrder(id);
  }

  @MessagePattern(OrderPatterns.CANCEL_ORDER)
  async cancelOrder(id: string): Promise<void> {
    return this.orderService.cancelOrder(id);
  }
}
