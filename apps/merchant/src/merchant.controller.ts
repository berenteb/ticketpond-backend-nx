import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@ticketpond-backend-nx/auth';
import {
  CreateMerchantDto,
  MerchantDto,
  MerchantServiceInterface,
  type ReqWithUser,
} from '@ticketpond-backend-nx/types';

@ApiTags('Merchant')
@Controller()
export class MerchantController {
  constructor(private readonly merchantService: MerchantServiceInterface) {}

  @Get(':id')
  @ApiOkResponse({ type: MerchantDto })
  async getMerchant(@Param('id') id: string): Promise<MerchantDto> {
    const merchant = await this.merchantService.getMerchantById(id);
    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }
    return merchant;
  }

  @UseGuards(JwtGuard)
  @Post('register')
  @ApiOkResponse({ type: MerchantDto })
  async registerMerchant(
    @Body() merchant: CreateMerchantDto,
    @Req() req: ReqWithUser,
  ): Promise<MerchantDto> {
    const userId = req.user.sub;
    if (!userId) throw new UnauthorizedException();
    const createdMerchant = await this.merchantService.createMerchant(merchant);
    await this.merchantService.assignCustomerToMerchant(
      createdMerchant.id,
      userId,
    );
    return createdMerchant;
  }
}
