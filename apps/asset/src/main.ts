import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fs from 'fs';
import path from 'path';

import { AssetModule } from './asset.module';
import { ConfigService } from './config.service';

async function bootstrap() {
  const config = new ConfigService();
  const app = await NestFactory.create(AssetModule, { rawBody: true });

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({ credentials: true, origin: config.get('frontendUrl') });
  app.setGlobalPrefix('asset');

  const swaggerConfig = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Ticketpond - asset')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
  if (process.env['NODE_ENV'] !== 'production') {
    Logger.log(`Writing OpenAPI document for asset`, AssetModule.name);
    fs.writeFileSync(
      path.join('openapi', `openapi-asset.json`),
      JSON.stringify(document),
    );
  }
  await app.listen(config.get('port'));

  Logger.log(`Asset is running on: ${await app.getUrl()}`, AssetModule.name);
}

bootstrap();
