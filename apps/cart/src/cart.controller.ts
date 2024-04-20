import {
  BadRequestException,
  Controller,
  InternalServerErrorException,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CartPatterns } from '@ticketpond-backend-nx/message-patterns';
import { CartDto, CartServiceInterface } from '@ticketpond-backend-nx/types';

@Controller()
export class CartController {
  constructor(private readonly cartService: CartServiceInterface) {}

  @MessagePattern(CartPatterns.GET_CART_BY_AUTH_ID)
  async getCartForCustomer(authId: string): Promise<CartDto> {
    return this.cartService.getCartForCustomer(authId);
  }

  @MessagePattern(CartPatterns.CHECKOUT_BY_AUTH_ID)
  async checkoutForCustomer(authId: string): Promise<string> {
    const cart = await this.cartService.getCartForCustomer(authId);
    if (cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }
    const order = await this.cartService.checkout(cart.id);
    if (!order) {
      throw new InternalServerErrorException('Could not checkout');
    }
    const sum = order.items.reduce((acc, item) => acc + item.price, 0);
    if (sum === 0) {
      this.cartService.fulfillOrder(order.id);
      return '/profile/orders/' + order.id;
    }
    return '/payment/' + order.id;
  }

  @MessagePattern(CartPatterns.ADD_ITEM_TO_CART_BY_AUTH_ID)
  async addItemToCartForCustomer(data: {
    authId: string;
    ticketId: string;
    quantity: number;
  }): Promise<CartDto> {
    return this.cartService.addItemToCartForCustomer(
      data.authId,
      data.ticketId,
      data.quantity,
    );
  }

  @MessagePattern(CartPatterns.REMOVE_ITEM_FROM_CART_BY_AUTH_ID)
  async removeItemFromCartForCustomer(data: {
    authId: string;
    ticketId: string;
    quantity: number;
  }): Promise<CartDto> {
    return this.cartService.removeItemFromCartForCustomer(
      data.authId,
      data.ticketId,
      data.quantity,
    );
  }
}
