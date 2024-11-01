import { Test, TestingModule } from '@nestjs/testing';
import { ReqWithUserMock } from '@ticketpond-backend-nx/testing';
import { CustomerServiceInterface } from '@ticketpond-backend-nx/types';

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
  const result = await controller.getMe(ReqWithUserMock);
  expect(result).toEqual(CustomerMock);
  expect(CustomerServiceMock.getCustomerById).toHaveBeenCalledWith(
    ReqWithUserMock.user.sub,
  );
});

it('should get permissions', async () => {
  const result = await controller.getPermissions(ReqWithUserMock);
  expect(result).toEqual(ReqWithUserMock.user.permissions);
});
