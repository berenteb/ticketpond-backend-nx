import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { PaymentPatterns } from '@ticketpond-backend-nx/message-patterns';
import {
  OrderDto,
  PaymentDto,
  PaymentServiceInterface,
  ServiceResponse,
} from '@ticketpond-backend-nx/types';
import { CreateServiceResponse } from '@ticketpond-backend-nx/utils';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentServiceInterface) {}

  @MessagePattern(PaymentPatterns.CREATE_PAYMENT_INTENT)
  async createPaymentIntent(
    @Payload() data: OrderDto,
  ): Promise<ServiceResponse<PaymentDto>> {
    const intent = await this.paymentService.createIntent(data);
    return CreateServiceResponse.success(intent);
  }

  @EventPattern(PaymentPatterns.HANDLE_WEBHOOK)
  async handleWebhook(
    @Payload() data: { signature: string; body: string },
  ): Promise<void> {
    await this.paymentService.handleWebhook(data.signature, data.body);
  }
}
