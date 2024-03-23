import { OrderDto, PaymentDto } from '../dtos';

export abstract class PaymentServiceInterface {
  abstract createIntent(order: OrderDto): Promise<PaymentDto>;
  abstract handleWebhook(req: Request, body: any): Promise<void>;
}
