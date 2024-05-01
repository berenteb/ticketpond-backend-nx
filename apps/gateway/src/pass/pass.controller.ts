import { Controller, Get, Inject, Param, Res } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { PassPatterns } from '@ticketpond-backend-nx/message-patterns';
import { ServiceNames } from '@ticketpond-backend-nx/types';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';

@ApiTags('pass')
@Controller('pass')
export class PassController {
  constructor(
    @Inject(ServiceNames.KAFKA_SERVICE)
    private readonly kafkaService: ClientKafka,
  ) {}

  @Get('qr/:id')
  async getQrcode(@Param('id') id: string, @Res() res: Response) {
    const qr = await this.generateQrCode(id);
    res.type('png');
    res.send(qr);
  }

  private generateQrCode(text: string, scale = 10) {
    return firstValueFrom(
      this.kafkaService.send<Buffer>(PassPatterns.GET_QRCODE, { text, scale }),
    );
  }
}
