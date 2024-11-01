import { Test, TestingModule } from '@nestjs/testing';
import { CustomerServiceInterface } from '@ticketpond-backend-nx/types';

import { CustomerMock } from './__mocks__/entities/customer.mock';
import { CustomerServiceMock } from './__mocks__/services/customerService.mock';
import { CustomerAdminController } from './customer-admin.controller';

let controller: CustomerAdminController;

beforeEach(async () => {
  jest.clearAllMocks();
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      { provide: CustomerServiceInterface, useValue: CustomerServiceMock },
    ],
    controllers: [CustomerAdminController],
  }).compile();

  controller = module.get<CustomerAdminController>(CustomerAdminController);
});

it('should get customer by id', async () => {
  const result = await controller.getCustomerById(CustomerMock.id);
  expect(result).toEqual(CustomerMock);
  expect(CustomerServiceMock.getCustomerById).toHaveBeenCalledWith(
    CustomerMock.id,
  );
});

it('should list customers', async () => {
  const result = await controller.listCustomers();
  expect(result).toEqual([CustomerMock]);
  expect(CustomerServiceMock.getCustomers).toHaveBeenCalled();
});

it('should update customer', async () => {
  const result = await controller.updateCustomer(CustomerMock.id, CustomerMock);
  expect(result).toEqual(CustomerMock);
  expect(CustomerServiceMock.updateCustomer).toHaveBeenCalledWith(
    CustomerMock.id,
    CustomerMock,
  );
});

it('should delete customer', async () => {
  const result = await controller.deleteCustomer(CustomerMock.id);
  expect(result).toBeUndefined();
  expect(CustomerServiceMock.deleteCustomer).toHaveBeenCalledWith(
    CustomerMock.id,
  );
});
