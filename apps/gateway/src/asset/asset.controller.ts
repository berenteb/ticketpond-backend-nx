import { Body, Controller, Inject, OnModuleInit, Post } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AssetPatterns } from '@ticketpond-backend-nx/message-patterns';
import { FormDataTestDto, ServiceNames } from '@ticketpond-backend-nx/types';
import { FormDataRequest } from 'nestjs-form-data';
import { firstValueFrom } from 'rxjs';

@ApiTags('asset')
@Controller('asset')
export class AssetController implements OnModuleInit {
  constructor(
    @Inject(ServiceNames.ASSET_SERVICE)
    private readonly assetService: ClientKafka,
  ) {}

  async onModuleInit() {
    this.assetService.subscribeToResponseOf(AssetPatterns.UPLOAD_FILE);
    await this.assetService.connect();
  }

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
      this.assetService.send<string>(AssetPatterns.UPLOAD_FILE, testDto.file),
    );
  }
}
