import { CreateMerchantDto, MerchantDto, UpdateMerchantDto } from '../dtos';

export abstract class MerchantServiceInterface {
  abstract getMerchants(): Promise<MerchantDto[]>;

  abstract getMerchantById(id: string): Promise<MerchantDto>;
  abstract getMerchantByCustomerId(
    id: string,
  ): Promise<MerchantDto | undefined>;

  abstract createMerchant(merchant: CreateMerchantDto): Promise<MerchantDto>;
  abstract assignCustomerToMerchant(
    merchantId: string,
    customerAuthId: string,
  ): Promise<void>;

  abstract updateMerchant(
    id: string,
    merchant: UpdateMerchantDto,
  ): Promise<MerchantDto>;
  abstract updateMerchantByCustomerId(
    userId: string,
    merchant: UpdateMerchantDto,
  ): Promise<MerchantDto>;
  abstract deleteMerchant(id: string): Promise<void>;
}
