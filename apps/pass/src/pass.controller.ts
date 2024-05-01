import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { PassPatterns } from '@ticketpond-backend-nx/message-patterns';
import { DeepOrderDto } from '@ticketpond-backend-nx/types';

import { PassService } from './pass.service';

@Controller()
export class PassController {
  constructor(private readonly passService: PassService) {}

  @EventPattern(PassPatterns.GENERATE_PASSES)
  async generatePasses(@Payload() data: DeepOrderDto): Promise<void> {
    return this.passService.generatePasses(data);
  }

  @MessagePattern(PassPatterns.GET_QRCODE)
  async getQrcode(
    @Payload() data: { text: string; scale?: number },
  ): Promise<Buffer> {
    return this.passService.getQrcode(data.text, data.scale);
  }
}
