import { Test, TestingModule } from '@nestjs/testing';
import { CartDto, OrderServiceInterface } from '@ticketpond-backend-nx/types';
import { CreateServiceResponse } from '@ticketpond-backend-nx/utils';

import { OrderMock } from './__mocks__/entities/orderMock';
import { OrderServiceMock } from './__mocks__/services/merchant-service.mock';
import { OrderInternalController } from './order-internal.controller';

let controller: OrderInternalController;

beforeEach(async () => {
  jest.clearAllMocks();
  const module: TestingModule = await Test.createTestingModule({
    providers: [{ provide: OrderServiceInterface, useValue: OrderServiceMock }],
    controllers: [OrderInternalController],
  }).compile();

  controller = module.get<OrderInternalController>(OrderInternalController);
});

it('should get order for customer', async () => {
  const order = await controller.getOrderForCustomer({
    id: '1',
    customerAuthId: '2',
  });
  expect(order).toEqual(CreateServiceResponse.success(OrderMock));
  expect(OrderServiceMock.getOrderByIdForCustomer).toHaveBeenCalledWith(
    '1',
    '2',
  );
});

it('should create order', async () => {
  const order = await controller.createOrder({} as CartDto);
  expect(order).toEqual(CreateServiceResponse.success(OrderMock));
  expect(OrderServiceMock.createOrder).toHaveBeenCalledWith({});
});

it('should fulfill order', async () => {
  await controller.fulfillOrder('1');
  expect(OrderServiceMock.fulfillOrder).toHaveBeenCalledWith('1');
});
it('should fail order', async () => {
  await controller.failOrder('1');
  expect(OrderServiceMock.failOrder).toHaveBeenCalledWith('1');
});
