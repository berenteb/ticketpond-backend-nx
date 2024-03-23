import { Module } from '@nestjs/common';
import { AuthzModule } from '@ticketpond-backend-nx/authz';

import { ConfigService } from './config.service';
import { CustomerController } from './customer/customer.controller';
import { CustomerAdminController } from './customer/customer-admin.controller';
import { GatewayController } from './gateway.controller';
import { createClientProxy } from './utils/create-client-proxy';
import { ServiceNames } from './utils/service-names';

@Module({
  imports: [AuthzModule],
  controllers: [GatewayController, CustomerAdminController, CustomerController],
  providers: [
    ConfigService,
    createClientProxy(ServiceNames.CUSTOMER_SERVICE, 'customerService'),
  ],
})
export class GatewayModule {}
