import {
  Controller,
  Inject,
  NotFoundException,
  Param,
  Post,
  RawBodyRequest,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  OrderPatterns,
  PaymentPatterns,
} from '@ticketpond-backend-nx/message-patterns';
import {
  OrderDto,
  PaymentDto,
  type ReqWithUser,
  ServiceNames,
} from '@ticketpond-backend-nx/types';
import { firstValueFrom } from 'rxjs';

@ApiTags('payment')
@UseGuards(AuthGuard('jwt'))
@Controller('payment')
export class PaymentController {
  constructor(
    @Inject(ServiceNames.PAYMENT_SERVICE)
    private readonly paymentService: ClientProxy,
    @Inject(ServiceNames.ORDER_SERVICE)
    private readonly orderService: ClientProxy,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('intent/:id')
  @ApiOkResponse({ type: PaymentDto })
  async createPaymentIntent(
    @Param('id') id: string,
    @Req() req: ReqWithUser,
  ): Promise<PaymentDto> {
    const order = await this.getOrderForCustomer(id, req.user.sub);
    if (!order) {
      throw new NotFoundException();
    }
    return this.getPaymentIntent(order);
  }

  @Post('webhook')
  async handleWebhook(@Req() req: RawBodyRequest<Request>): Promise<void> {
    this.sendWebhookEvent(req.headers['stripe-signature'], req.rawBody);
  }

  private getOrderForCustomer(id: string, customerAuthId: string) {
    return firstValueFrom(
      this.orderService.send<OrderDto | undefined>(
        OrderPatterns.GET_ORDER_FOR_CUSTOMER,
        {
          id,
          customerAuthId,
        },
      ),
    );
  }

  private getPaymentIntent(order: OrderDto) {
    return firstValueFrom(
      this.paymentService.send<PaymentDto>(
        PaymentPatterns.CREATE_PAYMENT_INTENT,
        order,
      ),
    );
  }

  private sendWebhookEvent(
    signature: string | string[] | Buffer,
    body: Buffer,
  ) {
    return this.paymentService.send<void>(PaymentPatterns.HANDLE_WEBHOOK, {
      signature,
      body,
    });
  }
}
