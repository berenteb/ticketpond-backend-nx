import { Test, TestingModule } from '@nestjs/testing';
import { MerchantServiceInterface } from '@ticketpond-backend-nx/types';

import { MerchantMock } from './__mocks__/entities/merchantMock';
import { MerchantServiceMock } from './__mocks__/services/merchant-service.mock';
import { MerchantAdminController } from './merchant-admin.controller';

let controller: MerchantAdminController;

beforeEach(async () => {
  jest.clearAllMocks();
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      { provide: MerchantServiceInterface, useValue: MerchantServiceMock },
    ],
    controllers: [MerchantAdminController],
  }).compile();

  controller = module.get<MerchantAdminController>(MerchantAdminController);
});

it('should list merchants', async () => {
  const merchants = await controller.getMerchants();
  expect(merchants).toEqual([MerchantMock]);
  expect(MerchantServiceMock.getMerchants).toHaveBeenCalled();
});

it('should get merchant by id', async () => {
  const merchant = await controller.getMerchant('1');
  expect(merchant).toEqual(MerchantMock);
  expect(MerchantServiceMock.getMerchantById).toHaveBeenCalledWith('1');
});

it('should create merchant', async () => {
  const merchant = await controller.createMerchant(MerchantMock);
  expect(merchant).toEqual(MerchantMock);
  expect(MerchantServiceMock.createMerchant).toHaveBeenCalledWith(MerchantMock);
});

it('should update merchant', async () => {
  const merchant = await controller.updateMerchant('1', MerchantMock);
  expect(merchant).toEqual(MerchantMock);
  expect(MerchantServiceMock.updateMerchant).toHaveBeenCalledWith(
    '1',
    MerchantMock,
  );
});

it('should delete merchant', async () => {
  await controller.deleteMerchant('1');
  expect(MerchantServiceMock.deleteMerchant).toHaveBeenCalledWith('1');
});
