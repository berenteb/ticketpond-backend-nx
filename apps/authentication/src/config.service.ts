import * as dotenv from 'dotenv';
import * as env from 'env-var';

dotenv.config();

type ServiceConfig = {
  host: string;
  port: number;
};

export class ConfigService {
  private readonly envConfig: ServiceConfig & {
    frontendUrl: string;
    kafkaBroker: string;
    kafkaUsername?: string;
    kafkaPassword?: string;
    auth0ClientId: string;
    auth0ClientSecret: string;
    auth0CallbackUrl: string;
    auth0Domain: string;
    jwtSecret: string;
    cookieDomain: string;
  };

  constructor() {
    this.envConfig = {
      host: env.get('HOST').required().asString(),
      port: env.get('PORT').required().asPortNumber(),
      frontendUrl: env.get('FRONTEND_URL').required().asString(),
      kafkaBroker: env.get('KAFKA_BROKER').required().asString(),
      kafkaUsername: env.get('KAFKA_USERNAME').asString(),
      kafkaPassword: env.get('KAFKA_PASSWORD').asString(),
      auth0ClientId: env.get('AUTH0_CLIENT_ID').required().asString(),
      auth0ClientSecret: env.get('AUTH0_CLIENT_SECRET').required().asString(),
      auth0CallbackUrl: env.get('AUTH0_CALLBACK_URL').required().asString(),
      auth0Domain: env.get('AUTH0_DOMAIN').required().asString(),
      jwtSecret: env.get('JWT_SECRET').required().asString(),
      cookieDomain: env.get('COOKIE_DOMAIN').required().asString(),
    };
  }

  get<T extends keyof typeof this.envConfig>(
    key: T,
  ): (typeof this.envConfig)[T] {
    return this.envConfig[key];
  }
}
