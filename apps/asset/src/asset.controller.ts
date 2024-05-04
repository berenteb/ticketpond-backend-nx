import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { AssetPatterns } from '@ticketpond-backend-nx/message-patterns';
import {
  AssetServiceInterface,
  ServiceResponse,
} from '@ticketpond-backend-nx/types';
import { CreateServiceResponse } from '@ticketpond-backend-nx/utils';
import { MemoryStoredFile } from 'nestjs-form-data';

@Controller()
export class AssetController {
  constructor(private readonly assetService: AssetServiceInterface) {}

  @EventPattern(AssetPatterns.DELETE_FILE)
  deleteFile(@Payload() fileName: string): Promise<void> {
    return this.assetService.deleteFile(fileName);
  }

  @MessagePattern(AssetPatterns.UPLOAD_FILE)
  async uploadFile(
    @Payload() data: MemoryStoredFile,
  ): Promise<ServiceResponse<string>> {
    const fileName = await this.assetService.uploadFile(data);
    return CreateServiceResponse.success(fileName);
  }
}
