import { DeepOrderDto } from '../dtos';

export abstract class PassServiceInterface {
  abstract generatePasses(order: DeepOrderDto): Promise<void>;
  abstract getQrcode(text: string, scale?: number): Promise<Buffer>;
}
