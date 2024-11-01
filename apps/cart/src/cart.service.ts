import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { OrderPatterns } from '@ticketpond-backend-nx/message-patterns';
import { PrismaService } from '@ticketpond-backend-nx/prisma';
import {
  CartDto,
  CartServiceInterface,
  OrderDto,
  ServiceNames,
  ServiceResponse,
} from '@ticketpond-backend-nx/types';
import { responseFrom } from '@ticketpond-backend-nx/utils';

@Injectable()
export class CartService implements CartServiceInterface {
  private readonly logger = new Logger(CartService.name);

  constructor(
    private readonly prismaService: PrismaService,
    @Inject(ServiceNames.KAFKA_SERVICE)
    private readonly kafkaService: ClientKafka,
  ) {}

  async createCartForCustomer(customerId: string): Promise<CartDto> {
    const cart = await this.prismaService.cart.create({
      data: { customer: { connect: { id: customerId } } },
      include: {
        items: { include: { ticket: { include: { experience: true } } } },
      },
    });
    this.logger.debug(
      `Created cart for customer ${customerId} with id ${cart.id}`,
    );
    return cart;
  }

  async getCartById(id: string): Promise<CartDto> {
    const cart = await this.prismaService.cart.findUnique({
      where: { id },
      include: {
        items: { include: { ticket: { include: { experience: true } } } },
      },
    });
    if (!cart) {
      return null;
    }
    this.logger.debug(`Found cart with id ${id}`);
    return cart;
  }

  async getCartForCustomer(customerId: string): Promise<CartDto> {
    const cart = await this.prismaService.cart.findFirst({
      where: { customer: { id: customerId } },
      include: {
        items: { include: { ticket: { include: { experience: true } } } },
      },
    });
    if (cart) {
      this.logger.debug(`Found cart for customer ${customerId}`);
      return cart;
    } else {
      const created = await this.createCartForCustomer(customerId);
      this.logger.debug(
        `Created cart for customer ${customerId} with id ${created.id}`,
      );
      return created;
    }
  }

  async addItemToCartForCustomer(
    authId: string,
    ticketId: string,
    quantity: number,
  ): Promise<CartDto> {
    const cart = await this.getCartForCustomer(authId);
    return this.addItemToCart(cart.id, ticketId, quantity);
  }

  async addItemToCart(
    cartId: string,
    ticketId: string,
    quantity: number,
  ): Promise<CartDto> {
    for (let i = 0; i < quantity; i++) {
      await this.prismaService.cartItem.create({ data: { cartId, ticketId } });
    }
    this.logger.debug(
      `Added ${quantity} items of ${ticketId} to cart ${cartId}`,
    );
    return this.getCartById(cartId);
  }

  async removeItemFromCartForCustomer(
    customerId: string,
    ticketId: string,
    quantity: number,
  ): Promise<CartDto> {
    const cart = await this.getCartForCustomer(customerId);
    return this.removeItemFromCart(cart.id, ticketId, quantity);
  }

  async removeItemFromCart(
    cartId: string,
    ticketId: string,
    quantity: number,
  ): Promise<CartDto> {
    for (let i = 0; i < quantity; i++) {
      const deleteCandidate = await this.prismaService.cartItem.findFirst({
        where: { cartId, ticketId },
      });
      if (!deleteCandidate) {
        break;
      }
      await this.prismaService.cartItem.delete({
        where: { id: deleteCandidate.id },
      });
    }
    this.logger.debug(
      `Removed ${quantity} items of ${ticketId} from cart ${cartId}`,
    );
    return this.getCartById(cartId);
  }

  async checkout(cartId: string): Promise<OrderDto> {
    const cart = await this.getCartById(cartId);
    this.logger.debug(`Checking out cart ${cartId}`);
    const order = await this.createOrder(cart);
    await this.deleteCart(cartId);
    this.logger.debug(`Checked out cart ${cartId} to order ${order.id}`);
    return order;
  }

  fulfillOrder(orderId: string): void {
    this.kafkaService.send(OrderPatterns.FULFILL_ORDER, orderId);
  }

  private async createOrder(cart: CartDto): Promise<OrderDto> {
    return responseFrom(
      this.kafkaService.send<ServiceResponse<OrderDto>>(
        OrderPatterns.CREATE_ORDER,
        cart,
      ),
    );
  }

  async deleteCart(cartId: string): Promise<void> {
    await this.prismaService.cart.delete({ where: { id: cartId } });
    this.logger.debug(`Deleted cart ${cartId}`);
  }

  async deleteCartForCustomer(customerId: string): Promise<void> {
    await this.prismaService.cart.deleteMany({
      where: {
        customer: { id: customerId },
      },
    });
    this.logger.debug(`Deleted cart for customer ${customerId}`);
  }
}
