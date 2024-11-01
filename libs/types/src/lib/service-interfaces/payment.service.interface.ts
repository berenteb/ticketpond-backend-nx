import { OrderDto, PaymentDto } from '../dtos';

export abstract class PaymentServiceInterface {
  abstract getOrderForCustomer(
    id: string,
    customerId: string,
  ): Promise<OrderDto>;
  abstract createIntent(order: OrderDto): Promise<PaymentDto>;
  abstract handleWebhook(signature: string, body: string): Promise<void>;
}
