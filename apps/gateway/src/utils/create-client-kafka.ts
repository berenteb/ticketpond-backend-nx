import { configureKafkaClient } from '@ticketpond-backend-nx/utils';

import { ConfigService } from '../config.service';

export function createClientKafka(
  provide: string,
  clientId: string,
  groupId?: string,
) {
  return {
    provide,
    useFactory: (configService: ConfigService) =>
      configureKafkaClient(configService.get('kafkaBroker'), clientId, groupId),
    inject: [ConfigService],
  };
}
