import * as dotenv from 'dotenv';
import * as env from 'env-var';
dotenv.config();

export class ConfigService {
  private readonly envConfig: {
    kafkaBroker: string;
    kafkaUsername: string;
    kafkaPassword: string;
    stripeSecretKey: string;
    stripeWebhookEndpointSecret: string;
  };

  constructor() {
    this.envConfig = {
      kafkaBroker: env.get('KAFKA_BROKER').required().asString(),
      kafkaUsername: env.get('KAFKA_USERNAME').required().asString(),
      kafkaPassword: env.get('KAFKA_PASSWORD').required().asString(),
      stripeSecretKey: env.get('STRIPE_SECRET_KEY').required().asString(),
      stripeWebhookEndpointSecret: env
        .get('STRIPE_WEBHOOK_ENDPOINT_SECRET')
        .required()
        .asString(),
    };
  }

  get<T extends keyof typeof this.envConfig>(
    key: T,
  ): (typeof this.envConfig)[T] {
    return this.envConfig[key];
  }
}
