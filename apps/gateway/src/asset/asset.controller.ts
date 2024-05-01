import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AssetPatterns } from '@ticketpond-backend-nx/message-patterns';
import { FormDataTestDto, ServiceNames } from '@ticketpond-backend-nx/types';
import { FormDataRequest } from 'nestjs-form-data';
import { firstValueFrom } from 'rxjs';

@ApiTags('asset')
@Controller('asset')
export class AssetController {
  constructor(
    @Inject(ServiceNames.KAFKA_SERVICE)
    private readonly kafkaService: ClientKafka,
  ) {}

  @Post('upload')
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOkResponse({ type: String })
  async uploadFile(@Body() testDto: FormDataTestDto): Promise<string> {
    return firstValueFrom(
      this.kafkaService.send<string>(AssetPatterns.UPLOAD_FILE, testDto.file),
    );
  }
}
