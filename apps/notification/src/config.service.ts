import * as dotenv from 'dotenv';
import * as env from 'env-var';
dotenv.config();

export class ConfigService {
  private readonly envConfig: {
    kafkaBroker: string;
    kafkaUsername?: string;
    kafkaPassword?: string;
    backendUrl?: string;
    email: {
      host: string;
      port: number;
      secure: boolean;
      auth: {
        user: string;
        pass: string;
      };
      from: {
        name: string;
        address: string;
      };
    };
  };

  constructor() {
    this.envConfig = {
      kafkaBroker: env.get('KAFKA_BROKER').required().asString(),
      kafkaUsername: env.get('KAFKA_USERNAME').asString(),
      kafkaPassword: env.get('KAFKA_PASSWORD').asString(),
      backendUrl: env.get('BACKEND_URL').asString(),
      email: {
        host: env.get('EMAIL_HOST').required().asString(),
        port: env.get('EMAIL_PORT').required().asIntPositive(),
        secure: env.get('EMAIL_SECURE').required().asBool(),
        auth: {
          user: env.get('EMAIL_USERNAME').required().asString(),
          pass: env.get('EMAIL_PASSWORD').required().asString(),
        },
        from: {
          name: env.get('EMAIL_FROM_NAME').required().asString(),
          address: env.get('EMAIL_FROM_ADDRESS').required().asString(),
        },
      },
    };
  }

  get<T extends keyof typeof this.envConfig>(
    key: T,
  ): (typeof this.envConfig)[T] {
    return this.envConfig[key];
  }
}
