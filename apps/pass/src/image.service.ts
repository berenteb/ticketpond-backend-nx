import { Injectable, Logger } from '@nestjs/common';
import { DeepOrderItemDto } from '@ticketpond-backend-nx/types';
import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';

import { PassGeneratorInterface } from './pass-generator.interface';

const genFolder = path.resolve(__dirname, '../../static/passes/image');

@Injectable()
export class ImageService implements PassGeneratorInterface {
  private readonly logger = new Logger(ImageService.name);

  constructor() {
    this.createIfNotExists();
  }

  generatePass(orderItem: DeepOrderItemDto): Promise<void> {
    const itemPath = path.resolve(genFolder, `${orderItem.serialNumber}.png`);
    try {
      if (fs.existsSync(itemPath)) return;
      QRCode.toFile(itemPath, orderItem.serialNumber, {
        scale: 20,
      }).then(() => {
        this.logger.log(`QR code generated for ${orderItem.serialNumber}`);
      });
    } catch (e) {
      this.logger.error(e);
    }
  }

  createIfNotExists() {
    if (!fs.existsSync(genFolder)) fs.mkdirSync(genFolder, { recursive: true });
  }
}
