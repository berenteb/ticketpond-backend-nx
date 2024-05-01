import * as dotenv from 'dotenv';
import * as env from 'env-var';

dotenv.config();

type ServiceConfig = {
  host: string;
  port: number;
};

export type ClientProxyOptions = {
  assetService: ServiceConfig;
};

export class ConfigService {
  private readonly envConfig: ServiceConfig &
    ClientProxyOptions & {
      frontendUrl: string;
      kafkaBroker: string;
    };

  constructor() {
    this.envConfig = {
      host: env.get('HOST').required().asString(),
      port: env.get('PORT').required().asPortNumber(),
      assetService: {
        host: env.get('ASSET_SERVICE_HOST').required().asString(),
        port: env.get('ASSET_SERVICE_PORT').required().asPortNumber(),
      },
      frontendUrl: env.get('FRONTEND_URL').required().asString(),
      kafkaBroker: env.get('KAFKA_BROKER').required().asString(),
    };
  }

  get<T extends keyof typeof this.envConfig>(
    key: T,
  ): (typeof this.envConfig)[T] {
    return this.envConfig[key];
  }
}
