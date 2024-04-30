import { Test, TestingModule } from '@nestjs/testing';
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

it('should list merchants', async () => {
  const merchants = await controller.listMerchants();
  expect(merchants).toEqual([MerchantMock]);
  expect(MerchantServiceMock.getMerchants).toHaveBeenCalled();
});

it('should get merchant by id', async () => {
  const merchant = await controller.getMerchant('1');
  expect(merchant).toEqual(MerchantMock);
  expect(MerchantServiceMock.getMerchantById).toHaveBeenCalledWith('1');
});

it('should get merchant by user id', async () => {
  const merchant = await controller.getMerchantByUserId('1');
  expect(merchant).toEqual(MerchantMock);
  expect(MerchantServiceMock.getMerchantByCustomerAuthId).toHaveBeenCalledWith(
    '1',
  );
});

it('should create merchant', async () => {
  const merchant = await controller.createMerchant(MerchantMock);
  expect(merchant).toEqual(MerchantMock);
  expect(MerchantServiceMock.createMerchant).toHaveBeenCalledWith(MerchantMock);
});

it('should assign customer to merchant', async () => {
  await controller.assignCustomerToMerchant({
    merchantId: '1',
    customerAuthId: '2',
  });
  expect(MerchantServiceMock.assignCustomerToMerchant).toHaveBeenCalledWith(
    '1',
    '2',
  );
});

it('should update merchant', async () => {
  const merchant = await controller.updateMerchant({
    id: '1',
    merchant: MerchantMock,
  });
  expect(merchant).toEqual(MerchantMock);
  expect(MerchantServiceMock.updateMerchant).toHaveBeenCalledWith(
    '1',
    MerchantMock,
  );
});

it('should update merchant by user id', async () => {
  const merchant = await controller.updateMerchantByUserId({
    userId: '1',
    merchant: MerchantMock,
  });
  expect(merchant).toEqual(MerchantMock);
  expect(
    MerchantServiceMock.updateMerchantByCustomerAuthId,
  ).toHaveBeenCalledWith('1', MerchantMock);
});

it('should delete merchant', async () => {
  await controller.deleteMerchant('1');
  expect(MerchantServiceMock.deleteMerchant).toHaveBeenCalledWith('1');
});
