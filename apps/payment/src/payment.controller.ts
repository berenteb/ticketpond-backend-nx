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
import { ApiCookieAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@ticketpond-backend-nx/auth';
import { OrderPatterns } from '@ticketpond-backend-nx/message-patterns';
import {
  OrderDto,
  PaymentDto,
  PaymentServiceInterface,
  type ReqWithUser,
  ServiceNames,
  ServiceResponse,
} from '@ticketpond-backend-nx/types';
import { responseFrom } from '@ticketpond-backend-nx/utils';

@ApiTags('Payment')
@Controller()
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentServiceInterface,
    @Inject(ServiceNames.KAFKA_SERVICE)
    private readonly kafkaService: ClientKafka,
  ) {}

  @UseGuards(JwtGuard)
  @Post('intent/:id')
  @ApiOkResponse({ type: PaymentDto })
  @ApiCookieAuth('jwt')
  async createPaymentIntent(
    @Param('id') id: string,
    @Req() req: ReqWithUser,
  ): Promise<PaymentDto> {
    const order = await this.getOrderForCustomer(id, req.user.sub);
    if (!order) {
      throw new NotFoundException();
    }
    return this.paymentService.createIntent(order);
  }

  @Post('webhook')
  async handleWebhook(@Req() req: RawBodyRequest<Request>): Promise<void> {
    return this.paymentService.handleWebhook(
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
}
