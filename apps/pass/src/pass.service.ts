import { Injectable, Logger } from '@nestjs/common';
import {
  DeepOrderDto,
  DeepOrderItemDto,
  PassServiceInterface,
} from '@ticketpond-backend-nx/types';

import { AppleService } from './apple.service';
import { ImageService } from './image.service';

@Injectable()
export class PassService implements PassServiceInterface {
  private readonly logger = new Logger(PassService.name);
  constructor(
    private readonly appleService: AppleService,
    private readonly imageService: ImageService,
  ) {}

  async generatePasses(order: DeepOrderDto): Promise<void> {
    try {
      order.items.forEach((item) => this.generatePassForItem(item));
    } catch (e) {
      this.logger.error(e);
    }
  }

  async generatePassForItem(item: DeepOrderItemDto) {
    await this.appleService.generatePass(item);
    await this.imageService.generatePass(item);
  }
}
