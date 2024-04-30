import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PaymentPatterns } from '@ticketpond-backend-nx/message-patterns';
import { OrderDto, PaymentDto } from '@ticketpond-backend-nx/types';

import { PaymentService } from './payment.service';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @MessagePattern(PaymentPatterns.CREATE_PAYMENT_INTENT)
  createPaymentIntent(data: OrderDto): Promise<PaymentDto> {
    return this.paymentService.createIntent(data);
  }

  @MessagePattern(PaymentPatterns.HANDLE_WEBHOOK)
  handleWebhook(data: {
    signature: string | string[] | Buffer;
    body: Buffer;
  }): Promise<void> {
    return this.paymentService.handleWebhook(data.signature, data.body);
  }
}
