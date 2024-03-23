const createDelegateMock = () => {
  return {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
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
