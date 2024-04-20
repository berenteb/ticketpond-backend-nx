import { CartDto, OrderDto } from '../dtos';

export abstract class CartServiceInterface {
  abstract getCartById(id: string): Promise<CartDto>;

  abstract getCartForCustomer(authId: string): Promise<CartDto>;

  abstract createCartForCustomer(authId: string): Promise<CartDto>;

  abstract addItemToCart(
    cartId: string,
    ticketId: string,
    quantity: number,
  ): Promise<CartDto>;
  abstract addItemToCartForCustomer(
    authId: string,
    ticketId: string,
    quantity: number,
  ): Promise<CartDto>;

  abstract removeItemFromCart(
    cartId: string,
    ticketId: string,
    quantity: number,
  ): Promise<CartDto>;
  abstract removeItemFromCartForCustomer(
    authId: string,
    ticketId: string,
    quantity: number,
  ): Promise<CartDto>;

  abstract deleteCart(cartId: string): Promise<void>;

  abstract deleteCartForCustomer(authId: string): Promise<void>;
  abstract checkout(cartId: string): Promise<OrderDto>;
  abstract fulfillOrder(orderId: string): void;
}
