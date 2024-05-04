import { InternalServerErrorException } from '@nestjs/common';
import {
  ClientOptions,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { ServiceResponse } from '@ticketpond-backend-nx/types';
import { firstValueFrom, Observable } from 'rxjs';

import { handleServiceResponse } from './service-response';

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

export async function responseFrom<T>(
  source: Observable<ServiceResponse<T>>,
): Promise<T> {
  const response = await firstValueFrom(source);
  if ('error' in response) {
    handleServiceResponse(response);
    throw new InternalServerErrorException(response.error.message);
  }
  return response.data;
}
