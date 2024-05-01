import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AssetModule } from './asset.module';
import { ConfigService } from './config.service';

async function bootstrap() {
  const config = new ConfigService();
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AssetModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'asset',
          brokers: [config.get('kafkaBroker')],
        },
        consumer: {
          groupId: 'asset',
        },
      },
    },
  );
  await app.listen();
  Logger.log(
    `Module is connected to Kafka at ${config.get('kafkaBroker')}`,
    AssetModule.name,
  );
}

bootstrap();
