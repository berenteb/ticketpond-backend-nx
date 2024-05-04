import {
  ClientOptions,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

export function configureKafkaClient(
  broker: string,
  clientId: string,
  groupId?: string,
) {
  const serviceOptions: ClientOptions = {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId,
        brokers: [broker],
      },
      consumer: {
        groupId: groupId || clientId,
        allowAutoTopicCreation: true,
      },
    },
  };
  return ClientProxyFactory.create(serviceOptions);
}
