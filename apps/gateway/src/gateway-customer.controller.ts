import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { ServiceNames } from './utils/service-names';

@Controller('customer')
export class GatewayCustomerController {
  constructor(
    @Inject(ServiceNames.CUSTOMER_SERVICE)
    private readonly customerService: ClientProxy,
  ) {}

  @Get()
  async getData(): Promise<string> {
    const data = await firstValueFrom(
      this.customerService.send<{ message: string }>('getData', {}),
    );
    return data.message;
  }
}
