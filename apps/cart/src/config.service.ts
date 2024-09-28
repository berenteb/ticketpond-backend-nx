import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as env from 'env-var';

dotenv.config();

@Injectable()
export class ConfigService {
  private readonly envConfig: {
    kafkaBroker: string;
    kafkaUsername: string;
    kafkaPassword: string;
  };

  constructor() {
    this.envConfig = {
      kafkaBroker: env.get('KAFKA_BROKER').required().asString(),
      kafkaUsername: env.get('KAFKA_USERNAME').required().asString(),
      kafkaPassword: env.get('KAFKA_PASSWORD').required().asString(),
    };
  }

  get<T extends keyof typeof this.envConfig>(
    key: T,
  ): (typeof this.envConfig)[T] {
    return this.envConfig[key];
  }
}
