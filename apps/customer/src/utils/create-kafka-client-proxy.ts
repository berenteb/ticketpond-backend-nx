import {
  ClientOptions,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

import { ClientProxyOptions, ConfigService } from '../config.service';

export function createKafkaClientProxy(
  provide: string,
  configName: keyof ClientProxyOptions,
) {
  return {
    provide,
    useFactory: (configService: ConfigService) => {
      const serviceOptions: ClientOptions = {
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'customer',
            brokers: [configService.get(configName).broker],
          },
          consumer: {
            groupId: 'customer',
          },
        },
      };
      return ClientProxyFactory.create(serviceOptions);
    },
    inject: [ConfigService],
  };
}
