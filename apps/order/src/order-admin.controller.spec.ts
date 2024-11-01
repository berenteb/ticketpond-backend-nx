import { Test, TestingModule } from '@nestjs/testing';
import { OrderServiceInterface } from '@ticketpond-backend-nx/types';

import { OrderMock } from './__mocks__/entities/orderMock';
import { OrderServiceMock } from './__mocks__/services/merchant-service.mock';
import { OrderAdminController } from './order-admin.controller';

let controller: OrderAdminController;

beforeEach(async () => {
  jest.clearAllMocks();
  const module: TestingModule = await Test.createTestingModule({
    providers: [{ provide: OrderServiceInterface, useValue: OrderServiceMock }],
    controllers: [OrderAdminController],
  }).compile();

  controller = module.get<OrderAdminController>(OrderAdminController);
});

it('should list orders', async () => {
  const orders = await controller.getOrders();
  expect(orders).toEqual([OrderMock]);
  expect(OrderServiceMock.getOrders).toHaveBeenCalled();
});

it('should get order by id', async () => {
  const order = await controller.getOrder('1');
  expect(order).toEqual(OrderMock);
  expect(OrderServiceMock.getOrderByIdWithCustomer).toHaveBeenCalledWith('1');
});

it('should delete order', async () => {
  await controller.deleteOrder('1');
  expect(OrderServiceMock.deleteOrder).toHaveBeenCalledWith('1');
});

it('should fulfill order', async () => {
  await controller.fulfillOrder('1');
  expect(OrderServiceMock.fulfillOrder).toHaveBeenCalledWith('1');
});

it('should cancel order', async () => {
  await controller.cancelOrder('1');
  expect(OrderServiceMock.cancelOrder).toHaveBeenCalledWith('1');
});

it('should fail order', async () => {
  await controller.failOrder('1');
  expect(OrderServiceMock.failOrder).toHaveBeenCalledWith('1');
});
