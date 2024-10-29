import {
  INestApplication,
  Logger,
  NestApplicationOptions,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as env from 'env-var';
import * as fs from 'fs';
import * as path from 'path';

import { getSaslOrNull } from './kafka';

export async function bootstrapService<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  module: any,
  name: string,
  options?: NestApplicationOptions,
): Promise<INestApplication<T>> {
  const config = new BootstrapConfig();
  const app = await NestFactory.create(module, options);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({ credentials: true, origin: config.get('frontendUrl') });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: name,
        brokers: [config.get('kafkaBroker')],
        sasl: getSaslOrNull(
          config.get('kafkaUsername'),
          config.get('kafkaPassword'),
        ),
      },
      consumer: {
        groupId: name,
        allowAutoTopicCreation: true,
      },
    },
  });
  app.setGlobalPrefix(name);

  const swaggerConfig = new DocumentBuilder()
    .addCookieAuth('jwt')
    .setTitle('Ticketpond - ' + name)
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
  if (process.env['NODE_ENV'] !== 'production') {
    Logger.log(`Writing OpenAPI document for ${name}`, module.name);
    fs.writeFileSync(
      path.join('openapi', `openapi-${name}.json`),
      JSON.stringify(document),
    );
  }
  await app.startAllMicroservices();
  await app.listen(config.get('port'));
  Logger.log(
    `Module is connected to Kafka at ${config.get('kafkaBroker')}, running on: ${config.get('port')}`,
    module.name,
  );
  return app;
}

class BootstrapConfig {
  private readonly envConfig: {
    port: number;
    frontendUrl: string;
    kafkaBroker: string;
    kafkaUsername?: string;
    kafkaPassword?: string;
  };

  constructor() {
    this.envConfig = {
      port: env.get('PORT').required().asPortNumber(),
      frontendUrl: env.get('FRONTEND_URL').required().asString(),
      kafkaBroker: env.get('KAFKA_BROKER').required().asString(),
      kafkaUsername: env.get('KAFKA_USERNAME').asString(),
      kafkaPassword: env.get('KAFKA_PASSWORD').asString(),
    };
  }

  get<T extends keyof typeof this.envConfig>(
    key: T,
  ): (typeof this.envConfig)[T] {
    return this.envConfig[key];
  }
}
