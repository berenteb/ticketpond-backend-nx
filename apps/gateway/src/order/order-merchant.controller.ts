import {
  Controller,
  ForbiddenException,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PermissionGuard } from '@ticketpond-backend-nx/authz';
import {
  MerchantPattern,
  OrderPatterns,
} from '@ticketpond-backend-nx/message-patterns';
import {
  DeepOrderWithCustomerDto,
  MerchantDto,
  OrderWithCustomerDto,
  PermissionLevel,
  type ReqWithUser,
  ServiceNames,
} from '@ticketpond-backend-nx/types';
import { firstValueFrom } from 'rxjs';

@ApiTags('order-merchant')
@UseGuards(PermissionGuard(PermissionLevel.MERCHANT))
@UseGuards(AuthGuard('jwt'))
@Controller('merchant-admin/order')
export class OrderMerchantController implements OnModuleInit {
  constructor(
    @Inject(ServiceNames.ORDER_SERVICE)
    private readonly orderService: ClientKafka,
    @Inject(ServiceNames.MERCHANT_SERVICE)
    private readonly merchantService: ClientKafka,
  ) {}

  async onModuleInit() {
    this.orderService.subscribeToResponseOf(
      OrderPatterns.LIST_ORDERS_FOR_MERCHANT,
    );
    this.orderService.subscribeToResponseOf(
      OrderPatterns.GET_ORDER_WITH_CUSTOMER_FOR_MERCHANT,
    );
    this.merchantService.subscribeToResponseOf(
      MerchantPattern.GET_MERCHANT_BY_USER_ID,
    );
    await this.orderService.connect();
    await this.merchantService.connect();
  }

  @Get()
  @ApiOkResponse({ type: [OrderWithCustomerDto] })
  async getOrders(@Req() req: ReqWithUser): Promise<OrderWithCustomerDto[]> {
    const merchant = await this.getMerchantByUserId(req.user.sub);
    if (!merchant) throw new ForbiddenException();
    return firstValueFrom(
      this.orderService.send<OrderWithCustomerDto[]>(
        OrderPatterns.LIST_ORDERS_FOR_MERCHANT,
        merchant.id,
      ),
    );
  }

  @Get(':id')
  @ApiOkResponse({ type: DeepOrderWithCustomerDto })
  @ApiNotFoundResponse()
  async getOrder(
    @Param('id') id: string,
    @Req() req: ReqWithUser,
  ): Promise<DeepOrderWithCustomerDto> {
    const merchant = await this.getMerchantByUserId(req.user.sub);
    if (!merchant) throw new ForbiddenException();
    return firstValueFrom(
      this.orderService.send<DeepOrderWithCustomerDto>(
        OrderPatterns.GET_ORDER_WITH_CUSTOMER_FOR_MERCHANT,
        { id, merchantId: merchant.id },
      ),
    );
  }

  private async getMerchantByUserId(userId: string): Promise<MerchantDto> {
    return firstValueFrom(
      this.merchantService.send<MerchantDto>(
        MerchantPattern.GET_MERCHANT_BY_USER_ID,
        userId,
      ),
    );
  }
}
