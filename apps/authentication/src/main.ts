import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fs from 'fs';
import path from 'path';

import { AuthenticationModule } from './authentication.module';
import { ConfigService } from './config.service';

async function bootstrap() {
  const config = new ConfigService();
  const app = await NestFactory.create(AuthenticationModule);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({ credentials: true, origin: config.get('frontendUrl') });
  app.setGlobalPrefix('authentication');

  const swaggerConfig = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Ticketpond - authentication')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
  if (process.env['NODE_ENV'] !== 'production') {
    Logger.log(
      `Writing OpenAPI document for authentication`,
      AuthenticationModule.name,
    );
    fs.writeFileSync(
      path.join('openapi', `openapi-authentication.json`),
      JSON.stringify(document),
    );
  }
  await app.listen(config.get('port'));

  Logger.log(
    `Authentication is running on: ${await app.getUrl()}`,
    AuthenticationModule.name,
  );
}

bootstrap();
