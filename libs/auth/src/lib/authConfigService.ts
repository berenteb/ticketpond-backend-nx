import * as dotenv from 'dotenv';
import * as env from 'env-var';

dotenv.config();

type ServiceConfig = {
  jwtSecret: string;
};

export class AuthConfigService {
  private readonly envConfig: ServiceConfig & {
    jwtSecret: string;
  };

  constructor() {
    this.envConfig = {
      jwtSecret: env.get('JWT_SECRET').required().asString(),
    };
  }

  get<T extends keyof typeof this.envConfig>(
    key: T,
  ): (typeof this.envConfig)[T] {
    return this.envConfig[key];
  }
}
