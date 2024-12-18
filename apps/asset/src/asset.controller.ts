import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard, PermissionGuard } from '@ticketpond-backend-nx/auth';
import {
  AssetServiceInterface,
  FileFormDataDto,
  PermissionLevel,
} from '@ticketpond-backend-nx/types';
import { FormDataRequest } from 'nestjs-form-data';

@UseGuards(PermissionGuard(PermissionLevel.MERCHANT))
@UseGuards(JwtGuard)
@ApiTags('Asset')
@Controller()
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
