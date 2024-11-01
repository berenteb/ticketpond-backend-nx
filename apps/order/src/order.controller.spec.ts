import { Test, TestingModule } from '@nestjs/testing';
import { ReqWithUserMock } from '@ticketpond-backend-nx/testing';
import { OrderServiceInterface } from '@ticketpond-backend-nx/types';

import { OrderMock } from './__mocks__/entities/orderMock';
import { OrderServiceMock } from './__mocks__/services/merchant-service.mock';
import { OrderController } from './order.controller';

let controller: OrderController;

beforeEach(async () => {
  jest.clearAllMocks();
  const module: TestingModule = await Test.createTestingModule({
    providers: [{ provide: OrderServiceInterface, useValue: OrderServiceMock }],
    controllers: [OrderController],
  }).compile();

  controller = module.get<OrderController>(OrderController);
});

it('should get orders for user', async () => {
  const orders = await controller.getOrdersByUser(ReqWithUserMock);
  expect(orders).toEqual([OrderMock]);
  expect(OrderServiceMock.getOrdersForCustomer).toHaveBeenCalledWith(
    ReqWithUserMock.user.sub,
  );
});

it('should get order by id for user', async () => {
  const order = await controller.getOrder('1', ReqWithUserMock);
  expect(order).toEqual(OrderMock);
  expect(OrderServiceMock.getOrderByIdForCustomer).toHaveBeenCalledWith(
    '1',
    ReqWithUserMock.user.sub,
  );
});
