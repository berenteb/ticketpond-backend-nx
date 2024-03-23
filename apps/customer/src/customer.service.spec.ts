import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@ticketpond-backend-nx/prisma';
import { NotificationServiceInterface } from '@ticketpond-backend-nx/types';

import { CustomerMock } from './__mocks__/entities/customer.mock';
import { NotificationServiceMock } from './__mocks__/services/notificationService.mock';
import { PrismaMock } from './__mocks__/services/prisma.mock';
import { CustomerService } from './customer.service';

let service: CustomerService;

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      CustomerService,
      { provide: PrismaService, useValue: PrismaMock },
      {
        provide: NotificationServiceInterface,
        useValue: NotificationServiceMock,
      },
    ],
  }).compile();

  service = module.get<CustomerService>(CustomerService);
});

it('should create customer with custom id and send welcome email', async () => {
  PrismaMock.customer.create.mockResolvedValue(CustomerMock);
  await service.createCustomer(CustomerMock, 'custom-id');
  expect(PrismaMock.customer.create).toHaveBeenCalledWith({
    data: { ...CustomerMock, authId: 'custom-id' },
  });
  // expect(NotificationServiceMock.sendWelcome).toHaveBeenCalledWith(
  //   CustomerMock,
  // );
});

it('should call delete customer with id', async () => {
  await service.deleteCustomer('test-customer-id');
  expect(PrismaMock.customer.delete).toHaveBeenCalledWith({
    where: { id: 'test-customer-id' },
  });
});

it('should get customer by id', async () => {
  PrismaMock.customer.findUnique.mockResolvedValue(CustomerMock);
  const customer = await service.getCustomerById('test-customer-id');
  expect(PrismaMock.customer.findUnique).toHaveBeenCalledWith({
    where: { id: 'test-customer-id' },
  });
  expect(customer).toEqual(CustomerMock);
});

it('should throw not found exception when getting customer by id', async () => {
  PrismaMock.customer.findUnique.mockResolvedValue(null);
  await expect(
    service.getCustomerById('test-customer-id'),
  ).rejects.toThrowError('Customer with id test-customer-id not found');
});

it('should get customer by internal id', async () => {
  PrismaMock.customer.findUnique.mockResolvedValue(CustomerMock);
  const customer = await service.getCustomerByAuthId('test-customer-auth-id');
  expect(PrismaMock.customer.findUnique).toHaveBeenCalledWith({
    where: { id: 'test-customer-id' },
  });
  expect(customer).toEqual(CustomerMock);
});

it('should throw not found exception when getting customer by internal id', async () => {
  PrismaMock.customer.findUnique.mockResolvedValue(null);
  await expect(
    service.getCustomerByAuthId('test-customer-auth-id'),
  ).rejects.toThrowError(
    'Customer with authId test-customer-auth-id not found',
  );
});

it('should get customers', async () => {
  PrismaMock.customer.findMany.mockResolvedValue([CustomerMock]);
  const customers = await service.getCustomers();
  expect(PrismaMock.customer.findMany).toHaveBeenCalled();
  expect(customers).toEqual([CustomerMock]);
});

it('should update customer by id', async () => {
  PrismaMock.customer.update.mockResolvedValue(CustomerMock);
  const customer = await service.updateCustomer(
    'test-customer-id',
    CustomerMock,
  );
  expect(PrismaMock.customer.update).toHaveBeenCalledWith({
    where: { id: 'test-customer-id' },
    data: CustomerMock,
  });
  expect(customer).toEqual(CustomerMock);
});

it('should update customer by internal id', async () => {
  PrismaMock.customer.update.mockResolvedValue(CustomerMock);
  const customer = await service.updateCustomerByAuthId(
    'test-customer-auth-id',
    CustomerMock,
  );
  expect(PrismaMock.customer.update).toHaveBeenCalledWith({
    where: { authId: 'test-customer-auth-id' },
    data: CustomerMock,
  });
  expect(customer).toEqual(CustomerMock);
});
