import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { PassportStrategy } from '@nestjs/passport';
import { MerchantPattern } from '@ticketpond-backend-nx/message-patterns';
import {
  JwtUser,
  PermissionLevel,
  ServiceNames,
} from '@ticketpond-backend-nx/types';
import * as dotenv from 'dotenv';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { firstValueFrom } from 'rxjs';

import { AUTH0_AUDIENCE, AUTH0_ISSUER_URL } from './config';

dotenv.config();

@Injectable()
export class JwtStrategy
  extends PassportStrategy(Strategy)
  implements OnModuleInit
{
  private readonly logger = new Logger(JwtStrategy.name);
  constructor(
    @Inject(ServiceNames.MERCHANT_SERVICE)
    private readonly merchantService: ClientKafka,
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
    this.merchantService.subscribeToResponseOf(
      MerchantPattern.GET_MERCHANT_BY_USER_ID,
    );
    await this.merchantService.connect();
  }

  async validate(payload: JwtUser): Promise<JwtUser> {
    const merchantForUser = await firstValueFrom(
      this.merchantService.send<boolean>(
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
