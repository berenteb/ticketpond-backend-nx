import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { ConfigService } from './config.service';
import { OrderModule } from './order.module';

async function bootstrap() {
  const config = new ConfigService();
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    OrderModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'order',
          brokers: [config.get('kafkaBroker')],
          sasl: {
            mechanism: 'plain',
            username: config.get('kafkaUsername'),
            password: config.get('kafkaPassword'),
          },
        },
        consumer: {
          groupId: 'order',
          allowAutoTopicCreation: true,
        },
      },
    },
  );
  await app.listen();
  Logger.log(
    `Module is connected to Kafka at ${config.get('kafkaBroker')}`,
    OrderModule.name,
  );
}

bootstrap();
