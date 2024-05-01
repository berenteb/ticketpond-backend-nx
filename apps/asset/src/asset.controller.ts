import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AssetPatterns } from '@ticketpond-backend-nx/message-patterns';
import { AssetServiceInterface } from '@ticketpond-backend-nx/types';
import { MemoryStoredFile } from 'nestjs-form-data';

@Controller()
export class AssetController {
  constructor(private readonly assetService: AssetServiceInterface) {}

  @MessagePattern(AssetPatterns.DELETE_FILE)
  deleteFile(fileName: string): Promise<void> {
    return this.assetService.deleteFile(fileName);
  }

  @MessagePattern(AssetPatterns.UPLOAD_FILE)
  uploadFile(data: MemoryStoredFile): Promise<string> {
    return this.assetService.uploadFile(data);
  }
}
