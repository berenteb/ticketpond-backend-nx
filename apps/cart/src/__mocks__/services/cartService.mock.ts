import { CartServiceInterface } from '@ticketpond-backend-nx/types';

import { CartMock, OrderMock } from '../entities/cart.mock';

export const CartServiceMock: CartServiceInterface = {
  addItemToCart: jest.fn().mockResolvedValue(CartMock),
  addItemToCartForCustomer: jest.fn().mockResolvedValue(CartMock),
  checkout: jest.fn().mockResolvedValue(OrderMock),
  createCartForCustomer: jest.fn().mockResolvedValue(CartMock),
  deleteCart: jest.fn(),
  deleteCartForCustomer: jest.fn(),
  fulfillOrder: jest.fn(),
  getCartById: jest.fn().mockResolvedValue(CartMock),
  getCartForCustomer: jest.fn().mockResolvedValue(CartMock),
  removeItemFromCart: jest.fn().mockResolvedValue(CartMock),
  removeItemFromCartForCustomer: jest.fn().mockResolvedValue(CartMock),
};
