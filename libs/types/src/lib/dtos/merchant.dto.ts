import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Merchant } from '@prisma/client';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { PhoneRegex, PhoneRegexMessage, WithoutId } from '../common.types';

export class CreateMerchantDto implements WithoutId<Merchant> {
  @ApiProperty({ example: 'ABC Organizer Inc' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'We organize events' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'hello@abcorganizer.com' })
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

export class UpdateMerchantDto implements Partial<WithoutId<Merchant>> {
  @ApiPropertyOptional({ example: 'ABC Organizer Inc' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional({ example: 'We organize events' })
  @IsString()
  @IsOptional()
  description: string;

  @ApiPropertyOptional({ example: 'hello@abcorganizer.com' })
  @IsString()
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiPropertyOptional({ example: '123 Main St, New York, NY 10030' })
  @IsString()
  @IsOptional()
  address: string;

  @ApiPropertyOptional({ example: '+1234567890' })
  @IsString()
  @IsOptional()
  @Matches(PhoneRegex, { message: PhoneRegexMessage })
  phone: string;
}

export class MerchantDto implements Merchant {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'ABC Organizer Inc' })
  name: string;

  @ApiProperty({ example: 'We organize events' })
  description: string;

  @ApiProperty({ example: 'hello@abcorganizer.com' })
  email: string;

  @ApiProperty({ example: '123 Main St, New York, NY 10030' })
  address: string;

  @ApiProperty({ example: '+1234567890' })
  phone: string;
}
