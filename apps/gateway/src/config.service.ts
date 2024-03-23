import * as dotenv from 'dotenv';
import * as env from 'env-var';
dotenv.config();

type ServiceConfig = {
  host: string;
  port: number;
};

export type ClientProxyOptions = {
  customerService: ServiceConfig;
  merchantService: ServiceConfig;
  experienceService: ServiceConfig;
};

export class ConfigService {
  private readonly envConfig: ServiceConfig &
    ClientProxyOptions & {
      frontendUrl: string;
    };

  constructor() {
    this.envConfig = {
      host: env.get('HOST').required().asString(),
      port: env.get('PORT').required().asPortNumber(),
      customerService: {
        host: env.get('CUSTOMER_SERVICE_HOST').required().asString(),
        port: env.get('CUSTOMER_SERVICE_PORT').required().asPortNumber(),
      },
      merchantService: {
        host: env.get('MERCHANT_SERVICE_HOST').required().asString(),
        port: env.get('MERCHANT_SERVICE_PORT').required().asPortNumber(),
      },
      experienceService: {
        host: env.get('EXPERIENCE_SERVICE_HOST').required().asString(),
        port: env.get('EXPERIENCE_SERVICE_PORT').required().asPortNumber(),
      },
      frontendUrl: env.get('FRONTEND_URL').required().asString(),
    };
  }

  get<T extends keyof typeof this.envConfig>(
    key: T,
  ): (typeof this.envConfig)[T] {
    return this.envConfig[key];
  }
}
