import { MemoryStoredFile } from 'nestjs-form-data';

export abstract class AssetServiceInterface {
  abstract uploadFile(file: MemoryStoredFile): Promise<string>;
  abstract deleteFile(fileName: string): Promise<void>;
}
