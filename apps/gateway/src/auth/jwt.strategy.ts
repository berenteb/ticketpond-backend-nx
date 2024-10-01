import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ConfigService } from '../config.service';
import { extractJwtTokenFromCookie } from '../utils/auth.utils';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => extractJwtTokenFromCookie(req),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwtSecret'),
    });
  }

  validate(payload: unknown): unknown {
    return payload;
  }
}
