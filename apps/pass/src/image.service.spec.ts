import { Test, TestingModule } from '@nestjs/testing';
import { DeepOrderItemDto } from '@ticketpond-backend-nx/types';
import fs from 'fs';
import QRCode from 'qrcode';

import { ImageService } from './image.service';

jest.mock('qrcode', () => ({
  toFile: jest.fn().mockImplementation(() => Promise.resolve()),
}));

let service: ImageService;

jest.mock('fs', () => ({
  existsSync: jest.fn().mockReturnValue(false),
  mkdirSync: jest.fn(),
}));

beforeEach(async () => {
  jest.clearAllMocks();

  const module: TestingModule = await Test.createTestingModule({
    providers: [ImageService],
  }).compile();

  service = module.get<ImageService>(ImageService);
});

it('should not create folder if it already exists', () => {
  (fs.mkdirSync as jest.Mock).mockClear();
  (fs.existsSync as jest.Mock).mockReturnValueOnce(true);
  new ImageService();
  expect(fs.mkdirSync).not.toHaveBeenCalled();
});

it("should create folder on start if it doesn't exist", () => {
  (fs.mkdirSync as jest.Mock).mockClear();
  new ImageService();
  expect(fs.mkdirSync).toHaveBeenCalledWith(expect.any(String), {
    recursive: true,
  });
});

it("should generate QR code to file with orderItem's serial number if not exists", async () => {
  const orderItem = { serialNumber: '123' } as DeepOrderItemDto;
  (fs.existsSync as jest.Mock).mockReturnValueOnce(false);

  await service.generatePass(orderItem);

  expect(QRCode.toFile).toHaveBeenCalledWith(
    expect.any(String),
    orderItem.serialNumber,
    { scale: 20 },
  );
});

it('should not generate QR code if already exists', async () => {
  const orderItem = { serialNumber: '123' } as DeepOrderItemDto;
  (fs.existsSync as jest.Mock).mockReturnValueOnce(true);
  await service.generatePass(orderItem);
  expect(QRCode.toFile).not.toHaveBeenCalled();
});
