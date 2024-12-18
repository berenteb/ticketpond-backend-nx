import { Test, TestingModule } from '@nestjs/testing';
import { NotificationPatterns } from '@ticketpond-backend-nx/message-patterns';
import { PrismaService } from '@ticketpond-backend-nx/prisma';
import { KafkaMock, PrismaMock } from '@ticketpond-backend-nx/testing';
import { ServiceNames } from '@ticketpond-backend-nx/types';

import { CustomerMock } from './__mocks__/entities/customer.mock';
import { CustomerService } from './customer.service';

let service: CustomerService;

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      CustomerService,
      { provide: PrismaService, useValue: PrismaMock },
      {
        provide: ServiceNames.KAFKA_SERVICE,
        useValue: KafkaMock,
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
  expect(KafkaMock.emit).toHaveBeenCalledWith(
    NotificationPatterns.SEND_WELCOME,
    CustomerMock,
  );
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

it('should get customer by internal id', async () => {
  PrismaMock.customer.findUnique.mockResolvedValue(CustomerMock);
  const customer = await service.getCustomerByAuthId('test-customer-auth-id');
  expect(PrismaMock.customer.findUnique).toHaveBeenCalledWith({
    where: { id: 'test-customer-id' },
  });
  expect(customer).toEqual(CustomerMock);
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
  const customer = await service.updateCustomerById(
    'test-customer-auth-id',
    CustomerMock,
  );
  expect(PrismaMock.customer.update).toHaveBeenCalledWith({
    where: { id: 'test-customer-auth-id' },
    data: CustomerMock,
  });
  expect(customer).toEqual(CustomerMock);
});
