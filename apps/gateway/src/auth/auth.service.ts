import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientKafka } from '@nestjs/microservices';
import {
  CustomerMessagePattern,
  MerchantPattern,
} from '@ticketpond-backend-nx/message-patterns';
import {
  CreateCustomerDto,
  CustomerDto,
  JwtUser,
  MerchantDto,
  PermissionLevel,
  ServiceNames,
  ServiceResponse,
} from '@ticketpond-backend-nx/types';
import { responseFrom } from '@ticketpond-backend-nx/utils';
import { Profile } from 'passport-auth0';

import { ConfigService } from '../config.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(ServiceNames.KAFKA_SERVICE)
    private readonly kafkaService: ClientKafka,
  ) {
    kafkaService.subscribeToResponseOf(CustomerMessagePattern.CREATE_CUSTOMER);
    kafkaService.subscribeToResponseOf(
      CustomerMessagePattern.GET_CUSTOMER_BY_AUTH_ID,
    );
    kafkaService.subscribeToResponseOf(MerchantPattern.GET_MERCHANT_BY_USER_ID);
  }

  async login(user: Profile): Promise<string> {
    const customer = await this.getCustomerForProfile(user);
    const permissions: PermissionLevel[] = [];
    if (await this.isCustomerMerchant(customer.id)) {
      permissions.push(PermissionLevel.MERCHANT);
    }
    if (customer.isAdmin) {
      permissions.push(PermissionLevel.ADMIN);
    }
    const jwtUser: JwtUser = {
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      sub: customer.id,
      permissions,
    };
    return this.jwtService.sign(jwtUser, {
      secret: this.configService.get('jwtSecret'),
      expiresIn: '1 day',
    });
  }

  async getCustomerForProfile(profile: Profile): Promise<CustomerDto> {
    try {
      const customer = await responseFrom(
        this.kafkaService.send<ServiceResponse<CustomerDto>>(
          CustomerMessagePattern.GET_CUSTOMER_BY_AUTH_ID,
          profile.id,
        ),
      );
      if (customer) return customer;
    } catch (e) {
      return this.createCustomer(profile);
    }
  }

  async createCustomer(profile: Profile): Promise<CustomerDto> {
    const createCustomerDto: CreateCustomerDto = {
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      email: profile.emails[0].value,
      address: '',
      phone: '',
    };
    return responseFrom(
      this.kafkaService.send<ServiceResponse<CustomerDto>>(
        CustomerMessagePattern.CREATE_CUSTOMER,
        {
          customer: createCustomerDto,
          authId: profile.id,
        },
      ),
    );
  }

  async isCustomerMerchant(customerId: string): Promise<boolean> {
    const merchantDto = await responseFrom(
      this.kafkaService.send<ServiceResponse<MerchantDto>>(
        MerchantPattern.GET_MERCHANT_BY_USER_ID,
        customerId,
      ),
    );
    return Boolean(merchantDto);
  }
}