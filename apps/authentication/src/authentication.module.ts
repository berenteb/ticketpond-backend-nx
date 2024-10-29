import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { AuthModule } from '@ticketpond-backend-nx/auth';
import {
  CustomerMessagePattern,
  MerchantPattern,
} from '@ticketpond-backend-nx/message-patterns';
import { ServiceNames } from '@ticketpond-backend-nx/types';
import { HealthController } from '@ticketpond-backend-nx/utils';

import { Auth0Strategy } from './auth0.strategy';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { ConfigService } from './config.service';
import { createClientKafka } from './utils/create-client-kafka';

@Module({
  imports: [AuthModule],
  controllers: [HealthController, AuthenticationController],
  providers: [
    ConfigService,
    AuthenticationService,
    Auth0Strategy,
    createClientKafka(ServiceNames.KAFKA_SERVICE, 'authentication'),
  ],
})
export class AuthenticationModule implements OnModuleInit {
  constructor(
    @Inject(ServiceNames.KAFKA_SERVICE)
    private readonly kafkaService: ClientKafka,
  ) {}

  async onModuleInit() {
    this.kafkaService.subscribeToResponseOf(
      CustomerMessagePattern.CREATE_CUSTOMER,
    );
    this.kafkaService.subscribeToResponseOf(
      CustomerMessagePattern.GET_CUSTOMER_BY_AUTH_ID,
    );
    this.kafkaService.subscribeToResponseOf(
      MerchantPattern.GET_MERCHANT_BY_USER_ID,
    );
    await this.kafkaService.connect();
  }
}
