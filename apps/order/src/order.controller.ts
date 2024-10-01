import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { OrderPatterns } from '@ticketpond-backend-nx/message-patterns';
import {
  CartDto,
  DeepOrderDto,
  DeepOrderWithCustomerDto,
  OrderDto,
  OrderServiceInterface,
  OrderWithCustomerDto,
  ServiceResponse,
} from '@ticketpond-backend-nx/types';
import { CreateServiceResponse } from '@ticketpond-backend-nx/utils';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderServiceInterface) {}

  @MessagePattern(OrderPatterns.GET_ORDER)
  async getOrder(
    @Payload() id: string,
  ): Promise<ServiceResponse<DeepOrderDto>> {
    const order = await this.orderService.getOrderById(id);
    if (!order) {
      return CreateServiceResponse.error('Order not found', 404);
    }
    return CreateServiceResponse.success(order);
  }

  @MessagePattern(OrderPatterns.GET_ORDER_FOR_CUSTOMER)
  async getOrderForCustomer(
    @Payload() data: { id: string; customerId: string },
  ): Promise<ServiceResponse<DeepOrderDto>> {
    const order = await this.orderService.getOrderByIdForCustomer(
      data.id,
      data.customerId,
    );
    if (!order) {
      return CreateServiceResponse.error('Order not found', 404);
    }
    return CreateServiceResponse.success(order);
  }

  @MessagePattern(OrderPatterns.LIST_ORDERS)
  async getOrders(): Promise<ServiceResponse<OrderWithCustomerDto[]>> {
    const orders = await this.orderService.getOrders();
    return CreateServiceResponse.success(orders);
  }

  @MessagePattern(OrderPatterns.LIST_ORDERS_FOR_CUSTOMER)
  async getOrdersForCustomer(
    @Payload() customerId: string,
  ): Promise<ServiceResponse<OrderDto[]>> {
    const orders = await this.orderService.getOrdersForCustomer(customerId);
    return CreateServiceResponse.success(orders);
  }

  @EventPattern(OrderPatterns.DELETE_ORDER)
  async deleteOrder(@Payload() id: string): Promise<void> {
    await this.orderService.deleteOrder(id);
  }

  @MessagePattern(OrderPatterns.CREATE_ORDER)
  async createOrder(
    @Payload() cart: CartDto,
  ): Promise<ServiceResponse<DeepOrderDto>> {
    const createdOrder = await this.orderService.createOrder(cart);
    return CreateServiceResponse.success(createdOrder);
  }

  @MessagePattern(OrderPatterns.GET_ORDER_WITH_CUSTOMER)
  async getOrderWithCustomer(
    @Payload() id: string,
  ): Promise<ServiceResponse<DeepOrderWithCustomerDto>> {
    const order = await this.orderService.getOrderByIdWithCustomer(id);
    if (!order) {
      return CreateServiceResponse.error('Order not found', 404);
    }
    return CreateServiceResponse.success(order);
  }

  @MessagePattern(OrderPatterns.GET_ORDER_WITH_CUSTOMER_FOR_MERCHANT)
  async getOrderWithCustomerForMerchant(
    @Payload() data: { id: string; merchantId: string },
  ): Promise<ServiceResponse<DeepOrderWithCustomerDto>> {
    const isConnectedToMerchant = await this.orderService.isConnectedToMerchant(
      data.id,
      data.merchantId,
    );
    if (!isConnectedToMerchant) {
      return CreateServiceResponse.error('Order not found', 404);
    }
    const order = await this.orderService.getOrderByIdWithCustomer(data.id);
    if (!order) {
      return CreateServiceResponse.error('Order not found', 404);
    }
    return CreateServiceResponse.success(order);
  }

  @MessagePattern(OrderPatterns.LIST_ORDERS_FOR_MERCHANT)
  async getOrdersForMerchant(
    @Payload() merchantId: string,
  ): Promise<ServiceResponse<OrderWithCustomerDto[]>> {
    const orders = await this.orderService.getOrdersForMerchant(merchantId);
    return CreateServiceResponse.success(orders);
  }

  @EventPattern(OrderPatterns.FULFILL_ORDER)
  async fulfillOrder(@Payload() id: string): Promise<void> {
    await this.orderService.fulfillOrder(id);
  }

  @EventPattern(OrderPatterns.FAIL_ORDER)
  async failOrder(@Payload() id: string): Promise<void> {
    await this.orderService.failOrder(id);
  }

  @EventPattern(OrderPatterns.CANCEL_ORDER)
  async cancelOrder(@Payload() id: string): Promise<void> {
    await this.orderService.cancelOrder(id);
  }
}
