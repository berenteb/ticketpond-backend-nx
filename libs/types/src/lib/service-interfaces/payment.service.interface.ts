import { OrderDto } from '../dtos/order.dto';
import { PaymentDto } from '../dtos/payment.dto';

export abstract class PaymentServiceInterface {
  abstract createIntent(order: OrderDto): Promise<PaymentDto>;
  abstract handleWebhook(req: Request, body: any): Promise<void>;
}
