import { Injectable, Logger } from '@nestjs/common';
import { Customer } from '@prisma/client';
import { render } from '@react-email/render';
import {
  DeepOrderWithCustomerDto,
  NotificationServiceInterface,
} from '@ticketpond-backend-nx/types';
import { createTransport, Transporter } from 'nodemailer';

import { ConfigService } from './config.service';
import OrderSuccess from './emails/order-success';
import Welcome from './emails/welcome';

@Injectable()
export class EmailNotificationService implements NotificationServiceInterface {
  private readonly logger = new Logger(EmailNotificationService.name);
  private transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = createTransport(
      {
        host: this.configService.get('email').host,
        port: this.configService.get('email').port,
        secure: this.configService.get('email').secure,
        auth: this.configService.get('email').auth,
      },
      {
        from: this.configService.get('email').from,
      },
    );
  }

  sendWelcome(customer: Customer): void {
    const html = render(Welcome({ customer }));
    this.sendMail(customer.email, 'Üdvözlünk a TicketPond-on 👋', html);
  }

  sendOrderSuccess(order: DeepOrderWithCustomerDto): void {
    const html = render(
      OrderSuccess({
        order: order,
        qrCodeBaseUrl: 'http://localhost:3001/cdn/passes/image',
        walletBaseUrl: 'http://localhost:3001/cdn/passes/apple',
      }),
    );
    this.sendMail(order.customer.email, 'Sikeres vásárlás 🎉', html);
  }

  private sendMail(to: string, subject: string, html: string): void {
    this.transporter
      .sendMail({
        to,
        subject,
        html,
      })
      .then(() => {
        this.logger.log(`Sent email to ${to}`);
      })
      .catch((error) => {
        this.logger.error(`Failed to send email to ${to}`, error);
      });
  }
}
