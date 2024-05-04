import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PermissionGuard } from '@ticketpond-backend-nx/authz';
import {
  MerchantPattern,
  TicketPatterns,
} from '@ticketpond-backend-nx/message-patterns';
import {
  CreateTicketDto,
  DeepTicketDto,
  MerchantDto,
  PermissionLevel,
  type ReqWithUser,
  ServiceNames,
  ServiceResponse,
  TicketDto,
  UpdateTicketDto,
} from '@ticketpond-backend-nx/types';
import { responseFrom } from '@ticketpond-backend-nx/utils';

@UseGuards(PermissionGuard(PermissionLevel.MERCHANT))
@UseGuards(AuthGuard('jwt'))
@ApiTags('ticket-merchant')
@Controller('merchant-admin/ticket')
export class TicketMerchantController {
  constructor(
    @Inject(ServiceNames.KAFKA_SERVICE)
    private readonly kafkaService: ClientKafka,
  ) {}

  @Get()
  @ApiOkResponse({ type: [DeepTicketDto] })
  async getTickets(@Req() req: ReqWithUser): Promise<DeepTicketDto[]> {
    const merchant = await this.getMerchantIdByUserId(req.user.sub);

    return responseFrom(
      this.kafkaService.send<ServiceResponse<DeepTicketDto[]>>(
        TicketPatterns.LIST_TICKETS_BY_MERCHANT_ID,
        merchant.id,
      ),
    );
  }

  @Get(':id')
  @ApiOkResponse({ type: DeepTicketDto })
  async getTicketById(
    @Param('id') id: string,
    @Req() req: ReqWithUser,
  ): Promise<DeepTicketDto> {
    const merchant = await this.getMerchantIdByUserId(req.user.sub);
    return responseFrom(
      this.kafkaService.send<ServiceResponse<DeepTicketDto>>(
        TicketPatterns.GET_TICKET_BY_MERCHANT_ID,
        {
          id,
          merchantId: merchant.id,
        },
      ),
    );
  }

  @Get('experience/:id')
  @ApiOkResponse({ type: [TicketDto] })
  async getTicketsForExperience(
    @Param('id') experienceId: string,
  ): Promise<TicketDto[]> {
    return responseFrom(
      this.kafkaService.send<ServiceResponse<TicketDto[]>>(
        TicketPatterns.LIST_TICKETS_FOR_EXPERIENCE,
        experienceId,
      ),
    );
  }

  @Post()
  @ApiOkResponse({ type: TicketDto })
  async createTicket(
    @Body() ticket: CreateTicketDto,
    @Req() req: ReqWithUser,
  ): Promise<TicketDto> {
    const merchant = await this.getMerchantIdByUserId(req.user.sub);
    return responseFrom(
      this.kafkaService.send<ServiceResponse<TicketDto>>(
        TicketPatterns.CREATE_TICKET_BY_MERCHANT_ID,
        {
          ticket,
          merchantId: merchant.id,
        },
      ),
    );
  }

  @Patch(':id')
  @ApiOkResponse({ type: TicketDto })
  async updateTicket(
    @Param('id') id: string,
    @Body() ticket: UpdateTicketDto,
    @Req() req: ReqWithUser,
  ): Promise<TicketDto> {
    const merchant = await this.getMerchantIdByUserId(req.user.sub);
    return responseFrom(
      this.kafkaService.send<ServiceResponse<TicketDto>>(
        TicketPatterns.UPDATE_TICKET_BY_MERCHANT_ID,
        {
          id,
          ticket,
          merchantId: merchant.id,
        },
      ),
    );
  }

  @Delete(':id')
  @ApiOkResponse()
  async deleteTicket(
    @Param('id') id: string,
    @Req() req: ReqWithUser,
  ): Promise<void> {
    const merchant = await this.getMerchantIdByUserId(req.user.sub);
    this.kafkaService.emit(TicketPatterns.DELETE_TICKET_BY_MERCHANT_ID, {
      id,
      merchantId: merchant.id,
    });
  }

  private async getMerchantIdByUserId(userId: string): Promise<MerchantDto> {
    const merchant = await responseFrom(
      this.kafkaService.send<ServiceResponse<MerchantDto>>(
        MerchantPattern.GET_MERCHANT_BY_USER_ID,
        userId,
      ),
    );
    if (!merchant) {
      throw new UnauthorizedException();
    }
    return merchant;
  }
}
