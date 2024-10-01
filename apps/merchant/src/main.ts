import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { getSaslOrNull } from '@ticketpond-backend-nx/utils';

import { ConfigService } from './config.service';
import { MerchantModule } from './merchant.module';

async function bootstrap() {
  const config = new ConfigService();
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MerchantModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'merchant',
          brokers: [config.get('kafkaBroker')],
          sasl: getSaslOrNull(
            config.get('kafkaUsername'),
            config.get('kafkaPassword'),
          ),
        },
        consumer: {
          groupId: 'merchant',
          allowAutoTopicCreation: true,
        },
      },
    },
  );
  await app.listen();
  Logger.log(
    `Module is connected to Kafka at ${config.get('kafkaBroker')}`,
    MerchantModule.name,
  );
}

bootstrap();
