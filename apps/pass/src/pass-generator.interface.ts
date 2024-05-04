import { DeepOrderItemDto } from '@ticketpond-backend-nx/types';

export interface PassGeneratorInterface {
  generatePass(orderItem: DeepOrderItemDto): Promise<void>;
}
