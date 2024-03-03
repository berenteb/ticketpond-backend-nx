import { Module } from '@nestjs/common';

import { ConfigService } from './config.service';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';

@Module({
  imports: [],
  controllers: [CustomerController],
  providers: [ConfigService, CustomerService],
})
export class CustomerModule {}
