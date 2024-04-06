import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PermissionGuard } from '@ticketpond-backend-nx/authz';
import {
  MerchantPattern,
  TicketPatterns,
} from '@ticketpond-backend-nx/message-patterns';
import {
  DeepTicketDto,
  MerchantDto,
  PermissionLevel,
  type ReqWithUser,
  ServiceNames,
  TicketDto,
  UpdateTicketDto,
} from '@ticketpond-backend-nx/types';
import { firstValueFrom } from 'rxjs';

@UseGuards(PermissionGuard(PermissionLevel.MERCHANT))
@UseGuards(AuthGuard('jwt'))
@ApiTags('ticket-merchant')
@Controller('merchant-admin/ticket')
export class TicketMerchantController {
  constructor(
    @Inject(ServiceNames.TICKET_SERVICE)
    private readonly ticketService: ClientProxy,
    @Inject(ServiceNames.MERCHANT_SERVICE)
    private readonly merchantService: ClientProxy,
  ) {}

  @Get()
  @ApiOkResponse({ type: [DeepTicketDto] })
  async getTickets(@Req() req: ReqWithUser): Promise<DeepTicketDto[]> {
    const merchant = await this.getMerchantIdByUserId(req.user.sub);

    return firstValueFrom(
      this.ticketService.send<DeepTicketDto[]>(
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
    return firstValueFrom(
      this.ticketService.send<DeepTicketDto>(
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
    return firstValueFrom(
      this.ticketService.send<TicketDto[]>(
        TicketPatterns.LIST_TICKETS_FOR_EXPERIENCE,
        experienceId,
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
    return firstValueFrom(
      this.ticketService.send<TicketDto>(
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
    return firstValueFrom(
      this.ticketService.send<void>(
        TicketPatterns.DELETE_TICKET_BY_MERCHANT_ID,
        {
          id,
          merchantId: merchant.id,
        },
      ),
    );
  }

  private async getMerchantIdByUserId(userId: string): Promise<MerchantDto> {
    const merchant = await firstValueFrom(
      this.merchantService.send<MerchantDto>(
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
