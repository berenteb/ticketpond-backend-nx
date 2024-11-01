import { Test, TestingModule } from '@nestjs/testing';
import { ReqWithUserMock } from '@ticketpond-backend-nx/testing';
import { OrderServiceInterface } from '@ticketpond-backend-nx/types';

import { OrderMock } from './__mocks__/entities/orderMock';
import { OrderServiceMock } from './__mocks__/services/merchant-service.mock';
import { OrderMerchantController } from './order-merchant.controller';

let controller: OrderMerchantController;

beforeEach(async () => {
  jest.clearAllMocks();
  const module: TestingModule = await Test.createTestingModule({
    providers: [{ provide: OrderServiceInterface, useValue: OrderServiceMock }],
    controllers: [OrderMerchantController],
  }).compile();

  controller = module.get<OrderMerchantController>(OrderMerchantController);
});

it('should list orders for merchant', async () => {
  const orders = await controller.getOrders(ReqWithUserMock);
  expect(orders).toEqual([OrderMock]);
  expect(OrderServiceMock.getOrdersForMerchant).toHaveBeenCalledWith(
    ReqWithUserMock.user.merchantId,
  );
});

it('should get order for merchant', async () => {
  const order = await controller.getOrder('1', ReqWithUserMock);
  expect(order).toEqual(OrderMock);
  expect(OrderServiceMock.getOrderByIdWithCustomer).toHaveBeenCalledWith('1');
});
