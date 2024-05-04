import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PassPatterns } from '@ticketpond-backend-nx/message-patterns';
import {
  DeepOrderDto,
  PassServiceInterface,
} from '@ticketpond-backend-nx/types';

@Controller()
export class PassController {
  constructor(private readonly passService: PassServiceInterface) {}

  @EventPattern(PassPatterns.GENERATE_PASSES)
  async generatePasses(@Payload() data: DeepOrderDto): Promise<void> {
    return this.passService.generatePasses(data);
  }
}
