import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { getSaslOrNull } from '@ticketpond-backend-nx/utils';

import { ConfigService } from './config.service';
import { ExperienceModule } from './experience.module';

async function bootstrap() {
  const config = new ConfigService();
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ExperienceModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'experience',
          brokers: [config.get('kafkaBroker')],
          sasl: getSaslOrNull(
            config.get('kafkaUsername'),
            config.get('kafkaPassword'),
          ),
        },
        consumer: {
          groupId: 'experience',
          allowAutoTopicCreation: true,
        },
      },
    },
  );
  await app.listen();
  Logger.log(
    `Module is connected to Kafka at ${config.get('kafkaBroker')}`,
    ExperienceModule.name,
  );
}

bootstrap();
