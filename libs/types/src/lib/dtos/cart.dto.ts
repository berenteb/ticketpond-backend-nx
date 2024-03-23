import { ApiProperty } from '@nestjs/swagger';
import { Cart, CartItem } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { DeepTicketDto } from './deep-ticket.dto';

export class CartItemDto implements CartItem {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  cartId: string;
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  ticketId: string;
  @ApiProperty()
  ticket: DeepTicketDto;
}

export class CartDto implements Cart {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  customerId: string;
  @ApiProperty({ type: [CartItemDto] })
  items: CartItemDto[];
}

export class AddToCartDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsString()
  @IsNotEmpty()
  ticketId: string;
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

export class RemoveFromCartDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsString()
  @IsNotEmpty()
  ticketId: string;
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
