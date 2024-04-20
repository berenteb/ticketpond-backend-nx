import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Customer } from '@prisma/client';
import { NotificationPatterns } from '@ticketpond-backend-nx/message-patterns';
import { NotificationServiceInterface } from '@ticketpond-backend-nx/types';

@Controller()
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationServiceInterface,
  ) {}

  @EventPattern(NotificationPatterns.SEND_WELCOME)
  async sendWelcome(@Payload() data: Customer) {
    this.notificationService.sendWelcome(data);
  }
}
