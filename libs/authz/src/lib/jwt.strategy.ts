import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtUser } from '@ticketpond-backend-nx/types';
import * as dotenv from 'dotenv';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AUTH0_AUDIENCE, AUTH0_ISSUER_URL } from './config';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${AUTH0_ISSUER_URL}/.well-known/jwks.json`,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: AUTH0_AUDIENCE,
      issuer: AUTH0_ISSUER_URL,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: JwtUser): Promise<JwtUser> {
    // const merchantForUser = await this.merchantService.getMerchantByUserId(
    //   payload.sub,
    // );
    // if (merchantForUser) {
    //   Logger.debug('User is a merchant', JwtStrategy.name);
    //   payload.permissions.push(PermissionLevel.MERCHANT);
    // }
    return payload;
  }
}
