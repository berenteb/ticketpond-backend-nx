import { Test, TestingModule } from '@nestjs/testing';
import { CustomerServiceInterface } from '@ticketpond-backend-nx/types';
import { CreateServiceResponse } from '@ticketpond-backend-nx/utils';

import { CustomerMock } from './__mocks__/entities/customer.mock';
import { CustomerServiceMock } from './__mocks__/services/customerService.mock';
import { CustomerInternalController } from './customer-internal.controller';

let controller: CustomerInternalController;

beforeEach(async () => {
  jest.clearAllMocks();
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      { provide: CustomerServiceInterface, useValue: CustomerServiceMock },
    ],
    controllers: [CustomerInternalController],
  }).compile();

  controller = module.get<CustomerInternalController>(
    CustomerInternalController,
  );
});

it('should get customer by auth id', async () => {
  const result = await controller.getCustomerByAuthId(CustomerMock.authId);
  expect(result).toEqual(CreateServiceResponse.success(CustomerMock));
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
