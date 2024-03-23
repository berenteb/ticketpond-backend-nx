import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Experience } from '@prisma/client';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { WithoutId } from '../common.types';

export class CreateExperienceDto
  implements Omit<WithoutId<Experience>, 'merchantId'>
{
  @ApiProperty({ example: 'Summer Festival' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'A festival for the summer' })
  @IsString()
  description: string;

  @ApiProperty({ example: '2023-06-01T00:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({ example: '2023-06-10T00:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  endDate: Date;

  @ApiProperty({ example: 'https://www.example.com/image.png' })
  @IsString()
  bannerImage: string;
}

export class UpdateExperienceDto implements Partial<WithoutId<Experience>> {
  @ApiPropertyOptional({ example: 'Summer Festival' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @ApiPropertyOptional({ example: 'A festival for the summer' })
  @IsString()
  @IsOptional()
  description: string;

  @ApiPropertyOptional({ example: '2023-06-01T00:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  @IsOptional()
  startDate: Date;

  @ApiPropertyOptional({ example: '2023-06-10T00:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  @IsOptional()
  endDate: Date;

  @ApiPropertyOptional({ example: 'https://www.example.com/image.png' })
  @IsString()
  @IsOptional()
  bannerImage: string;
}

export class ExperienceDto implements Experience {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  merchantId: string;
  @ApiProperty({ example: 'Summer Festival' })
  name: string;
  @ApiProperty({ example: 'A festival for the summer' })
  description: string;
  @ApiProperty({ example: '2023-06-01T00:00:00.000Z' })
  startDate: Date;
  @ApiProperty({ example: '2023-06-10T00:00:00.000Z' })
  endDate: Date;
  @ApiProperty({ example: 'https://www.example.com/image.png' })
  bannerImage: string;
}
