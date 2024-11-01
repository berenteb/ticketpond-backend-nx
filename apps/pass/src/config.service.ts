import * as dotenv from 'dotenv';
import * as env from 'env-var';

dotenv.config();

export class ConfigService {
  private readonly envConfig: {
    port: number;
    kafkaBroker: string;
    kafkaUsername?: string;
    kafkaPassword?: string;
    walletPassphrase: string;
    walletPassTypeIdentifier: string;
    walletTeamIdentifier: string;
    walletOrganizationName: string;
  };

  constructor() {
    this.envConfig = {
      port: env.get('PORT').required().asPortNumber(),
      kafkaBroker: env.get('KAFKA_BROKER').required().asString(),
      kafkaUsername: env.get('KAFKA_USERNAME').asString(),
      kafkaPassword: env.get('KAFKA_PASSWORD').asString(),
      walletPassphrase: env.get('WALLET_PASSPHRASE').required().asString(),
      walletPassTypeIdentifier: env
        .get('WALLET_PASS_TYPE_IDENTIFIER')
        .required()
        .asString(),
      walletTeamIdentifier: env
        .get('WALLET_TEAM_IDENTIFIER')
        .required()
        .asString(),
      walletOrganizationName: env
        .get('WALLET_ORGANIZATION_NAME')
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
