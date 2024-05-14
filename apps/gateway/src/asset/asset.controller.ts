import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  AssetServiceInterface,
  FileFormDataDto,
} from '@ticketpond-backend-nx/types';
import { FormDataRequest } from 'nestjs-form-data';

@ApiTags('asset')
@Controller('asset')
export class AssetController {
  constructor(private readonly assetService: AssetServiceInterface) {}

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
  async uploadFile(@Body() fileFormDataDto: FileFormDataDto): Promise<string> {
    return this.assetService.uploadFile(fileFormDataDto.file);
  }
}
