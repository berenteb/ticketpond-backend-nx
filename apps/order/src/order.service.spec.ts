import { Test, TestingModule } from '@nestjs/testing';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { PrismaService } from '@ticketpond-backend-nx/prisma';
import {
  CartDto,
  CartItemDto,
  DeepTicketDto,
} from '@ticketpond-backend-nx/types';

import { PrismaMock } from '../../merchant/src/__mocks__/services/prisma.mock';
import { OrderMock } from './__mocks__/entities/orderMock';
import { OrderService } from './order.service';

const ticket: DeepTicketDto = {
  experience: undefined,
  description: 'ticket description',
  experienceId: 'experienceId',
  name: 'ticket name',
  validFrom: new Date(),
  validTo: new Date(),
  id: 'ticketId',
  price: 100,
};
const cartItem: CartItemDto = {
  cartId: 'cartId',
  id: 'cartItemId',
  ticket: ticket,
  ticketId: ticket.id,
};
const cart: CartDto = {
  customerId: 'customerId',
  id: 'cartId',
  items: [cartItem],
};

let service: OrderService;

beforeEach(async () => {
  jest.clearAllMocks();
  const module: TestingModule = await Test.createTestingModule({
    providers: [OrderService, { provide: PrismaService, useValue: PrismaMock }],
  }).compile();

  service = module.get<OrderService>(OrderService);
});

it('should return order by id with items', async () => {
  PrismaMock.order.findUnique.mockResolvedValue(OrderMock);
  const order = await service.getOrderById('1');
  expect(order).toEqual(OrderMock);
  expect(PrismaMock.order.findUnique).toBeCalledWith({
    where: { id: '1' },
    include: {
      items: { include: { ticket: { include: { experience: true } } } },
    },
  });
});

it('should throw not found exception when order not found by id', async () => {
  PrismaMock.order.findUnique.mockResolvedValue(null);
  await expect(service.getOrderById('1')).rejects.toThrowError(
    'Order with id 1 not found',
  );
});

it('should return order by id with items for customer', async () => {
  PrismaMock.order.findFirst.mockResolvedValue(OrderMock);
  const order = await service.getOrderByIdForCustomer('1', '1');
  expect(order).toEqual(OrderMock);
  expect(PrismaMock.order.findFirst).toBeCalledWith({
    where: { id: '1', customerId: '1' },
    include: {
      items: { include: { ticket: { include: { experience: true } } } },
    },
  });
});

it('should throw not found exception when order not found by id for customer', async () => {
  PrismaMock.order.findFirst.mockResolvedValue(null);
  await expect(service.getOrderByIdForCustomer('1', '1')).rejects.toThrowError(
    'Order with id 1 not found',
  );
});

it('should return orders with items and customer', async () => {
  PrismaMock.order.findMany.mockResolvedValue([OrderMock]);
  const orders = await service.getOrders();
  expect(orders).toEqual([OrderMock]);
  expect(PrismaMock.order.findMany).toBeCalledWith({
    include: {
      items: { include: { ticket: { include: { experience: true } } } },
      customer: true,
    },
  });
});

it('should return orders for customer', async () => {
  PrismaMock.order.findMany.mockResolvedValue([OrderMock]);
  const orders = await service.getOrdersForCustomer('1');
  expect(orders).toEqual([OrderMock]);
  expect(PrismaMock.order.findMany).toBeCalledWith({
    where: { customerId: '1' },
    include: { items: true },
  });
});

it('should delete order and order items by id', async () => {
  await service.deleteOrder('1');
  expect(PrismaMock.order.delete).toBeCalledWith({ where: { id: '1' } });
  expect(PrismaMock.orderItem.deleteMany).toBeCalledWith({
    where: { orderId: '1' },
  });
});

it('should fulfill order by id', async () => {
  PrismaMock.order.update.mockResolvedValue(OrderMock);
  await service.fulfillOrder('1');
  expect(PrismaMock.order.update).toBeCalledWith({
    where: { id: '1' },
    data: {
      orderStatus: OrderStatus.PAID,
      paymentStatus: PaymentStatus.SUCCESS,
    },
    include: {
      items: { include: { ticket: { include: { experience: true } } } },
      customer: true,
    },
  });
});

it('should cancel order by id', async () => {
  PrismaMock.order.update.mockResolvedValue(OrderMock);
  await service.cancelOrder('1');
  expect(PrismaMock.order.update).toBeCalledWith({
    where: { id: '1' },
    data: {
      orderStatus: OrderStatus.CANCELLED,
    },
  });
});

it('should fail order', async () => {
  await service.failOrder('1');
  expect(PrismaMock.order.update).toBeCalledWith({
    where: { id: '1' },
    data: { paymentStatus: PaymentStatus.FAIL },
  });
});

it('should return true if order is connected to merchant', async () => {
  PrismaMock.order.findFirst.mockResolvedValue(OrderMock);
  const isConnected = await service.isConnectedToMerchant('1', '1');
  expect(isConnected).toBe(true);
});

it('should return false if order is not connected to merchant', async () => {
  PrismaMock.order.findFirst.mockResolvedValue(null);
  const isConnected = await service.isConnectedToMerchant('1', '1');
  expect(isConnected).toBe(false);
});

it('should create order from cart with default statuses', async () => {
  PrismaMock.order.create.mockResolvedValue(OrderMock);
  const order = await service.createOrder(cart);
  expect(order).toEqual(OrderMock);
  expect(PrismaMock.order.create).toBeCalledWith({
    data: {
      customerId: cart.customerId,
      serialNumber: expect.any(String),
      items: {
        create: cart.items.map((item) => ({
          ticketId: item.ticketId,
          price: item.ticket.price,
          serialNumber: expect.any(String),
        })),
      },
    },
    include: {
      items: { include: { ticket: { include: { experience: true } } } },
    },
  });
});

it('should create order from cart with paid and success statuses', async () => {
  PrismaMock.order.create.mockResolvedValue(OrderMock);
  const freeTicket = { ...ticket, price: 0 };
  const freeCartItem = { ...cartItem, ticket: freeTicket };
  const freeCart = { ...cart, items: [freeCartItem] };

  const order = await service.createOrder(freeCart);
  expect(order).toEqual(OrderMock);
  expect(PrismaMock.order.create).toBeCalledWith({
    data: {
      customerId: freeCart.customerId,
      serialNumber: expect.any(String),
      items: {
        create: freeCart.items.map((item) => ({
          ticketId: item.ticketId,
          price: item.ticket.price,
          serialNumber: expect.any(String),
        })),
      },
      orderStatus: OrderStatus.PAID,
      paymentStatus: PaymentStatus.SUCCESS,
    },
    include: {
      items: { include: { ticket: { include: { experience: true } } } },
    },
  });
});