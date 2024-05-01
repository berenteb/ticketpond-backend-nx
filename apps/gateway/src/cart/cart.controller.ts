import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CartPatterns } from '@ticketpond-backend-nx/message-patterns';
import {
  AddToCartDto,
  CartDto,
  RemoveFromCartDto,
  type ReqWithUser,
  ServiceNames,
} from '@ticketpond-backend-nx/types';
import { firstValueFrom } from 'rxjs';

@ApiTags('cart')
@UseGuards(AuthGuard('jwt'))
@Controller('cart')
export class CartController implements OnModuleInit {
  constructor(
    @Inject(ServiceNames.CART_SERVICE)
    private readonly cartService: ClientKafka,
  ) {}

  async onModuleInit() {
    this.cartService.subscribeToResponseOf(CartPatterns.GET_CART_BY_AUTH_ID);
    this.cartService.subscribeToResponseOf(CartPatterns.CHECKOUT_BY_AUTH_ID);
    this.cartService.subscribeToResponseOf(
      CartPatterns.ADD_ITEM_TO_CART_BY_AUTH_ID,
    );
    this.cartService.subscribeToResponseOf(
      CartPatterns.REMOVE_ITEM_FROM_CART_BY_AUTH_ID,
    );
    await this.cartService.connect();
  }

  @Get('me')
  @ApiOkResponse({ type: CartDto })
  async getCartForMe(@Req() req: ReqWithUser): Promise<CartDto> {
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
}
