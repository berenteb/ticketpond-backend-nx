import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CartPatterns } from '@ticketpond-backend-nx/message-patterns';
import {
  CartDto,
  CartServiceInterface,
  ServiceResponse,
} from '@ticketpond-backend-nx/types';
import { CreateServiceResponse } from '@ticketpond-backend-nx/utils';

@Controller()
export class CartController {
  constructor(private readonly cartService: CartServiceInterface) {}

  @MessagePattern(CartPatterns.GET_CART_BY_USER_ID)
  async getCartForCustomer(
    @Payload() customerId: string,
  ): Promise<ServiceResponse<CartDto>> {
    const cart = await this.cartService.getCartForCustomer(customerId);
    if (!cart) {
      return CreateServiceResponse.error('Cart not found', 404);
    }
    return CreateServiceResponse.success(cart);
  }

  @MessagePattern(CartPatterns.CHECKOUT_BY_USER_ID)
  async checkoutForCustomer(
    @Payload() customerId: string,
  ): Promise<ServiceResponse<string>> {
    const cart = await this.cartService.getCartForCustomer(customerId);
    if (cart.items.length === 0) {
      return CreateServiceResponse.error('Cart is empty', 400);
    }
    const order = await this.cartService.checkout(cart.id);
    if (!order) {
      return CreateServiceResponse.error('Could not checkout');
    }
    const sum = order.items.reduce((acc, item) => acc + item.price, 0);
    if (sum === 0) {
      this.cartService.fulfillOrder(order.id);
      return CreateServiceResponse.success('/profile/orders/' + order.id);
    }
    return CreateServiceResponse.success('/payment/' + order.id);
  }

  @MessagePattern(CartPatterns.ADD_ITEM_TO_CART_BY_USER_ID)
  async addItemToCartForCustomer(
    @Payload() data: { customerId: string; ticketId: string; quantity: number },
  ): Promise<ServiceResponse<CartDto>> {
    const cart = await this.cartService.addItemToCartForCustomer(
      data.customerId,
      data.ticketId,
      data.quantity,
    );
    if (!cart) {
      return CreateServiceResponse.error('Could not add item to cart');
    }
    return CreateServiceResponse.success(cart);
  }

  @MessagePattern(CartPatterns.REMOVE_ITEM_FROM_CART_BY_USER_ID)
  async removeItemFromCartForCustomer(
    @Payload() data: { customerId: string; ticketId: string; quantity: number },
  ): Promise<ServiceResponse<CartDto>> {
    const cart = await this.cartService.removeItemFromCartForCustomer(
      data.customerId,
      data.ticketId,
      data.quantity,
    );
    if (!cart) {
      return CreateServiceResponse.error('Could not remove item from cart');
    }
    return CreateServiceResponse.success(cart);
  }
}
