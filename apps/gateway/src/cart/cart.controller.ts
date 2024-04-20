import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  CartPatterns,
  CustomerMessagePattern,
} from '@ticketpond-backend-nx/message-patterns';
import {
  AddToCartDto,
  CartDto,
  CustomerDto,
  RemoveFromCartDto,
  type ReqWithUser,
  ServiceNames,
} from '@ticketpond-backend-nx/types';
import { firstValueFrom } from 'rxjs';

import { ServiceResponse } from '../../../../libs/types/src/lib/service-response';

@ApiTags('cart')
@UseGuards(AuthGuard('jwt'))
@Controller('cart')
export class CartController {
  constructor(
    @Inject(ServiceNames.CUSTOMER_SERVICE)
    private readonly customerService: ClientProxy,
    @Inject(ServiceNames.CART_SERVICE)
    private readonly cartService: ClientProxy,
  ) {}

  @Get('me')
  @ApiOkResponse({ type: CartDto })
  async getCartForMe(@Req() req: ReqWithUser): Promise<CartDto> {
    const customer = await this.getCustomerById(req.user.sub);
    if (!customer) {
      throw new NotFoundException(`Customer with id ${req.user.sub} not found`);
    }
    return firstValueFrom(
      this.cartService.send<CartDto>(
        CartPatterns.GET_CART_BY_AUTH_ID,
        req.user.sub,
      ),
    );
  }

  @Post('me/checkout')
  @ApiOkResponse({ type: String })
  async checkoutForMe(@Req() req: ReqWithUser): Promise<string> {
    const customer = await this.getCustomerById(req.user.sub);
    if (!customer) {
      throw new NotFoundException(`Customer with id ${req.user.sub} not found`);
    }
    return firstValueFrom(
      this.cartService.send<string>(
        CartPatterns.CHECKOUT_BY_AUTH_ID,
        req.user.sub,
      ),
    );
  }

  @Post('add')
  @ApiOkResponse({ type: CartDto })
  async addItemToCartByUser(
    @Body() item: AddToCartDto,
    @Req() req: ReqWithUser,
  ): Promise<CartDto> {
    const customer = await this.getCustomerById(req.user.sub);
    if (!customer) {
      throw new NotFoundException(`Customer with id ${req.user.sub} not found`);
    }
    return firstValueFrom(
      this.cartService.send<CartDto>(CartPatterns.ADD_ITEM_TO_CART_BY_AUTH_ID, {
        authId: req.user.sub,
        ticketId: item.ticketId,
        quantity: item.quantity,
      }),
    );
  }

  @Post('remove')
  @ApiOkResponse({ type: CartDto })
  async removeItemFromCartByUser(
    @Body() item: RemoveFromCartDto,
    @Req() req: ReqWithUser,
  ): Promise<CartDto> {
    const customer = await this.getCustomerById(req.user.sub);
    if (!customer) {
      throw new NotFoundException(`Customer with id ${req.user.sub} not found`);
    }
    return firstValueFrom(
      this.cartService.send<CartDto>(
        CartPatterns.REMOVE_ITEM_FROM_CART_BY_AUTH_ID,
        {
          authId: req.user.sub,
          ticketId: item.ticketId,
          quantity: item.quantity,
        },
      ),
    );
  }

  private async getCustomerById(authId: string): Promise<CustomerDto> {
    const response = await firstValueFrom(
      this.customerService.send<ServiceResponse<CustomerDto>>(
        CustomerMessagePattern.GET_CUSTOMER_BY_AUTH_ID,
        authId,
      ),
    );
    if (!response.success) return null;
    return response.data;
  }
}
