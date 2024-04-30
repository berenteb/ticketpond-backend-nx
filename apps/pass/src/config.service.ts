import * as dotenv from 'dotenv';
import * as env from 'env-var';
dotenv.config();

export class ConfigService {
  private readonly envConfig: {
    host: string;
    port: number;
    walletPassphrase: string;
    walletPassTypeIdentifier: string;
    walletTeamIdentifier: string;
    walletOrganizationName: string;
  };

  constructor() {
    this.envConfig = {
      host: env.get('HOST').required().asString(),
      port: env.get('PORT').required().asPortNumber(),
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
