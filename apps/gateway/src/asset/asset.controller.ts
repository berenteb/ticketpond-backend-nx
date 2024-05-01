import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FormDataTestDto, ServiceNames } from '@ticketpond-backend-nx/types';
import { FormDataRequest } from 'nestjs-form-data';
import { firstValueFrom } from 'rxjs';

@ApiTags('asset')
@Controller('asset')
export class AssetController {
  constructor(
    @Inject(ServiceNames.ASSET_SERVICE)
    private readonly assetService: ClientProxy,
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
      this.assetService.send<string>('uploadFile', testDto.file),
    );
  }
}
