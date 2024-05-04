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
import { ClientKafka } from '@nestjs/microservices';
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
  ServiceResponse,
} from '@ticketpond-backend-nx/types';
import { responseFrom } from '@ticketpond-backend-nx/utils';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(
    @Inject(ServiceNames.KAFKA_SERVICE)
    private readonly kafkaService: ClientKafka,
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
    this.sendWebhookEvent(
      req.headers['stripe-signature'],
      req.rawBody.toString(),
    );
  }

  private getOrderForCustomer(id: string, customerAuthId: string) {
    return responseFrom(
      this.kafkaService.send<ServiceResponse<OrderDto>>(
        OrderPatterns.GET_ORDER_FOR_CUSTOMER,
        {
          id,
          customerAuthId,
        },
      ),
    );
  }

  private getPaymentIntent(order: OrderDto) {
    return responseFrom(
      this.kafkaService.send<ServiceResponse<PaymentDto>>(
        PaymentPatterns.CREATE_PAYMENT_INTENT,
        order,
      ),
    );
  }

  private sendWebhookEvent(signature: string, body: string) {
    return this.kafkaService.emit<void>(PaymentPatterns.HANDLE_WEBHOOK, {
      signature,
      body,
    });
  }
}
