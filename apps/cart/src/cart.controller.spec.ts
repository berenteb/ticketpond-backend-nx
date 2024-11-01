import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ReqWithUserMock } from '@ticketpond-backend-nx/testing';
import { CartServiceInterface } from '@ticketpond-backend-nx/types';
import { Response } from 'express';

import { CartMock, OrderMock } from './__mocks__/entities/cart.mock';
import { CartServiceMock } from './__mocks__/services/cartService.mock';
import { CartController } from './cart.controller';

let controller: CartController;

const ResponseMock = {
  redirect: jest.fn(),
} as unknown as Response;

beforeEach(async () => {
  jest.clearAllMocks();
  const module: TestingModule = await Test.createTestingModule({
    providers: [{ provide: CartServiceInterface, useValue: CartServiceMock }],
    controllers: [CartController],
  }).compile();

  controller = module.get<CartController>(CartController);
});

it('should get cart for user by user sub', async () => {
  const cart = await controller.getCartForCustomer(ReqWithUserMock);
  expect(CartServiceMock.getCartForCustomer).toHaveBeenCalledWith(
    ReqWithUserMock.user.sub,
  );
  expect(cart).toStrictEqual(CartMock);
});

it('should checkout cart for user by user sub and return payment url', async () => {
  await controller.checkoutForCustomer(ReqWithUserMock, ResponseMock);
  expect(CartServiceMock.getCartForCustomer).toHaveBeenCalledWith(
    ReqWithUserMock.user.sub,
  );
  expect(CartServiceMock.checkout).toHaveBeenCalledWith(CartMock.id);
  expect(ResponseMock.redirect).toHaveBeenCalledWith('/payment/order-id');
});

it('should return error bad request status if cart is empty when checking out cart for user by user sub', async () => {
  (CartServiceMock.getCartForCustomer as jest.Mock).mockResolvedValueOnce({
    ...CartMock,
    items: [],
  });
  await expect(async () => {
    await controller.checkoutForCustomer(ReqWithUserMock, ResponseMock);
  }).rejects.toThrow(BadRequestException);
});

it('should throw if order is undefined when checking out cart for user by user sub', async () => {
  (CartServiceMock.checkout as jest.Mock).mockResolvedValueOnce(undefined);

  await expect(async () => {
    await controller.checkoutForCustomer(ReqWithUserMock, ResponseMock);
  }).rejects.toThrow(InternalServerErrorException);
});

it("should return order url if order's sum is 0 when checking out cart for user by user sub", async () => {
  (CartServiceMock.checkout as jest.Mock).mockResolvedValue({
    ...OrderMock,
    items: [{ ...OrderMock.items[0], price: 0 }],
  });
  await controller.checkoutForCustomer(ReqWithUserMock, ResponseMock);
  expect(CartServiceMock.getCartForCustomer).toHaveBeenCalledWith(
    ReqWithUserMock.user.sub,
  );
  expect(CartServiceMock.checkout).toHaveBeenCalledWith(CartMock.id);
});

it('should add an item to cart by user', async () => {
  const cart = await controller.addItemToCartForCustomer(
    {
      ticketId: 'test-ticket-id',
      quantity: 1,
    },
    ReqWithUserMock,
  );
  expect(CartServiceMock.addItemToCartForCustomer).toHaveBeenCalledWith(
    ReqWithUserMock.user.sub,
    'test-ticket-id',
    1,
  );
  expect(cart).toStrictEqual(CartMock);
});

it('should add three items to cart by user', async () => {
  const cart = await controller.addItemToCartForCustomer(
    {
      ticketId: 'test-ticket-id',
      quantity: 3,
    },
    ReqWithUserMock,
  );
  expect(CartServiceMock.addItemToCartForCustomer).toHaveBeenCalledWith(
    ReqWithUserMock.user.sub,
    'test-ticket-id',
    3,
  );
  expect(cart).toStrictEqual(CartMock);
});

it('should remove an item from cart by user', async () => {
  const cart = await controller.removeItemFromCartForCustomer(
    {
      ticketId: 'test-ticket-id',
      quantity: 1,
    },
    ReqWithUserMock,
  );
  expect(CartServiceMock.removeItemFromCartForCustomer).toHaveBeenCalledWith(
    ReqWithUserMock.user.sub,
    'test-ticket-id',
    1,
  );
  expect(cart).toStrictEqual(CartMock);
});

it('should remove three items from cart by user', async () => {
  const cart = await controller.removeItemFromCartForCustomer(
    {
      ticketId: 'test-ticket-id',
      quantity: 3,
    },
    ReqWithUserMock,
  );
  expect(CartServiceMock.removeItemFromCartForCustomer).toHaveBeenCalledWith(
    ReqWithUserMock.user.sub,
    'test-ticket-id',
    3,
  );
  expect(cart).toStrictEqual(CartMock);
});
