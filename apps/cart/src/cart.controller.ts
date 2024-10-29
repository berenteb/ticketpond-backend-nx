import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@ticketpond-backend-nx/auth';
import {
  AddToCartDto,
  CartDto,
  CartServiceInterface,
  RemoveFromCartDto,
  type ReqWithUser,
} from '@ticketpond-backend-nx/types';
import { Response } from 'express';

@UseGuards(JwtGuard)
@Controller()
@ApiTags('Cart')
@ApiCookieAuth('jwt')
export class CartController {
  constructor(private readonly cartService: CartServiceInterface) {}

  @Get()
  @ApiOkResponse({ type: CartDto })
  async getCartForCustomer(@Req() req: ReqWithUser): Promise<CartDto> {
    const cart = await this.cartService.getCartForCustomer(req.user.sub);
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    return cart;
  }

  @Post('checkout')
  @ApiOkResponse({ type: String })
  async checkoutForCustomer(
    @Req() req: ReqWithUser,
    @Res() res: Response,
  ): Promise<void> {
    const cart = await this.cartService.getCartForCustomer(req.user.sub);
    if (cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }
    const order = await this.cartService.checkout(cart.id);
    if (!order) {
      throw new InternalServerErrorException('Could not create order');
    }
    const sum = order.items.reduce((acc, item) => acc + item.price, 0);
    if (sum === 0) {
      this.cartService.fulfillOrder(order.id);
      return res.redirect('/profile/orders/' + order.id);
    }
    return res.redirect('/payment/' + order.id);
  }

  @Post('add')
  @ApiOkResponse({ type: CartDto })
  async addItemToCartForCustomer(
    @Body() item: AddToCartDto,
    @Req() req: ReqWithUser,
  ): Promise<CartDto> {
    const cart = await this.cartService.addItemToCartForCustomer(
      req.user.sub,
      item.ticketId,
      item.quantity,
    );
    if (!cart) {
      throw new NotFoundException('Could not add item to cart');
    }
    return cart;
  }

  @Post('remove')
  @ApiOkResponse({ type: CartDto })
  async removeItemFromCartForCustomer(
    @Body() item: RemoveFromCartDto,
    @Req() req: ReqWithUser,
  ): Promise<CartDto> {
    const cart = await this.cartService.removeItemFromCartForCustomer(
      req.user.sub,
      item.ticketId,
      item.quantity,
    );
    if (!cart) {
      throw new NotFoundException('Could not remove item from cart');
    }
    return cart;
  }
}
