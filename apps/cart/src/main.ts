import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { CartModule } from './cart.module';
import { ConfigService } from './config.service';

async function bootstrap() {
  const config = new ConfigService();
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CartModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'cart',
          brokers: [config.get('kafkaBroker')],
        },
        consumer: {
          groupId: 'cart',
          allowAutoTopicCreation: true,
        },
      },
    },
  );
  await app.listen();
  Logger.log(
    `Module is connected to Kafka at ${config.get('kafkaBroker')}`,
    CartModule.name,
  );
}

bootstrap();
