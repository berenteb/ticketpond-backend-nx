import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Merchant } from '@prisma/client';
import { PrismaService } from '@ticketpond-backend-nx/prisma';
import {
  CreateMerchantDto,
  MerchantDto,
  MerchantServiceInterface,
  UpdateMerchantDto,
} from '@ticketpond-backend-nx/types';

@Injectable()
export class MerchantService implements MerchantServiceInterface {
  private readonly logger = new Logger(MerchantService.name);

  constructor(private readonly prisma: PrismaService) {}

  async assignCustomerToMerchant(
    merchantId: string,
    customerId: string,
  ): Promise<void> {
    await this.prisma.merchantOnCustomer.create({
      data: { customerId, merchantId },
    });
    this.logger.debug(
      `Assigned customer ${customerId} to merchant ${merchantId}`,
    );
  }

  async createMerchant(
    merchant: CreateMerchantDto,
    id?: string,
  ): Promise<Merchant> {
    const created = await this.prisma.merchant.create({
      data: { ...merchant, id },
    });
    this.logger.debug(`Created merchant with id ${created.id}`);
    return created;
  }

  async getMerchantById(id: string): Promise<Merchant> {
    const merchant = await this.prisma.merchant.findUnique({ where: { id } });
    if (!merchant) {
      throw new NotFoundException(`Merchant with id ${id} not found`);
    }
    this.logger.debug(`Found merchant with id ${id}`);
    return merchant;
  }

  async getMerchants(): Promise<Merchant[]> {
    const merchants = await this.prisma.merchant.findMany();
    this.logger.debug(`Found ${merchants.length} merchants`);
    return merchants;
  }

  async updateMerchant(
    id: string,
    merchant: UpdateMerchantDto,
  ): Promise<Merchant> {
    const updated = await this.prisma.merchant.update({
      where: { id },
      data: merchant,
    });
    this.logger.debug(`Updated merchant with id ${id}`);
    return updated;
  }

  async deleteMerchant(id: string): Promise<void> {
    await this.prisma.merchant.delete({ where: { id } });
    this.logger.debug(`Deleted merchant with id ${id}`);
  }

  async getMerchantByUserId(id: string): Promise<MerchantDto | undefined> {
    const merchant = await this.prisma.merchant.findFirst({
      where: { MerchantOnCustomer: { some: { customerId: id } } },
    });
    if (!merchant) {
      this.logger.debug(`No merchant found for user ${id}`);
    } else {
      this.logger.debug(`Found merchant for user ${id}`);
    }
    return merchant;
  }

  async updateMerchantByUserId(userId: string, merchant: UpdateMerchantDto) {
    const merchantForUser = await this.getMerchantByUserId(userId);
    if (!merchantForUser) {
      throw new NotFoundException(`Merchant for user ${userId} not found`);
    }
    const updated = await this.prisma.merchant.update({
      where: { id: merchantForUser.id },
      data: merchant,
    });
    this.logger.debug(`Updated merchant for user ${userId}`);
    return updated;
  }
}
