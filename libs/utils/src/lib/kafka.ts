import {
  ClientOptions,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { SASLOptions } from '@nestjs/microservices/external/kafka.interface';
import { ServiceResponse } from '@ticketpond-backend-nx/types';
import { firstValueFrom, Observable } from 'rxjs';

import { handleServiceResponse } from './service-response';

export function configureKafkaClient(
  broker: string,
  clientId: string,
  username?: string,
  password?: string,
  groupId?: string,
) {
  const serviceOptions: ClientOptions = {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId,
        brokers: [broker],
        sasl: getSaslOrNull(username, password),
      },
      consumer: {
        groupId: groupId || clientId,
        allowAutoTopicCreation: true,
      },
    },
  };
  return ClientProxyFactory.create(serviceOptions);
}

export async function responseFrom<T>(
  source: Observable<ServiceResponse<T>>,
): Promise<T> {
  const response = await firstValueFrom(source);
  return handleServiceResponse(response);
}

export function getSaslOrNull(
  username?: string,
  password?: string,
): SASLOptions | undefined {
  return username && password
    ? {
        mechanism: 'plain',
        username,
        password,
      }
    : undefined;
}
