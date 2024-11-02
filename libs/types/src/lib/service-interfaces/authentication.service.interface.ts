import { Profile } from 'passport-auth0';

import { CustomerDto, MerchantDto } from '../dtos';

export abstract class AuthenticationServiceInterface {
  abstract login(user: Profile): Promise<string>;
  abstract getCustomerForProfile(profile: Profile): Promise<CustomerDto>;
  abstract createCustomer(profile: Profile): Promise<CustomerDto>;
  abstract getMerchantForCustomer(
    customerId: string,
  ): Promise<MerchantDto | null>;
}
