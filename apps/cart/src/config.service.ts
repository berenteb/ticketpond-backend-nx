import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as env from 'env-var';

dotenv.config();

@Injectable()
export class ConfigService {
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
