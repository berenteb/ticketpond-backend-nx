import { Customer } from '@prisma/client';

export const CustomerMock: Customer = {
  address: 'test-customer-address',
  email: 'test-customer-email',
  firstName: 'test-customer-first-name',
  id: 'test-customer-id',
  authId: 'test-customer-auth-id',
  lastName: 'test-customer-last-name',
  phone: 'test-customer-phone-number',
};
