import { Test, TestingModule } from '@nestjs/testing';
import { ReqWithUserMock } from '@ticketpond-backend-nx/testing';
import { MerchantServiceInterface } from '@ticketpond-backend-nx/types';

import { MerchantMock } from './__mocks__/entities/merchantMock';
import { MerchantServiceMock } from './__mocks__/services/merchant-service.mock';
import { MerchantController } from './merchant.controller';

let controller: MerchantController;

beforeEach(async () => {
  jest.clearAllMocks();
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      { provide: MerchantServiceInterface, useValue: MerchantServiceMock },
    ],
    controllers: [MerchantController],
  }).compile();

  controller = module.get<MerchantController>(MerchantController);
});

it('should get merchant by id', async () => {
  const merchant = await controller.getMerchant('1');
  expect(merchant).toEqual(MerchantMock);
  expect(MerchantServiceMock.getMerchantById).toHaveBeenCalledWith('1');
});

it('should create merchant', async () => {
  const merchant = await controller.registerMerchant(
    MerchantMock,
    ReqWithUserMock,
  );
  expect(merchant).toEqual(MerchantMock);
  expect(MerchantServiceMock.createMerchant).toHaveBeenCalledWith(MerchantMock);
});
