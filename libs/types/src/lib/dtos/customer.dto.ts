import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Customer } from '@prisma/client';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

import { PhoneRegex, PhoneRegexMessage, WithoutId } from '../common.types';

export class CreateCustomerDto implements Omit<WithoutId<Customer>, 'authId'> {
  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123 Main St, New York, NY 10030' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  @IsNotEmpty()
  @Matches(PhoneRegex, { message: PhoneRegexMessage })
  phone: string;
}

export class UpdateCustomerDto implements Partial<WithoutId<Customer>> {
  @ApiPropertyOptional({ example: 'John' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiPropertyOptional({ example: 'john.doe@example.com' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '123 Main St, New York, NY 10030' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiPropertyOptional({ example: '+1234567890' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Matches(PhoneRegex, { message: PhoneRegexMessage })
  phone: string;
}

export class CustomerDto implements Customer {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  authId: string;

  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ example: '123 Main St, New York, NY 10030' })
  address: string;

  @ApiProperty({ example: '+1234567890' })
  phone: string;
}
