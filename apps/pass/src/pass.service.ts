import { Injectable, Logger } from '@nestjs/common';
import {
  DeepOrderDto,
  PassServiceInterface,
} from '@ticketpond-backend-nx/types';
import QRCode from 'qrcode';

import { AppleService } from './apple.service';

@Injectable()
export class PassService implements PassServiceInterface {
  private readonly logger = new Logger(PassService.name);
  constructor(private readonly appleService: AppleService) {}

  async generatePasses(order: DeepOrderDto): Promise<void> {
    try {
      order.items.forEach((item) => this.appleService.generatePass(item));
    } catch (e) {
      this.logger.error(e);
    }
  }

  async getQrcode(text: string, scale = 10): Promise<Buffer> {
    try {
      return await QRCode.toBuffer(text, { scale });
    } catch (e) {
      this.logger.error(e);
    }
  }
}
