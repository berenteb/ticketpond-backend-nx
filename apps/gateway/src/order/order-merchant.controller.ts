import { Controller, Get, Inject, Param, Req, UseGuards } from '@nestjs/common';
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
  ServiceResponse,
} from '@ticketpond-backend-nx/types';
import { responseFrom } from '@ticketpond-backend-nx/utils';

@ApiTags('order-merchant')
@UseGuards(PermissionGuard(PermissionLevel.MERCHANT))
@UseGuards(AuthGuard('jwt'))
@Controller('merchant-admin/order')
export class OrderMerchantController {
  constructor(
    @Inject(ServiceNames.KAFKA_SERVICE)
    private readonly kafkaService: ClientKafka,
  ) {}

  @Get()
  @ApiOkResponse({ type: [OrderWithCustomerDto] })
  async getOrders(@Req() req: ReqWithUser): Promise<OrderWithCustomerDto[]> {
    const merchant = await this.getMerchantByUserId(req.user.sub);
    return responseFrom(
      this.kafkaService.send<ServiceResponse<OrderWithCustomerDto[]>>(
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
    return responseFrom(
      this.kafkaService.send<ServiceResponse<DeepOrderWithCustomerDto>>(
        OrderPatterns.GET_ORDER_WITH_CUSTOMER_FOR_MERCHANT,
        { id, merchantId: merchant.id },
      ),
    );
  }

  private async getMerchantByUserId(userId: string): Promise<MerchantDto> {
    return responseFrom(
      this.kafkaService.send<ServiceResponse<MerchantDto>>(
        MerchantPattern.GET_MERCHANT_BY_USER_ID,
        userId,
      ),
    );
  }
}
