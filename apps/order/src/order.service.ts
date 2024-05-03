import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import {
  NotificationPatterns,
  PassPatterns,
} from '@ticketpond-backend-nx/message-patterns';
import { PrismaService } from '@ticketpond-backend-nx/prisma';
import {
  CartDto,
  DeepOrderDto,
  DeepOrderWithCustomerDto,
  OrderDto,
  OrderServiceInterface,
  OrderWithCustomerDto,
  ServiceNames,
} from '@ticketpond-backend-nx/types';
import {
  generateDateBasedSerialNumber,
  generateSerialNumber,
} from '@ticketpond-backend-nx/utils';

@Injectable()
export class OrderService implements OrderServiceInterface {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(ServiceNames.KAFKA_SERVICE)
    private readonly kafkaService: ClientKafka,
  ) {}

  async getOrderById(id: string): Promise<DeepOrderDto> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { ticket: { include: { experience: true } } } },
      },
    });
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    this.logger.debug(`Found order with id ${id}`);
    return order;
  }

  async getOrderByIdForCustomer(
    id: string,
    customerAuthId: string,
  ): Promise<DeepOrderDto> {
    const order = await this.prisma.order.findFirst({
      where: {
        id,
        customer: {
          authId: customerAuthId,
        },
      },
      include: {
        items: { include: { ticket: { include: { experience: true } } } },
      },
    });
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    this.logger.debug(`Found order with id ${id}`);
    return order;
  }

  async getOrders(): Promise<DeepOrderWithCustomerDto[]> {
    const orders = await this.prisma.order.findMany({
      include: {
        items: { include: { ticket: { include: { experience: true } } } },
        customer: true,
      },
    });
    this.logger.debug(`Found ${orders.length} orders`);
    return orders;
  }

  async getOrdersForCustomer(customerAuthId: string): Promise<OrderDto[]> {
    const order = await this.prisma.order.findMany({
      where: {
        customer: {
          authId: customerAuthId,
        },
      },
      include: { items: true },
    });
    this.logger.debug(
      `Found ${order.length} orders for customer with id ${customerAuthId}`,
    );
    return order;
  }

  async deleteOrder(id: string): Promise<void> {
    await this.prisma.order.delete({ where: { id } });
    await this.prisma.orderItem.deleteMany({ where: { orderId: id } });
    this.logger.debug(`Deleted order with id ${id}`);
  }

  async createOrder(cart: CartDto): Promise<DeepOrderDto> {
    const { customerId, items } = cart;
    const sum = items.reduce((acc, item) => acc + item.ticket.price, 0);
    const defaultStatus =
      sum === 0
        ? {
            orderStatus: OrderStatus.PAID,
            paymentStatus: PaymentStatus.SUCCESS,
          }
        : {};
    const created = await this.prisma.order.create({
      data: {
        customerId,
        serialNumber: generateDateBasedSerialNumber(),
        ...defaultStatus,
        items: {
          create: items.map((item) => ({
            ticketId: item.ticket.id,
            price: item.ticket.price,
            serialNumber: generateSerialNumber(),
          })),
        },
      },
      include: {
        items: { include: { ticket: { include: { experience: true } } } },
      },
    });
    this.logger.debug(`Created order with id ${created.id}`);
    return created;
  }

  async getOrderByIdWithCustomer(
    id: string,
  ): Promise<DeepOrderWithCustomerDto> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { ticket: { include: { experience: true } } } },
        customer: true,
      },
    });
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    this.logger.debug(`Found order with id ${id}`);
    return order;
  }

  async getOrdersForMerchant(
    merchantId: string,
  ): Promise<OrderWithCustomerDto[]> {
    const orders = await this.prisma.order.findMany({
      where: { items: { some: { ticket: { experience: { merchantId } } } } },
      include: { items: true, customer: true },
    });
    this.logger.debug(
      `Found ${orders.length} orders for merchant with id ${merchantId}`,
    );
    return orders;
  }

  async isOwnProperty(itemId: string, ownerId: string): Promise<boolean> {
    const order = await this.prisma.order.findFirst({
      where: { id: itemId, customer: { authId: ownerId } },
    });
    return !!order;
  }

  async isConnectedToMerchant(
    itemId: string,
    merchantId: string,
  ): Promise<boolean> {
    const order = await this.prisma.order.findFirst({
      where: {
        id: itemId,
        items: { some: { ticket: { experience: { merchantId } } } },
      },
    });
    return !!order;
  }

  async fulfillOrder(id: string): Promise<void> {
    const order = await this.prisma.order.update({
      where: { id },
      data: {
        orderStatus: OrderStatus.PAID,
        paymentStatus: PaymentStatus.SUCCESS,
      },
      include: {
        items: { include: { ticket: { include: { experience: true } } } },
        customer: true,
      },
    });
    await this.generatePasses(order);
    await this.sendOrderSuccess(order);
    this.logger.debug(`Fulfilled order with id ${id}`);
  }

  async failOrder(id: string): Promise<void> {
    await this.prisma.order.update({
      where: { id },
      data: { paymentStatus: PaymentStatus.FAIL },
    });
    this.logger.debug(`Failed order with id ${id}`);
  }

  async cancelOrder(id: string): Promise<void> {
    await this.prisma.order.update({
      where: { id },
      data: { orderStatus: OrderStatus.CANCELLED },
    });
    this.logger.debug(`Cancelled order with id ${id}`);
  }

  async generatePasses(order: DeepOrderDto): Promise<void> {
    this.kafkaService.emit(PassPatterns.GENERATE_PASSES, order);
    this.logger.debug(`Generated pass for order with id ${order.id}`);
  }

  async sendOrderSuccess(order: DeepOrderDto): Promise<void> {
    this.kafkaService.emit(NotificationPatterns.SEND_ORDER_CONFIRMATION, order);
    this.logger.debug(
      `Sent order success notification for order with id ${order.id}`,
    );
  }
}
