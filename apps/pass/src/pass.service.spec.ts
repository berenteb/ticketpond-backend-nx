import { Test, TestingModule } from '@nestjs/testing';
import { DeepOrderDto } from '@ticketpond-backend-nx/types';

import { OrderItemMock } from './__mocks__/entities/order-item.mock';
import {
  AppleGeneratorServiceMock,
  ImageServiceMock,
} from './__mocks__/services/pass-generator-service.mock';
import { AppleService } from './apple.service';
import { ImageService } from './image.service';
import { PassService } from './pass.service';

let service: PassService;

beforeEach(async () => {
  jest.clearAllMocks();

  const module: TestingModule = await Test.createTestingModule({
    providers: [
      PassService,
      {
        provide: AppleService,
        useValue: AppleGeneratorServiceMock,
      },
      {
        provide: ImageService,
        useValue: ImageServiceMock,
      },
    ],
  }).compile();

  service = module.get<PassService>(PassService);
});

it('should generate pass for each item with each generator', async () => {
  await service.generatePasses({
    items: [OrderItemMock, OrderItemMock],
  } as DeepOrderDto);

  expect(AppleGeneratorServiceMock.generatePass).toHaveBeenNthCalledWith(
    1,
    OrderItemMock,
  );
  expect(AppleGeneratorServiceMock.generatePass).toHaveBeenNthCalledWith(
    2,
    OrderItemMock,
  );
  expect(ImageServiceMock.generatePass).toHaveBeenNthCalledWith(
    1,
    OrderItemMock,
  );
  expect(ImageServiceMock.generatePass).toHaveBeenNthCalledWith(
    2,
    OrderItemMock,
  );
});
