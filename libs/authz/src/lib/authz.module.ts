import { DynamicModule, Module, Provider } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '@ticketpond-backend-nx/prisma';

import { JwtStrategy } from './jwt.strategy';

@Module({})
export class AuthzModule {
  static forRoot(providers: Provider[]): DynamicModule {
    return {
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      providers: [JwtStrategy, PrismaService, ...providers],
      module: AuthzModule,
      exports: [PassportModule],
    };
  }
}
