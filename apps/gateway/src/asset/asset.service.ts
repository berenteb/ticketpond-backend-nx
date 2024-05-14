import { Injectable } from '@nestjs/common';
import { AssetServiceInterface } from '@ticketpond-backend-nx/types';
import { generateRandomString } from '@ticketpond-backend-nx/utils';
import fs from 'fs';
import { MemoryStoredFile } from 'nestjs-form-data';
import path from 'path';

const pathName = path.resolve(__dirname, '../../static/uploads');

@Injectable()
export class AssetService implements AssetServiceInterface {
  constructor() {
    this.createIfNotExists();
  }

  deleteFile(fileName: string): Promise<void> {
    return fs.promises.rm(path.resolve(pathName, fileName));
  }

  async uploadFile(file: MemoryStoredFile): Promise<string> {
    const fileName = generateRandomString(16);
    const fullName = `${fileName}.${file.extension}`;
    await fs.promises.writeFile(
      path.resolve(pathName, fullName),
      Buffer.from(file.buffer),
    );
    return fullName;
  }

  createIfNotExists() {
    if (!fs.existsSync(pathName)) fs.mkdirSync(pathName, { recursive: true });
  }
}
