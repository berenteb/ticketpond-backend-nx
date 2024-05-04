import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { type AbstractStrategy, PassportStrategy } from '@nestjs/passport';
import { MerchantPattern } from '@ticketpond-backend-nx/message-patterns';
import {
  JwtUser,
  MerchantDto,
  PermissionLevel,
  ServiceNames,
  ServiceResponse,
} from '@ticketpond-backend-nx/types';
import { responseFrom } from '@ticketpond-backend-nx/utils';
import * as dotenv from 'dotenv';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AUTH0_AUDIENCE, AUTH0_ISSUER_URL } from './config';

dotenv.config();

@Injectable()
export class JwtStrategy
  extends PassportStrategy(Strategy)
  implements OnModuleInit, AbstractStrategy
{
  private readonly logger = new Logger(JwtStrategy.name);
  constructor(
    @Inject(ServiceNames.KAFKA_SERVICE)
    private readonly kafkaService: ClientKafka,
  ) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${AUTH0_ISSUER_URL}.well-known/jwks.json`,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: AUTH0_AUDIENCE,
      issuer: AUTH0_ISSUER_URL,
      algorithms: ['RS256'],
    });
  }

  async onModuleInit() {
    this.kafkaService.subscribeToResponseOf(
      MerchantPattern.GET_MERCHANT_BY_USER_ID,
    );
    await this.kafkaService.connect();
  }

  async validate(payload: JwtUser): Promise<JwtUser> {
    const merchantForUser = await responseFrom(
      this.kafkaService.send<ServiceResponse<MerchantDto>>(
        MerchantPattern.GET_MERCHANT_BY_USER_ID,
        payload.sub,
      ),
    );
    if (merchantForUser) {
      this.logger.debug('User is a merchant');
      payload.permissions.push(PermissionLevel.MERCHANT);
    }
    return payload;
  }
}
