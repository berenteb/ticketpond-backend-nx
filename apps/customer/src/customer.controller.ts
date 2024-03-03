import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { CustomerService } from './customer.service';

@Controller()
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @MessagePattern('getData')
  getData() {
    return this.customerService.getData();
  }
}
