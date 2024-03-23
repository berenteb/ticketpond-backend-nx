import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CustomerDto } from './customer.dto';
import { DeepOrderItemDto } from './order.dto';

export enum ValidationResponseMessage {
  VALID = 'VALID',
  INVALID = 'INVALID',
  NOT_FOUND = 'NOT_FOUND',
  TOO_EARLY = 'TOO_EARLY',
  TOO_LATE = 'TOO_LATE',
  UNPAID = 'UNPAID',
}

export class ValidationRequestDto {
  @ApiProperty({ example: '1234567890' })
  @IsString()
  @IsNotEmpty()
  ticketSerialNumber: string;
}
export class ValidationResponseDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  @IsNotEmpty()
  isValid: boolean;

  @ApiProperty({ type: DeepOrderItemDto })
  @IsOptional()
  orderItem?: DeepOrderItemDto;

  @ApiProperty({ type: CustomerDto })
  @IsOptional()
  customer?: CustomerDto;

  @ApiProperty({ example: ValidationResponseMessage.VALID })
  @IsString()
  @IsOptional()
  message?: ValidationResponseMessage;
}
