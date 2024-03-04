import { Test, TestingModule } from '@nestjs/testing';

import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';

let app: TestingModule;

beforeAll(async () => {
  app = await Test.createTestingModule({
    controllers: [CustomerController],
    providers: [CustomerService],
  }).compile();
});

describe('getData', () => {
  it('should return welcome message', () => {
    const appController = app.get<CustomerController>(CustomerController);
    expect(appController.getData()).toEqual({
      message: `Hello ${CustomerService.name}`,
    });
  });
});
