import { Test, TestingModule } from '@nestjs/testing';
import {
  DeepOrderDto,
  PassServiceInterface,
} from '@ticketpond-backend-nx/types';

import { PassServiceMock } from './__mocks__/services/pass-service.mock';
import { PassController } from './pass.controller';

let controller: PassController;

beforeEach(async () => {
  jest.clearAllMocks();
  const module: TestingModule = await Test.createTestingModule({
    providers: [{ provide: PassServiceInterface, useValue: PassServiceMock }],
    controllers: [PassController],
  }).compile();

  controller = module.get<PassController>(PassController);
});

it('should generate passes with service', async () => {
  const order = {} as DeepOrderDto;
  await controller.generatePasses(order);
  expect(PassServiceMock.generatePasses).toHaveBeenCalledWith(order);
});
