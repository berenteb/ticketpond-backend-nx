import { Test, TestingModule } from '@nestjs/testing';
import { CustomerServiceInterface } from '@ticketpond-backend-nx/types';
import { CreateServiceResponse } from '@ticketpond-backend-nx/utils';

import { CustomerMock } from './__mocks__/entities/customer.mock';
import { CustomerServiceMock } from './__mocks__/services/customerService.mock';
import { CustomerController } from './customer.controller';

let controller: CustomerController;

beforeEach(async () => {
  jest.clearAllMocks();
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      { provide: CustomerServiceInterface, useValue: CustomerServiceMock },
    ],
    controllers: [CustomerController],
  }).compile();

  controller = module.get<CustomerController>(CustomerController);
});

it('should get customer by id', async () => {
  const result = await controller.getCustomer(CustomerMock.id);
  expect(result).toEqual(CreateServiceResponse.success(CustomerMock));
  expect(CustomerServiceMock.getCustomerById).toHaveBeenCalledWith(
    CustomerMock.id,
  );
});

it('should get customer by auth id', async () => {
  const result = await controller.getCustomerByAuthId(CustomerMock.authId);
  expect(result).toEqual({
    success: true,
    data: CustomerMock,
  });
  expect(CustomerServiceMock.getCustomerByAuthId).toHaveBeenCalledWith(
    CustomerMock.authId,
  );
});

it('should create customer', async () => {
  const result = await controller.createCustomer({
    customer: CustomerMock,
  });
  expect(result).toEqual(CreateServiceResponse.success(CustomerMock));
  expect(CustomerServiceMock.createCustomer).toHaveBeenCalledWith(
    CustomerMock,
    undefined,
  );
});

it('should list customers', async () => {
  const result = await controller.listCustomers();
  expect(result).toEqual(CreateServiceResponse.success([CustomerMock]));
  expect(CustomerServiceMock.getCustomers).toHaveBeenCalled();
});

it('should update customer', async () => {
  const { id, ...UpdateCustomerMock } = CustomerMock;
  const result = await controller.updateCustomer({
    id,
    customer: UpdateCustomerMock,
  });
  expect(result).toEqual(CreateServiceResponse.success(CustomerMock));
  expect(CustomerServiceMock.updateCustomer).toHaveBeenCalledWith(
    id,
    UpdateCustomerMock,
  );
});

it('should update customer by auth id', async () => {
  const { authId, ...UpdateCustomerMock } = CustomerMock;
  const result = await controller.updateCustomerByAuthId({
    authId,
    customer: UpdateCustomerMock,
  });
  expect(result).toEqual(CreateServiceResponse.success(CustomerMock));
  expect(CustomerServiceMock.updateCustomerById).toHaveBeenCalledWith(
    authId,
    UpdateCustomerMock,
  );
});

it('should delete customer', async () => {
  const result = await controller.deleteCustomer(CustomerMock.id);
  expect(result).toBeUndefined();
  expect(CustomerServiceMock.deleteCustomer).toHaveBeenCalledWith(
    CustomerMock.id,
  );
});
