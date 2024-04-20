import { Injectable, Logger } from '@nestjs/common';
import { Customer } from '@prisma/client';
import {
  DeepOrderWithCustomerDto,
  NotificationServiceInterface,
} from '@ticketpond-backend-nx/types';

@Injectable()
export class NotificationService implements NotificationServiceInterface {
  private readonly logger = new Logger(NotificationService.name);

  sendWelcome(customer: Customer): void {
    this.logger.log(`Sent welcome email to ${customer.email}`);
  }
  sendOrderSuccess(order: DeepOrderWithCustomerDto): void {
    this.logger.log(`Sent order success email to ${order.customer.email}`);
  }
}
