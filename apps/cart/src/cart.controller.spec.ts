import { Test, TestingModule } from '@nestjs/testing';
import { CartServiceInterface } from '@ticketpond-backend-nx/types';
import { CreateServiceResponse } from '@ticketpond-backend-nx/utils';

import { CartMock, OrderMock } from './__mocks__/entities/cart.mock';
import { CartServiceMock } from './__mocks__/services/cartService.mock';
import { CartController } from './cart.controller';

let controller: CartController;

beforeEach(async () => {
  jest.clearAllMocks();
  const module: TestingModule = await Test.createTestingModule({
    providers: [{ provide: CartServiceInterface, useValue: CartServiceMock }],
    controllers: [CartController],
  }).compile();

  controller = module.get<CartController>(CartController);
});

it('should get cart for user by user sub', async () => {
  const cart = await controller.getCartForCustomer('test-user-sub');
  expect(CartServiceMock.getCartForCustomer).toHaveBeenCalledWith(
    'test-user-sub',
  );
  expect(cart).toStrictEqual(CreateServiceResponse.success(CartMock));
});

it('should checkout cart for user by user sub and return payment url', async () => {
  const checkout = await controller.checkoutForCustomer('test-user-sub');
  expect(CartServiceMock.getCartForCustomer).toHaveBeenCalledWith(
    'test-user-sub',
  );
  expect(CartServiceMock.checkout).toHaveBeenCalledWith(CartMock.id);
  expect(checkout).toStrictEqual(
    CreateServiceResponse.success('/payment/order-id'),
  );
});

it('should return error bad request status if cart is empty when checking out cart for user by user sub', async () => {
  (CartServiceMock.getCartForCustomer as jest.Mock).mockResolvedValueOnce({
    ...CartMock,
    items: [],
  });
  const checkout = await controller.checkoutForCustomer('test-user-sub');
  expect(checkout).toStrictEqual(
    CreateServiceResponse.error('Cart is empty', 400),
  );
});

it('should throw if order is undefined when checking out cart for user by user sub', async () => {
  (CartServiceMock.checkout as jest.Mock).mockResolvedValueOnce(undefined);
  const checkout = await controller.checkoutForCustomer('test-user-sub');
  expect(checkout).toStrictEqual(
    CreateServiceResponse.error('Could not checkout', 500),
  );
});

it("should return order url if order's sum is 0 when checking out cart for user by user sub", async () => {
  (CartServiceMock.checkout as jest.Mock).mockResolvedValue({
    ...OrderMock,
    items: [{ ...OrderMock.items[0], price: 0 }],
  });
  const checkout = await controller.checkoutForCustomer('test-user-sub');
  expect(CartServiceMock.getCartForCustomer).toHaveBeenCalledWith(
    'test-user-sub',
  );
  expect(CartServiceMock.checkout).toHaveBeenCalledWith(CartMock.id);
  expect(checkout).toStrictEqual(
    CreateServiceResponse.success('/profile/orders/order-id'),
  );
});

it('should add an item to cart by user', async () => {
  const cart = await controller.addItemToCartForCustomer({
    ticketId: 'test-ticket-id',
    quantity: 1,
    authId: 'test-user-sub',
  });
  expect(CartServiceMock.addItemToCartForCustomer).toHaveBeenCalledWith(
    'test-user-sub',
    'test-ticket-id',
    1,
  );
  expect(cart).toStrictEqual(CreateServiceResponse.success(CartMock));
});

it('should add three items to cart by user', async () => {
  const cart = await controller.addItemToCartForCustomer({
    ticketId: 'test-ticket-id',
    quantity: 3,
    authId: 'test-user-sub',
  });
  expect(CartServiceMock.addItemToCartForCustomer).toHaveBeenCalledWith(
    'test-user-sub',
    'test-ticket-id',
    3,
  );
  expect(cart).toStrictEqual(CreateServiceResponse.success(CartMock));
});

it('should remove an item from cart by user', async () => {
  const cart = await controller.removeItemFromCartForCustomer({
    ticketId: 'test-ticket-id',
    quantity: 1,
    authId: 'test-user-sub',
  });
  expect(CartServiceMock.removeItemFromCartForCustomer).toHaveBeenCalledWith(
    'test-user-sub',
    'test-ticket-id',
    1,
  );
  expect(cart).toStrictEqual(CreateServiceResponse.success(CartMock));
});

it('should remove three items from cart by user', async () => {
  const cart = await controller.removeItemFromCartForCustomer({
    ticketId: 'test-ticket-id',
    quantity: 3,
    authId: 'test-user-sub',
  });
  expect(CartServiceMock.removeItemFromCartForCustomer).toHaveBeenCalledWith(
    'test-user-sub',
    'test-ticket-id',
    3,
  );
  expect(cart).toStrictEqual(CreateServiceResponse.success(CartMock));
});
