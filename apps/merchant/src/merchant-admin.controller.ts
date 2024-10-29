import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard, PermissionGuard } from '@ticketpond-backend-nx/auth';
import {
  CreateMerchantDto,
  MerchantDto,
  MerchantServiceInterface,
  PermissionLevel,
  UpdateMerchantDto,
} from '@ticketpond-backend-nx/types';

@UseGuards(PermissionGuard(PermissionLevel.ADMIN))
@UseGuards(JwtGuard)
@ApiTags('Merchant-Admin')
@Controller('admin')
@ApiCookieAuth('jwt')
export class MerchantAdminController {
  constructor(private readonly merchantService: MerchantServiceInterface) {}

  @Get()
  @ApiOkResponse({ type: [MerchantDto] })
  async getMerchants(): Promise<MerchantDto[]> {
    return this.merchantService.getMerchants();
  }

  @Get(':id')
  @ApiOkResponse({ type: MerchantDto })
  async getMerchant(@Param('id') id: string): Promise<MerchantDto> {
    const merchant = await this.merchantService.getMerchantById(id);
    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }
    return merchant;
  }

  @Post()
  @ApiOkResponse({ type: MerchantDto })
  async createMerchant(
    @Body() merchant: CreateMerchantDto,
  ): Promise<MerchantDto> {
    return this.merchantService.createMerchant(merchant);
  }

  @Patch(':id')
  @ApiOkResponse({ type: MerchantDto })
  async updateMerchant(
    @Param('id') id: string,
    @Body() merchant: UpdateMerchantDto,
  ): Promise<MerchantDto> {
    const updatedMerchant = await this.merchantService.updateMerchant(
      id,
      merchant,
    );
    if (!updatedMerchant) {
      throw new NotFoundException('Merchant not found');
    }
    return updatedMerchant;
  }

  @Delete(':id')
  @ApiOkResponse()
  deleteMerchant(@Param('id') id: string): Promise<void> {
    return this.merchantService.deleteMerchant(id);
  }
}
