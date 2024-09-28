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
      configureKafkaClient(
        configService.get('kafkaBroker'),
        clientId,
        configService.get('kafkaUsername'),
        configService.get('kafkaPassword'),
        groupId,
      ),
    inject: [ConfigService],
  };
}
