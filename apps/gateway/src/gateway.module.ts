import { Module } from '@nestjs/common';

import { ConfigService } from './config.service';
import { GatewayController } from './gateway.controller';
import { GatewayCustomerController } from './gateway-customer.controller';
import { createClientProxy } from './utils/create-client-proxy';
import { ServiceNames } from './utils/service-names';

@Module({
  imports: [],
  controllers: [GatewayController, GatewayCustomerController],
  providers: [
    ConfigService,
    createClientProxy(ServiceNames.CUSTOMER_SERVICE, 'customerService'),
  ],
})
export class GatewayModule {}
