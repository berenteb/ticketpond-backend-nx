import { DynamicModule, Provider } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Auth0Strategy } from './auth0.strategy';
import { JwtStrategy } from './jwt.strategy';

export class AuthModule {
  static forRoot(providers: Provider[]): DynamicModule {
    return {
      imports: [PassportModule.register({ defaultStrategy: 'jwt' }), JwtModule],
      providers: [Auth0Strategy, JwtStrategy, AuthService, ...providers],
      controllers: [AuthController],
      module: AuthModule,
      exports: [PassportModule, JwtModule],
    };
  }
}
