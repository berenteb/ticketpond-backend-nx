import { ReqWithUser } from '@ticketpond-backend-nx/types';

export const ConfigServiceMock = {
  get: jest.fn(),
};

export const KafkaMock = {
  send: jest.fn().mockResolvedValue({}),
  emit: jest.fn(),
};

const createDelegateMock = () => {
  return {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  };
};

export const PrismaMock = {
  cart: createDelegateMock(),
  cartItem: createDelegateMock(),
  customer: createDelegateMock(),
  experience: createDelegateMock(),
  merchant: createDelegateMock(),
  merchantOnCustomer: createDelegateMock(),
  order: createDelegateMock(),
  orderItem: createDelegateMock(),
  ticket: createDelegateMock(),
};

export const ReqWithUserMock = {
  user: {
    firstName: 'test-first-name',
    lastName: 'test-last-name',
    email: 'test-email',
    sub: 'test-sub',
    merchantId: 'test-merchant-id',
    permissions: [],
  },
} as unknown as ReqWithUser;
