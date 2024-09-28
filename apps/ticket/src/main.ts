import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { ConfigService } from './config.service';
import { TicketModule } from './ticket.module';

async function bootstrap() {
  const config = new ConfigService();
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    TicketModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'ticket',
          brokers: [config.get('kafkaBroker')],
          sasl: {
            mechanism: 'plain',
            username: config.get('kafkaUsername'),
            password: config.get('kafkaPassword'),
          },
        },
        consumer: {
          groupId: 'ticket',
          allowAutoTopicCreation: true,
        },
      },
    },
  );
  await app.listen();
  Logger.log(
    `Module is connected to Kafka at ${config.get('kafkaBroker')}`,
    TicketModule.name,
  );
}

bootstrap();
