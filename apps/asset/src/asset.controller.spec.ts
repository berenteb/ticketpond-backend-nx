import { Test, TestingModule } from '@nestjs/testing';
import { AssetServiceInterface } from '@ticketpond-backend-nx/types';
import { CreateServiceResponse } from '@ticketpond-backend-nx/utils';
import { MemoryStoredFile } from 'nestjs-form-data';

import { AssetServiceMock } from './__mocks__/services/asset-service.mock';
import { AssetController } from './asset.controller';

let controller: AssetController;

beforeEach(async () => {
  jest.clearAllMocks();
  const module: TestingModule = await Test.createTestingModule({
    providers: [{ provide: AssetServiceInterface, useValue: AssetServiceMock }],
    controllers: [AssetController],
  }).compile();

  controller = module.get<AssetController>(AssetController);
});

it('should upload file', async () => {
  (AssetServiceMock.uploadFile as jest.Mock).mockResolvedValue('fileName.jpg');
  const data = {} as MemoryStoredFile;

  const response = await controller.uploadFile(data);
  expect(response).toEqual(CreateServiceResponse.success('fileName.jpg'));
});

it('should delete file', async () => {
  (AssetServiceMock.deleteFile as jest.Mock).mockResolvedValue(undefined);
  const data = 'fileName.jpg';

  await expect(controller.deleteFile(data)).resolves.not.toThrow();
});
