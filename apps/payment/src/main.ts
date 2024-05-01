import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { ConfigService } from './config.service';
import { PaymentModule } from './payment.module';

async function bootstrap() {
  const config = new ConfigService();
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    PaymentModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'payment',
          brokers: [config.get('kafkaBroker')],
        },
        consumer: {
          groupId: 'payment',
          allowAutoTopicCreation: true,
        },
      },
    },
  );
  await app.listen();
  Logger.log(
    `Module is connected to Kafka at ${config.get('kafkaBroker')}`,
    PaymentModule.name,
  );
}

bootstrap();
