import * as dotenv from 'dotenv';
import * as env from 'env-var';
dotenv.config();

type ServiceConfig = {
  host: string;
  port: number;
};

export type ClientProxyOptions = {
  orderService: ServiceConfig;
};

export class ConfigService {
  private readonly envConfig: {
    host: string;
    port: number;
    stripeSecretKey: string;
    stripeWebhookEndpointSecret: string;
  } & ClientProxyOptions;

  constructor() {
    this.envConfig = {
      host: env.get('HOST').required().asString(),
      port: env.get('PORT').required().asPortNumber(),
      stripeSecretKey: env.get('STRIPE_SECRET_KEY').required().asString(),
      stripeWebhookEndpointSecret: env
        .get('STRIPE_WEBHOOK_ENDPOINT_SECRET')
        .required()
        .asString(),
      orderService: {
        host: env.get('ORDER_SERVICE_HOST').required().asString(),
        port: env.get('ORDER_SERVICE_PORT').required().asPortNumber(),
      },
    };
  }

  get<T extends keyof typeof this.envConfig>(
    key: T,
  ): (typeof this.envConfig)[T] {
    return this.envConfig[key];
  }
}
