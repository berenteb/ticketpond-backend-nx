import { CartDto } from '../dtos/cart.dto';
import {
  DeepOrderDto,
  DeepOrderWithCustomerDto,
  OrderDto,
  OrderWithCustomerDto,
} from '../dtos/order.dto';
import { IsOwnProperty } from './common.interface';

export abstract class OrderServiceInterface implements IsOwnProperty {
  abstract getOrders(): Promise<OrderWithCustomerDto[]>;
  abstract getOrderByIdWithCustomer(
    id: string,
  ): Promise<DeepOrderWithCustomerDto>;
  abstract getOrdersForMerchant(
    merchantId: string,
  ): Promise<OrderWithCustomerDto[]>;
  abstract getOrdersForCustomer(userId: string): Promise<OrderDto[]>;
  abstract getOrderById(id: string): Promise<DeepOrderDto>;
  abstract isOwnProperty(itemId: string, ownerId: string): Promise<boolean>;
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
