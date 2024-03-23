import { Customer } from '@prisma/client';

import { DeepOrderWithCustomerDto } from '../dtos';

export abstract class NotificationServiceInterface {
  abstract sendWelcome(customer: Customer): void;
  abstract sendOrderSuccess(order: DeepOrderWithCustomerDto): void;
}
