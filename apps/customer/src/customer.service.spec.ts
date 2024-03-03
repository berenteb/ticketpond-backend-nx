import { Test } from '@nestjs/testing';

import { CustomerService } from './customer.service';

describe(CustomerService.name, () => {
  let service: CustomerService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [CustomerService],
    }).compile();

    service = app.get<CustomerService>(CustomerService);
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      expect(service.getData()).toEqual({ message: 'Hello API' });
    });
  });
});
