import { Test } from '@nestjs/testing';

import { CustomerService } from './customer.service';

let service: CustomerService;

beforeAll(async () => {
  const app = await Test.createTestingModule({
    providers: [CustomerService],
  }).compile();

  service = app.get<CustomerService>(CustomerService);
});

describe('getData', () => {
  it('should return welcome message', () => {
    expect(service.getData()).toEqual({
      message: `Hello ${CustomerService.name}`,
    });
  });
});
