import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { MerchantPattern } from '@ticketpond-backend-nx/message-patterns';
import {
  CreateMerchantDto,
  MerchantDto,
  type ReqWithUser,
  ServiceNames,
} from '@ticketpond-backend-nx/types';
import { firstValueFrom } from 'rxjs';

@ApiTags('merchant')
@Controller('merchant')
export class MerchantController implements OnModuleInit {
  constructor(
    @Inject(ServiceNames.MERCHANT_SERVICE)
    private readonly merchantService: ClientKafka,
  ) {}

  async onModuleInit() {
    this.merchantService.subscribeToResponseOf(MerchantPattern.GET_MERCHANT);
    this.merchantService.subscribeToResponseOf(MerchantPattern.CREATE_MERCHANT);
    await this.merchantService.connect();
  }

  @Get(':id')
  @ApiOkResponse({ type: MerchantDto })
  async getMerchant(@Param('id') id: string): Promise<MerchantDto> {
    return firstValueFrom(
      this.merchantService.send<MerchantDto>(MerchantPattern.GET_MERCHANT, id),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('register')
  @ApiOkResponse({ type: MerchantDto })
  async registerMerchant(
    @Body() merchant: CreateMerchantDto,
    @Req() req: ReqWithUser,
  ): Promise<MerchantDto> {
    const userId = req.user.sub;
    if (!userId) throw new UnauthorizedException();
    const createdMerchant = await firstValueFrom(
      this.merchantService.send<MerchantDto>(
        MerchantPattern.CREATE_MERCHANT,
        merchant,
      ),
    );
    this.merchantService.emit(MerchantPattern.ASSIGN_CUSTOMER_TO_MERCHANT, {
      merchantId: createdMerchant.id,
      customerAuthId: userId,
    });

    return createdMerchant;
  }
}
