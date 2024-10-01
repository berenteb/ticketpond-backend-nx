import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { DoneCallback } from 'passport';
import { Profile, Strategy } from 'passport-auth0';

import { ConfigService } from '../config.service';

@Injectable()
export class Auth0Strategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super(
      {
        clientID: configService.get('auth0ClientId'),
        clientSecret: configService.get('auth0ClientSecret'),
        callbackURL: configService.get('auth0CallbackUrl'),
        domain: configService.get('auth0Domain'),
        state: false,
        scope: 'openid email profile',
      },
      (
        _accessToken: string,
        _refreshToken: string,
        _extraParams: unknown,
        profile: Profile,
        done: DoneCallback,
      ) => {
        done(null, profile);
      },
    );
  }
}
