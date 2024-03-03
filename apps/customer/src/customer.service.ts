import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomerService {
  getData(): { message: string } {
    return { message: `Hello ${CustomerService.name}` };
  }
}
