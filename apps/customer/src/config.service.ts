import * as dotenv from 'dotenv';
import * as env from 'env-var';
dotenv.config();

type KafkaServiceConfig = {
  broker: string;
};

export type ClientProxyOptions = {
  notificationService: KafkaServiceConfig;
};

export class ConfigService {
  private readonly envConfig: {
    host: string;
    port: number;
  } & ClientProxyOptions;

  constructor() {
    this.envConfig = {
      host: env.get('HOST').required().asString(),
      port: env.get('PORT').required().asPortNumber(),
      notificationService: {
        broker: env.get('NOTIFICATION_SERVICE_BROKER').required().asString(),
      },
    };
  }

  get<T extends keyof typeof this.envConfig>(
    key: T,
  ): (typeof this.envConfig)[T] {
    return this.envConfig[key];
  }
}
