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
    customerAuthId: string,
  ): Promise<void> {
    await this.prisma.merchantOnCustomer.create({
      data: {
        merchant: { connect: { id: merchantId } },
        customer: { connect: { authId: customerAuthId } },
      },
    });
    this.logger.debug(
      `Assigned customer ${customerAuthId} to merchant ${merchantId}`,
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

  async getMerchantByCustomerAuthId(
    customerAuthId: string,
  ): Promise<MerchantDto | undefined> {
    const merchant = await this.prisma.merchant.findFirst({
      where: {
        MerchantOnCustomer: { some: { customer: { authId: customerAuthId } } },
      },
    });
    if (!merchant) {
      this.logger.debug(`No merchant found for user ${customerAuthId}`);
    } else {
      this.logger.debug(`Found merchant for user ${customerAuthId}`);
    }
    return merchant;
  }

  async updateMerchantByCustomerAuthId(
    customerAuthId: string,
    merchant: UpdateMerchantDto,
  ) {
    const merchantForUser =
      await this.getMerchantByCustomerAuthId(customerAuthId);
    if (!merchantForUser) {
      throw new NotFoundException(
        `Merchant for user ${customerAuthId} not found`,
      );
    }
    const updated = await this.prisma.merchant.update({
      where: { id: merchantForUser.id },
      data: merchant,
    });
    this.logger.debug(`Updated merchant for user ${customerAuthId}`);
    return updated;
  }
}
