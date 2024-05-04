import { Test, TestingModule } from '@nestjs/testing';
import { OrderPatterns } from '@ticketpond-backend-nx/message-patterns';
import { PrismaService } from '@ticketpond-backend-nx/prisma';
import { KafkaMock, PrismaMock } from '@ticketpond-backend-nx/testing';
import { ServiceNames } from '@ticketpond-backend-nx/types';

import { CartMock, OrderMock } from './__mocks__/entities/cart.mock';
import { CartService } from './cart.service';

let service: CartService;

jest.mock('rxjs', () => ({
  firstValueFrom: jest.fn(() => Promise.resolve(OrderMock)),
}));

beforeEach(async () => {
  jest.clearAllMocks();
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      CartService,
      { provide: PrismaService, useValue: PrismaMock },
      { provide: ServiceNames.KAFKA_SERVICE, useValue: KafkaMock },
    ],
  }).compile();

  service = module.get<CartService>(CartService);
});

it('should return cart', async () => {
  PrismaMock.cart.findUnique.mockResolvedValue(CartMock);

  const cart = await service.getCartById('test-cart-id');
  expect(PrismaMock.cart.findUnique).toHaveBeenCalledWith({
    where: { id: 'test-cart-id' },
    include: {
      items: { include: { ticket: { include: { experience: true } } } },
    },
  });
  expect(cart).toBe(CartMock);
});

it('should throw not found exception if cart is undefined', () => {
  PrismaMock.cart.findUnique.mockResolvedValue(undefined);

  expect(service.getCartById('test-cart-id')).rejects.toThrow();
});

it('should create cart with customer id', async () => {
  PrismaMock.cart.create.mockResolvedValue(CartMock);

  const cart = await service.createCartForCustomer('test-customer-id');
  expect(PrismaMock.cart.create).toHaveBeenCalledWith({
    data: {
      customer: {
        connect: { authId: 'test-customer-id' },
      },
    },
    include: {
      items: { include: { ticket: { include: { experience: true } } } },
    },
  });
  expect(cart).toBe(CartMock);
});

it('should return cart for customer', async () => {
  PrismaMock.cart.findFirst.mockResolvedValue(CartMock);

  const cart = await service.getCartForCustomer('test-customer-id');
  expect(PrismaMock.cart.findFirst).toHaveBeenCalledWith({
    where: {
      customer: {
        authId: 'test-customer-id',
      },
    },
    include: {
      items: { include: { ticket: { include: { experience: true } } } },
    },
  });
  expect(cart).toBe(CartMock);
});

it('should create a cart if cart not found for customer', async () => {
  PrismaMock.cart.findFirst.mockResolvedValue(undefined);
  PrismaMock.cart.create.mockResolvedValue(CartMock);

  const cart = await service.getCartForCustomer('test-customer-id');
  expect(PrismaMock.cart.create).toHaveBeenCalledWith({
    data: {
      customer: {
        connect: {
          authId: 'test-customer-id',
        },
      },
    },
    include: {
      items: { include: { ticket: { include: { experience: true } } } },
    },
  });
  expect(cart).toBe(CartMock);
});

it('should delete cart', async () => {
  await service.deleteCart('test-cart-id');
  expect(PrismaMock.cart.delete).toHaveBeenCalledWith({
    where: { id: 'test-cart-id' },
  });
});

it('should delete cart for customer', async () => {
  await service.deleteCartForCustomer('test-customer-id');
  expect(PrismaMock.cart.deleteMany).toHaveBeenCalledWith({
    where: { customer: { authId: 'test-customer-id' } },
  });
});

it('should add an item to cart', async () => {
  PrismaMock.cart.findUnique.mockResolvedValue(CartMock);
  await service.addItemToCart('test-cart-id', 'test-ticket-id', 1);
  expect(PrismaMock.cartItem.create).toHaveBeenCalledTimes(1);
  expect(PrismaMock.cartItem.create).toHaveBeenCalledWith({
    data: { cartId: 'test-cart-id', ticketId: 'test-ticket-id' },
  });
});

it('should add three items to cart', async () => {
  PrismaMock.cart.findUnique.mockResolvedValue(CartMock);

  await service.addItemToCart('test-cart-id', 'test-ticket-id', 3);
  expect(PrismaMock.cartItem.create).toHaveBeenCalledTimes(3);
  expect(PrismaMock.cartItem.create).toHaveBeenNthCalledWith(1, {
    data: { cartId: 'test-cart-id', ticketId: 'test-ticket-id' },
  });
  expect(PrismaMock.cartItem.create).toHaveBeenNthCalledWith(2, {
    data: { cartId: 'test-cart-id', ticketId: 'test-ticket-id' },
  });
  expect(PrismaMock.cartItem.create).toHaveBeenNthCalledWith(3, {
    data: { cartId: 'test-cart-id', ticketId: 'test-ticket-id' },
  });
});

it('should add item to cart for customer', async () => {
  PrismaMock.cart.findUnique.mockResolvedValue(CartMock);

  await service.addItemToCartForCustomer(
    'test-customer-id',
    'test-ticket-id',
    1,
  );
  expect(PrismaMock.cartItem.create).toHaveBeenCalledTimes(1);
  expect(PrismaMock.cartItem.create).toHaveBeenCalledWith({
    data: { cartId: 'cart-id', ticketId: 'test-ticket-id' },
  });
});

it('should add three items to cart for customer', async () => {
  PrismaMock.cart.findUnique.mockResolvedValue(CartMock);

  await service.addItemToCartForCustomer(
    'test-customer-id',
    'test-ticket-id',
    3,
  );
  expect(PrismaMock.cartItem.create).toHaveBeenCalledTimes(3);
  expect(PrismaMock.cartItem.create).toHaveBeenNthCalledWith(1, {
    data: { cartId: 'cart-id', ticketId: 'test-ticket-id' },
  });
  expect(PrismaMock.cartItem.create).toHaveBeenNthCalledWith(2, {
    data: { cartId: 'cart-id', ticketId: 'test-ticket-id' },
  });
  expect(PrismaMock.cartItem.create).toHaveBeenNthCalledWith(3, {
    data: { cartId: 'cart-id', ticketId: 'test-ticket-id' },
  });
});

it('should remove an item from cart if at least one exists', async () => {
  PrismaMock.cart.findUnique.mockResolvedValue(CartMock);
  PrismaMock.cartItem.findFirst.mockResolvedValue({ id: 'test-cart-item-id' });

  await service.removeItemFromCart('test-cart-id', 'test-ticket-id', 1);
  expect(PrismaMock.cartItem.delete).toHaveBeenCalledTimes(1);
  expect(PrismaMock.cartItem.delete).toHaveBeenCalledWith({
    where: { id: 'test-cart-item-id' },
  });
});

it('should not remove anything from cart if none exists', async () => {
  PrismaMock.cart.findUnique.mockResolvedValue(CartMock);
  PrismaMock.cartItem.findFirst.mockResolvedValue(undefined);

  await service.removeItemFromCart('test-cart-id', 'test-ticket-id', 1);
  expect(PrismaMock.cartItem.delete).toHaveBeenCalledTimes(0);
});

it('should remove three items from cart if at least three exist', async () => {
  PrismaMock.cart.findUnique.mockResolvedValue(CartMock);
  PrismaMock.cartItem.findFirst.mockResolvedValue({ id: 'test-cart-item-id' });

  await service.removeItemFromCart('test-cart-id', 'test-ticket-id', 3);
  expect(PrismaMock.cartItem.delete).toHaveBeenCalledTimes(3);
  expect(PrismaMock.cartItem.delete).toHaveBeenNthCalledWith(1, {
    where: { id: 'test-cart-item-id' },
  });
  expect(PrismaMock.cartItem.delete).toHaveBeenNthCalledWith(2, {
    where: { id: 'test-cart-item-id' },
  });
  expect(PrismaMock.cartItem.delete).toHaveBeenNthCalledWith(3, {
    where: { id: 'test-cart-item-id' },
  });
});

it('should remove an item from cart for customer if at least one exists', async () => {
  PrismaMock.cart.findUnique.mockResolvedValue(CartMock);
  PrismaMock.cartItem.findFirst.mockResolvedValue({ id: 'test-cart-item-id' });

  await service.removeItemFromCartForCustomer(
    'test-customer-id',
    'test-ticket-id',
    1,
  );
  expect(PrismaMock.cartItem.delete).toHaveBeenCalledTimes(1);
  expect(PrismaMock.cartItem.delete).toHaveBeenCalledWith({
    where: { id: 'test-cart-item-id' },
  });
});

it('should remove three items from cart for customer if at least three exist', async () => {
  PrismaMock.cart.findUnique.mockResolvedValue(CartMock);
  PrismaMock.cartItem.findFirst.mockResolvedValue({ id: 'test-cart-item-id' });

  await service.removeItemFromCartForCustomer(
    'test-customer-id',
    'test-ticket-id',
    3,
  );
  expect(PrismaMock.cartItem.delete).toHaveBeenCalledTimes(3);
  expect(PrismaMock.cartItem.delete).toHaveBeenNthCalledWith(1, {
    where: { id: 'test-cart-item-id' },
  });
  expect(PrismaMock.cartItem.delete).toHaveBeenNthCalledWith(2, {
    where: { id: 'test-cart-item-id' },
  });
  expect(PrismaMock.cartItem.delete).toHaveBeenNthCalledWith(3, {
    where: { id: 'test-cart-item-id' },
  });
});

it('should get cart, create order and delete cart, then return order', async () => {
  PrismaMock.cart.findUnique.mockResolvedValue(CartMock);

  const order = await service.checkout('test-cart-id');
  expect(PrismaMock.cart.findUnique).toHaveBeenCalledWith({
    where: { id: 'test-cart-id' },
    include: {
      items: { include: { ticket: { include: { experience: true } } } },
    },
  });
  expect(KafkaMock.send).toHaveBeenCalledWith(
    OrderPatterns.CREATE_ORDER,
    CartMock,
  );
  expect(PrismaMock.cart.delete).toHaveBeenCalledWith({
    where: { id: 'test-cart-id' },
  });
  expect(order).toEqual(OrderMock);
});
