import { ApiProperty } from '@nestjs/swagger';

export class PaymentDto {
  @ApiProperty()
  clientSecret: string;
}
