import {
  Controller,
  NotFoundException,
  Param,
  Post,
  RawBodyRequest,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@ticketpond-backend-nx/auth';
import {
  PaymentDto,
  PaymentServiceInterface,
  type ReqWithUser,
} from '@ticketpond-backend-nx/types';

@ApiTags('Payment')
@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentServiceInterface) {}

  @UseGuards(JwtGuard)
  @Post('intent/:id')
  @ApiOkResponse({ type: PaymentDto })
  @ApiCookieAuth('jwt')
  async createPaymentIntent(
    @Param('id') id: string,
    @Req() req: ReqWithUser,
  ): Promise<PaymentDto> {
    const order = await this.paymentService.getOrderForCustomer(
      id,
      req.user.sub,
    );
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
}
