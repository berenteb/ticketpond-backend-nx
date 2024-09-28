import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { ConfigService } from './config.service';
import { NotificationModule } from './notification.module';

async function bootstrap() {
  const config = new ConfigService();
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NotificationModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'notification',
          brokers: [config.get('kafkaBroker')],
          sasl: {
            mechanism: 'plain',
            username: config.get('kafkaUsername'),
            password: config.get('kafkaPassword'),
          },
        },
        consumer: {
          groupId: 'notification',
          allowAutoTopicCreation: true,
        },
      },
    },
  );
  await app.listen();
  Logger.log(
    `Module is connected to Kafka at ${config.get('kafkaBroker')}`,
    NotificationModule.name,
  );
}

bootstrap();
