import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PermissionGuard } from '@ticketpond-backend-nx/authz';
import { MerchantPattern } from '@ticketpond-backend-nx/message-patterns';
import {
  CreateMerchantDto,
  MerchantDto,
  PermissionLevel,
  ServiceNames,
  ServiceResponse,
  UpdateMerchantDto,
} from '@ticketpond-backend-nx/types';
import { responseFrom } from '@ticketpond-backend-nx/utils';

@ApiTags('merchant-admin')
@UseGuards(PermissionGuard(PermissionLevel.ADMIN))
@UseGuards(AuthGuard('jwt'))
@Controller('admin/merchant')
export class MerchantAdminController {
  constructor(
    @Inject(ServiceNames.KAFKA_SERVICE)
    private readonly kafkaService: ClientProxy,
  ) {}
  @Get()
  @ApiOkResponse({ type: [MerchantDto] })
  async getMerchants(): Promise<MerchantDto[]> {
    return responseFrom(
      this.kafkaService.send<ServiceResponse<MerchantDto[]>>(
        MerchantPattern.LIST_MERCHANTS,
        {},
      ),
    );
  }

  @Get(':id')
  @ApiOkResponse({ type: MerchantDto })
  async getMerchant(@Param('id') id: string): Promise<MerchantDto> {
    return responseFrom(
      this.kafkaService.send<ServiceResponse<MerchantDto>>(
        MerchantPattern.GET_MERCHANT,
        id,
      ),
    );
  }

  @Post()
  @ApiOkResponse({ type: MerchantDto })
  async createMerchant(
    @Body() merchant: CreateMerchantDto,
  ): Promise<MerchantDto> {
    return responseFrom(
      this.kafkaService.send<ServiceResponse<MerchantDto>>(
        MerchantPattern.CREATE_MERCHANT,
        merchant,
      ),
    );
  }

  @Patch(':id')
  @ApiOkResponse({ type: MerchantDto })
  async updateMerchant(
    @Param('id') id: string,
    @Body() merchant: UpdateMerchantDto,
  ): Promise<MerchantDto> {
    return responseFrom(
      this.kafkaService.send<ServiceResponse<MerchantDto>>(
        MerchantPattern.UPDATE_MERCHANT,
        {
          id,
          merchant,
        },
      ),
    );
  }

  @Delete(':id')
  @ApiOkResponse()
  deleteMerchant(@Param('id') id: string): void {
    this.kafkaService.emit(MerchantPattern.DELETE_MERCHANT, id);
  }
}
