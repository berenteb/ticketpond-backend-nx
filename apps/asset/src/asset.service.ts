import { Injectable } from '@nestjs/common';
import { AssetServiceInterface } from '@ticketpond-backend-nx/types';
import { generateRandomString } from '@ticketpond-backend-nx/utils';
import fs from 'fs';
import { MemoryStoredFile } from 'nestjs-form-data';
import path from 'path';

@Injectable()
export class AssetService implements AssetServiceInterface {
  private readonly pathName: string;

  constructor() {
    this.pathName = path.resolve(__dirname, '../../static/uploads');
    this.createIfNotExists();
  }

  deleteFile(fileName: string): Promise<void> {
    return fs.promises.rm(path.resolve(this.pathName, fileName));
  }

  async uploadFile(file: MemoryStoredFile): Promise<string> {
    const fileName = generateRandomString(16);
    const fullName = `${fileName}.${file.extension}`;
    await fs.promises.writeFile(
      path.resolve(this.pathName, fullName),
      Buffer.from(file.buffer),
    );
    return fullName;
  }

  createIfNotExists() {
    if (!fs.existsSync(this.pathName))
      fs.mkdirSync(this.pathName, { recursive: true });
  }
}
