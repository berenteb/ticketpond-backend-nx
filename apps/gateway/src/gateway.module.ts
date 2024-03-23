import { Module } from '@nestjs/common';
import { AuthzModule } from '@ticketpond-backend-nx/authz';
import { ServiceNames } from '@ticketpond-backend-nx/types';

import { ConfigService } from './config.service';
import { CustomerController } from './customer/customer.controller';
import { CustomerAdminController } from './customer/customer-admin.controller';
import { ExperienceController } from './experience/experience.controller';
import { ExperienceAdminController } from './experience/experience-admin.controller';
import { ExperienceMerchantController } from './experience/experience-merchant.controller';
import { GatewayController } from './gateway.controller';
import { MerchantController } from './merchant/merchant.controller';
import { MerchantAdminController } from './merchant/merchant-admin.controller';
import { MerchantSelfController } from './merchant/merchant-self.controller';
import { createClientProxy } from './utils/create-client-proxy';

@Module({
  imports: [
    AuthzModule.forRoot([
      createClientProxy(ServiceNames.MERCHANT_SERVICE, 'merchantService'),
      ConfigService,
    ]),
  ],
  controllers: [
    GatewayController,
    CustomerAdminController,
    CustomerController,
    MerchantController,
    MerchantSelfController,
    MerchantAdminController,
    ExperienceController,
    ExperienceMerchantController,
    ExperienceAdminController,
  ],
  providers: [
    ConfigService,
    createClientProxy(ServiceNames.CUSTOMER_SERVICE, 'customerService'),
    createClientProxy(ServiceNames.MERCHANT_SERVICE, 'merchantService'),
    createClientProxy(ServiceNames.EXPERIENCE_SERVICE, 'experienceService'),
  ],
})
export class GatewayModule {}
