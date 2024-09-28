import { configureKafkaClient } from '@ticketpond-backend-nx/utils';

import { ConfigService } from '../config.service';

export function createClientKafka(provide: string) {
  return {
    provide,
    useFactory: (configService: ConfigService) =>
      configureKafkaClient(
        configService.get('kafkaBroker'),
        'order',
        configService.get('kafkaUsername'),
        configService.get('kafkaPassword'),
      ),
    inject: [ConfigService],
  };
}
