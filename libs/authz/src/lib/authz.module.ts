import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '@ticketpond-backend-nx/prisma';

import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // MerchantModule,
  ],
  providers: [JwtStrategy, PrismaService],
  exports: [PassportModule],
})
export class AuthzModule {}
