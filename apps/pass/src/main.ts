import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { ConfigService } from './config.service';
import { PassModule } from './pass.module';

async function bootstrap() {
  const config = new ConfigService();
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    PassModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'pass',
          brokers: [config.get('kafkaBroker')],
        },
        consumer: {
          groupId: 'pass',
        },
      },
    },
  );
  await app.listen();
  Logger.log(
    `Module is connected to Kafka at ${config.get('kafkaBroker')}`,
    PassModule.name,
  );
}

bootstrap();
