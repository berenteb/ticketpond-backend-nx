import {
  Body,
  Controller,
  Get,
  Inject,
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
export class MerchantController {
  constructor(
    @Inject(ServiceNames.KAFKA_SERVICE)
    private readonly kafkaService: ClientKafka,
  ) {}

  @Get(':id')
  @ApiOkResponse({ type: MerchantDto })
  async getMerchant(@Param('id') id: string): Promise<MerchantDto> {
    return firstValueFrom(
      this.kafkaService.send<MerchantDto>(MerchantPattern.GET_MERCHANT, id),
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
      this.kafkaService.send<MerchantDto>(
        MerchantPattern.CREATE_MERCHANT,
        merchant,
      ),
    );
    this.kafkaService.emit(MerchantPattern.ASSIGN_CUSTOMER_TO_MERCHANT, {
      merchantId: createdMerchant.id,
      customerAuthId: userId,
    });

    return createdMerchant;
  }
}
