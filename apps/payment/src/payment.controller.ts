import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { PaymentPatterns } from '@ticketpond-backend-nx/message-patterns';
import {
  OrderDto,
  PaymentDto,
  PaymentServiceInterface,
} from '@ticketpond-backend-nx/types';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentServiceInterface) {}

  @MessagePattern(PaymentPatterns.CREATE_PAYMENT_INTENT)
  createPaymentIntent(@Payload() data: OrderDto): Promise<PaymentDto> {
    return this.paymentService.createIntent(data);
  }

  @EventPattern(PaymentPatterns.HANDLE_WEBHOOK)
  handleWebhook(
    @Payload() data: { signature: string; body: string },
  ): Promise<void> {
    return this.paymentService.handleWebhook(data.signature, data.body);
  }
}
