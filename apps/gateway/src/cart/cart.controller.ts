import {
  Body,
  Controller,
  Get,
  Inject,
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
  ServiceResponse,
} from '@ticketpond-backend-nx/types';
import { responseFrom } from '@ticketpond-backend-nx/utils';

@ApiTags('cart')
@UseGuards(AuthGuard('jwt'))
@Controller('cart')
export class CartController {
  constructor(
    @Inject(ServiceNames.KAFKA_SERVICE)
    private readonly kafkaService: ClientKafka,
  ) {}

  @Get('me')
  @ApiOkResponse({ type: CartDto })
  async getCartForMe(@Req() req: ReqWithUser): Promise<CartDto> {
    return responseFrom(
      this.kafkaService.send<ServiceResponse<CartDto>>(
        CartPatterns.GET_CART_BY_AUTH_ID,
        req.user.sub,
      ),
    );
  }

  @Post('me/checkout')
  @ApiOkResponse({ type: String })
  async checkoutForMe(@Req() req: ReqWithUser): Promise<string> {
    return responseFrom(
      this.kafkaService.send<ServiceResponse<string>>(
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
    return responseFrom(
      this.kafkaService.send<ServiceResponse<CartDto>>(
        CartPatterns.ADD_ITEM_TO_CART_BY_AUTH_ID,
        {
          authId: req.user.sub,
          ticketId: item.ticketId,
          quantity: item.quantity,
        },
      ),
    );
  }

  @Post('remove')
  @ApiOkResponse({ type: CartDto })
  async removeItemFromCartByUser(
    @Body() item: RemoveFromCartDto,
    @Req() req: ReqWithUser,
  ): Promise<CartDto> {
    return responseFrom(
      this.kafkaService.send<ServiceResponse<CartDto>>(
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
