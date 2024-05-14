import { Test, TestingModule } from '@nestjs/testing';
import fs from 'fs';
import { MemoryStoredFile } from 'nestjs-form-data';

import { AssetService } from './asset.service';

let service: AssetService;

jest.mock('fs', () => ({
  existsSync: jest.fn().mockReturnValue(false),
  mkdirSync: jest.fn(),
  promises: {
    rm: jest.fn(),
    writeFile: jest.fn(),
  },
}));

beforeEach(async () => {
  jest.clearAllMocks();

  const module: TestingModule = await Test.createTestingModule({
    providers: [AssetService],
  }).compile();

  service = module.get<AssetService>(AssetService);
});

it('should not create folder if it already exists', () => {
  (fs.mkdirSync as jest.Mock).mockClear();
  (fs.existsSync as jest.Mock).mockReturnValueOnce(true);
  new AssetService();
  expect(fs.mkdirSync).not.toHaveBeenCalled();
});

it("should create folder on start if it doesn't exist", () => {
  (fs.mkdirSync as jest.Mock).mockClear();
  new AssetService();
  expect(fs.mkdirSync).toHaveBeenCalledWith(expect.any(String), {
    recursive: true,
  });
});

it('should delete file from folder', async () => {
  await service.deleteFile('test.jpg');
  expect(fs.promises.rm).toHaveBeenCalledWith(
    expect.stringContaining('test.jpg'),
  );
});

it("should upload file to folder and return it's name", async () => {
  const file = {
    buffer: Buffer.from('test'),
    extension: 'jpg',
  } as unknown as MemoryStoredFile;
  const result = await service.uploadFile(file);
  expect(result).toMatch(/.{16}\.jpg/);
  expect(fs.promises.writeFile).toHaveBeenCalledWith(
    expect.stringContaining(result),
    file.buffer,
  );
});
