import { Test, TestingModule } from '@nestjs/testing';
import { ReqWithUserMock } from '@ticketpond-backend-nx/testing';
import { MerchantServiceInterface } from '@ticketpond-backend-nx/types';

import { MerchantMock } from './__mocks__/entities/merchantMock';
import { MerchantServiceMock } from './__mocks__/services/merchant-service.mock';
import { MerchantSelfController } from './merchant-self.controller';

let controller: MerchantSelfController;

beforeEach(async () => {
  jest.clearAllMocks();
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      { provide: MerchantServiceInterface, useValue: MerchantServiceMock },
    ],
    controllers: [MerchantSelfController],
  }).compile();

  controller = module.get<MerchantSelfController>(MerchantSelfController);
});

it('should get merchant by user id', async () => {
  const merchant = await controller.getMerchantByCustomerId(ReqWithUserMock);
  expect(merchant).toEqual(MerchantMock);
  expect(MerchantServiceMock.getMerchantById).toHaveBeenCalledWith(
    ReqWithUserMock.user.merchantId,
  );
});

it('should update merchant', async () => {
  const merchant = await controller.updateMerchantById(
    MerchantMock,
    ReqWithUserMock,
  );
  expect(merchant).toEqual(MerchantMock);
  expect(MerchantServiceMock.updateMerchant).toHaveBeenCalledWith(
    ReqWithUserMock.user.merchantId,
    MerchantMock,
  );
});
