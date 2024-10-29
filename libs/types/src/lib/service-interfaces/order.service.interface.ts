import {
  CartDto,
  DeepOrderDto,
  DeepOrderWithCustomerDto,
  OrderDto,
  OrderWithCustomerDto,
} from '../dtos';

export abstract class OrderServiceInterface {
  abstract getOrders(): Promise<OrderWithCustomerDto[]>;
  abstract getOrderByIdWithCustomer(
    id: string,
  ): Promise<DeepOrderWithCustomerDto>;
  abstract getOrderByIdForCustomer(
    id: string,
    customerAuthId: string,
  ): Promise<DeepOrderDto>;
  abstract getOrdersForMerchant(
    merchantId: string,
  ): Promise<OrderWithCustomerDto[]>;
  abstract getOrdersForCustomer(customerAuthId: string): Promise<OrderDto[]>;
  abstract getOrderById(id: string): Promise<DeepOrderDto>;
  abstract isConnectedToMerchant(
    itemId: string,
    merchantId: string,
  ): Promise<boolean>;
  abstract fulfillOrder(id: string): Promise<void>;
  abstract failOrder(id: string): Promise<void>;
  abstract cancelOrder(id: string): Promise<void>;
  abstract createOrder(cart: CartDto): Promise<DeepOrderDto>;
  abstract deleteOrder(id: string): Promise<void>;
}
