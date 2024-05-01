import {
  ClientOptions,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

import { ConfigService } from '../config.service';

export function createClientKafka(provide: string) {
  return {
    provide,
    useFactory: (configService: ConfigService) => {
      const serviceOptions: ClientOptions = {
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'gateway',
            brokers: [configService.get('kafkaBroker')],
          },
          consumer: {
            groupId: 'gateway',
          },
        },
      };
      return ClientProxyFactory.create(serviceOptions);
    },
    inject: [ConfigService],
  };
}
