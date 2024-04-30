import { Test, TestingModule } from '@nestjs/testing';
import { CartDto, OrderServiceInterface } from '@ticketpond-backend-nx/types';

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

it('should get order by id', async () => {
  const order = await controller.getOrder('1');
  expect(order).toEqual(OrderMock);
  expect(OrderServiceMock.getOrderById).toHaveBeenCalledWith('1');
});

it('should get order for customer', async () => {
  const order = await controller.getOrderForCustomer({
    id: '1',
    customerAuthId: '2',
  });
  expect(order).toEqual(OrderMock);
  expect(OrderServiceMock.getOrderByIdForCustomer).toHaveBeenCalledWith(
    '1',
    '2',
  );
});

it('should list orders', async () => {
  const orders = await controller.getOrders();
  expect(orders).toEqual([OrderMock]);
  expect(OrderServiceMock.getOrders).toHaveBeenCalled();
});

it('should list orders for customer', async () => {
  const orders = await controller.getOrdersForCustomer('1');
  expect(orders).toEqual([OrderMock]);
  expect(OrderServiceMock.getOrdersForCustomer).toHaveBeenCalledWith('1');
});

it('should delete order', async () => {
  await controller.deleteOrder('1');
  expect(OrderServiceMock.deleteOrder).toHaveBeenCalledWith('1');
});

it('should create order', async () => {
  const order = await controller.createOrder({} as CartDto);
  expect(order).toEqual(OrderMock);
  expect(OrderServiceMock.createOrder).toHaveBeenCalledWith({});
});

it('should get order with customer', async () => {
  const order = await controller.getOrderWithCustomer('1');
  expect(order).toEqual(OrderMock);
  expect(OrderServiceMock.getOrderByIdWithCustomer).toHaveBeenCalledWith('1');
});

it('should get order with customer for merchant', async () => {
  const order = await controller.getOrderWithCustomerForMerchant({
    id: '1',
    merchantId: '2',
  });
  expect(order).toEqual(OrderMock);
  expect(OrderServiceMock.isConnectedToMerchant).toHaveBeenCalledWith('1', '2');
  expect(OrderServiceMock.getOrderByIdWithCustomer).toHaveBeenCalledWith('1');
});

it('should throw error if merchant is not connected to order', async () => {
  (OrderServiceMock.isConnectedToMerchant as jest.Mock).mockResolvedValue(
    false,
  );
  await expect(
    controller.getOrderWithCustomerForMerchant({
      id: '1',
      merchantId: '2',
    }),
  ).rejects.toThrow();
});

it('should list orders for merchant', async () => {
  const orders = await controller.getOrdersForMerchant('1');
  expect(orders).toEqual([OrderMock]);
  expect(OrderServiceMock.getOrdersForMerchant).toHaveBeenCalledWith('1');
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
