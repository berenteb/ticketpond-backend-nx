import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AssetPatterns } from '@ticketpond-backend-nx/message-patterns';
import {
  FormDataTestDto,
  ServiceNames,
  ServiceResponse,
} from '@ticketpond-backend-nx/types';
import { responseFrom } from '@ticketpond-backend-nx/utils';
import { FormDataRequest } from 'nestjs-form-data';

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
    return responseFrom(
      this.kafkaService.send<ServiceResponse<string>>(
        AssetPatterns.UPLOAD_FILE,
        testDto.file,
      ),
    );
  }
}
