import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@ticketpond-backend-nx/prisma';
import { PrismaMock } from '@ticketpond-backend-nx/testing';

import { MerchantMock } from './__mocks__/entities/merchantMock';
import { MerchantService } from './merchant.service';

let service: MerchantService;

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      MerchantService,
      { provide: PrismaService, useValue: PrismaMock },
    ],
  }).compile();

  service = module.get<MerchantService>(MerchantService);
});

it('should create a merchant', async () => {
  PrismaMock.merchant.create.mockResolvedValue(MerchantMock);
  const merchant = await service.createMerchant(MerchantMock);

  expect(merchant).toEqual(MerchantMock);
  expect(PrismaMock.merchant.create).toHaveBeenCalledWith({
    data: { ...MerchantMock, id: undefined },
  });
});

it('should create a merchant with an id', async () => {
  PrismaMock.merchant.create.mockResolvedValue(MerchantMock);
  const merchant = await service.createMerchant(MerchantMock, 'merchant-id');

  expect(merchant).toEqual(MerchantMock);
  expect(PrismaMock.merchant.create).toHaveBeenCalledWith({
    data: { ...MerchantMock, id: 'merchant-id' },
  });
});

it('should get a merchant by id', async () => {
  PrismaMock.merchant.findUnique.mockResolvedValue(MerchantMock);
  const merchant = await service.getMerchantById('merchant-id');

  expect(merchant).toEqual(MerchantMock);
  expect(PrismaMock.merchant.findUnique).toHaveBeenCalledWith({
    where: { id: 'merchant-id' },
  });
});

it('should return null when getting a merchant by id', async () => {
  PrismaMock.merchant.findUnique.mockResolvedValue(null);
  const merchant = await service.getMerchantById('merchant-id');
  expect(merchant).toBeNull();
});

it('should get all merchants', async () => {
  PrismaMock.merchant.findMany.mockResolvedValue([MerchantMock]);
  const merchants = await service.getMerchants();

  expect(merchants).toEqual([MerchantMock]);
  expect(PrismaMock.merchant.findMany).toHaveBeenCalled();
});

it('should update a merchant', async () => {
  PrismaMock.merchant.update.mockResolvedValue(MerchantMock);
  const merchant = await service.updateMerchant('merchant-id', MerchantMock);

  expect(merchant).toEqual(MerchantMock);
  expect(PrismaMock.merchant.update).toHaveBeenCalledWith({
    where: { id: 'merchant-id' },
    data: MerchantMock,
  });
});

it('should delete a merchant', async () => {
  await service.deleteMerchant('merchant-id');

  expect(PrismaMock.merchant.delete).toHaveBeenCalledWith({
    where: { id: 'merchant-id' },
  });
});

it('should assign a customer to a merchant', async () => {
  await service.assignCustomerToMerchant('merchant-id', 'customer-id');

  expect(PrismaMock.merchantOnCustomer.create).toHaveBeenCalledWith({
    data: {
      customer: {
        connect: {
          id: 'customer-id',
        },
      },
      merchant: {
        connect: {
          id: 'merchant-id',
        },
      },
    },
  });
});
