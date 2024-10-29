import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtUser } from '@ticketpond-backend-nx/types';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { extractJwtTokenFromCookie } from './auth.utils';
import { AuthConfigService } from './authConfigService';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: AuthConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => extractJwtTokenFromCookie(req),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwtSecret'),
    });
  }

  validate(payload: JwtUser): JwtUser {
    return payload;
  }
}
