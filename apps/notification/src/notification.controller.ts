import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Customer } from '@prisma/client';
import { NotificationPatterns } from '@ticketpond-backend-nx/message-patterns';
import {
  DeepOrderWithCustomerDto,
  NotificationServiceInterface,
} from '@ticketpond-backend-nx/types';

@Controller()
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationServiceInterface,
  ) {}

  @EventPattern(NotificationPatterns.SEND_WELCOME)
  async sendWelcome(@Payload() data: Customer) {
    this.notificationService.sendWelcome(data);
  }

  @EventPattern(NotificationPatterns.SEND_ORDER_CONFIRMATION)
  async sendOrderConfirmation(@Payload() data: DeepOrderWithCustomerDto) {
    this.notificationService.sendOrderSuccess(data);
  }
}
