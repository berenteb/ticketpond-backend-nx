import {
  ClientOptions,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

import { ConfigService } from '../config.service';

export function createClientKafka(
  provide: string,
  clientId: string,
  groupId: string,
) {
  return {
    provide,
    useFactory: (configService: ConfigService) => {
      const serviceOptions: ClientOptions = {
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId,
            brokers: [configService.get('kafkaBroker')],
          },
          consumer: {
            groupId,
            allowAutoTopicCreation: true,
          },
        },
      };
      return ClientProxyFactory.create(serviceOptions);
    },
    inject: [ConfigService],
  };
}
