import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Order, OrderItem } from '@prisma/client';
import { CustomerDto } from './customer.dto';
import { DeepTicketDto } from './deep-ticket.dto';

export class OrderItemDto implements OrderItem {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  orderId: string;
  @ApiProperty({ example: 123.0 })
  price: number;
  @ApiProperty({ example: 'TP-123456' })
  serialNumber: string;
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  ticketId: string;
}

export class DeepOrderItemDto extends OrderItemDto {
  @ApiProperty()
  ticket: DeepTicketDto;
}

export class OrderDto implements Order {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  customerId: string;
  @ApiProperty({ example: '2021-06-01T00:00:00.000Z' })
  createdAt: Date;
  @ApiProperty({ type: [OrderItemDto] })
  items: OrderItemDto[];
  @ApiProperty({ example: $Enums.PaymentStatus.UNPAID })
  paymentStatus: 'UNPAID' | 'FAIL' | 'SUCCESS';
  @ApiProperty({ example: $Enums.OrderStatus.PENDING })
  orderStatus: 'PENDING' | 'PAID' | 'CANCELLED';
  @ApiProperty({ example: '2023.01.01.123456' })
  serialNumber: string;
}

export class OrderWithCustomerDto extends OrderDto {
  @ApiProperty({ type: CustomerDto })
  customer: CustomerDto;
}

export class DeepOrderDto extends OrderDto {
  @ApiProperty({ type: [DeepOrderItemDto] })
  items: DeepOrderItemDto[];
}

export class DeepOrderWithCustomerDto extends DeepOrderDto {
  @ApiProperty({ type: CustomerDto })
  customer: CustomerDto;
}
