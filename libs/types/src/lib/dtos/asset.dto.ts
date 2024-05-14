import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';

export class FileFormDataDto {
  @IsFile()
  @MaxFileSize(10_000_000)
  @HasMimeType(['image/jpeg', 'image/png'])
  file: MemoryStoredFile;
}
