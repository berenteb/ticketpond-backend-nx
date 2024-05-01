import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { ConfigService } from './config.service';
import { CustomerModule } from './customer.module';

async function bootstrap() {
  const config = new ConfigService();
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CustomerModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'customer',
          brokers: [config.get('kafkaBroker')],
        },
        consumer: {
          groupId: 'customer',
          allowAutoTopicCreation: true,
        },
      },
    },
  );
  await app.listen();
  Logger.log(
    `Module is connected to Kafka at ${config.get('kafkaBroker')}`,
    CustomerModule.name,
  );
}

bootstrap();
