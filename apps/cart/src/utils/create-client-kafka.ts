import { configureKafkaClient } from '@ticketpond-backend-nx/utils';

import { ConfigService } from '../config.service';

export function createClientKafka(provide: string) {
  return {
    provide,
    useFactory: (configService: ConfigService) => {
      return configureKafkaClient(
        configService.get('kafkaBroker'),
        'cart',
        configService.get('kafkaUsername'),
        configService.get('kafkaPassword'),
      );
    },
    inject: [ConfigService],
  };
}
