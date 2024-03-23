import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@ticketpond-backend-nx/prisma';

import { ExperienceMock } from './__mocks__/entities/experience.mock';
import { PrismaMock } from './__mocks__/services/prisma.mock';
import { ExperienceService } from './experience.service';

let service: ExperienceService;

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      ExperienceService,
      { provide: PrismaService, useValue: PrismaMock },
    ],
  }).compile();

  service = module.get<ExperienceService>(ExperienceService);
});

it('should create an experience', async () => {
  PrismaMock.experience.create.mockResolvedValue(ExperienceMock);
  const created = await service.createExperience(ExperienceMock, '1');

  expect(created).toEqual(ExperienceMock);
  expect(PrismaMock.experience.create).toHaveBeenCalledWith({
    data: { ...ExperienceMock, merchantId: '1' },
  });
});

it('should get experiences by merchant id', async () => {
  PrismaMock.experience.findMany.mockResolvedValue([ExperienceMock]);
  const experiences = await service.getExperiencesByMerchantId('1');

  expect(experiences).toEqual([ExperienceMock]);
  expect(PrismaMock.experience.findMany).toHaveBeenCalledWith({
    where: { merchantId: '1' },
  });
});

it('should get experience by id', async () => {
  PrismaMock.experience.findUnique.mockResolvedValue(ExperienceMock);
  const experience = await service.getExperienceById('1');

  expect(experience).toEqual(ExperienceMock);
  expect(PrismaMock.experience.findUnique).toHaveBeenCalledWith({
    where: { id: '1' },
    include: { tickets: true, merchant: true },
  });
});

it('should get all experiences', async () => {
  PrismaMock.experience.findMany.mockResolvedValue([ExperienceMock]);
  const experiences = await service.getExperiences();

  expect(experiences).toEqual([ExperienceMock]);
  expect(PrismaMock.experience.findMany).toHaveBeenCalledWith();
});

it('should update an experience', async () => {
  PrismaMock.experience.update.mockResolvedValue(ExperienceMock);
  const updated = await service.updateExperience('1', ExperienceMock);

  expect(updated).toEqual(ExperienceMock);
  expect(PrismaMock.experience.update).toHaveBeenCalledWith({
    where: { id: '1' },
    data: ExperienceMock,
  });
});

it('should delete an experience', async () => {
  await service.deleteExperience('1');

  expect(PrismaMock.experience.delete).toHaveBeenCalledWith({
    where: { id: '1' },
  });
});

it('should check if an experience is owned by a merchant', async () => {
  PrismaMock.experience.findUnique.mockResolvedValue(ExperienceMock);
  const isOwn = await service.isOwnProperty('1', '1');

  expect(isOwn).toBe(true);
  expect(PrismaMock.experience.findUnique).toHaveBeenCalledWith({
    where: { id: '1', merchantId: '1' },
  });
});

it('should validate experience pass', async () => {
  const MockOrderItem = {
    ticket: {
      experience: { id: 'test-experience-id' },
      validTo: '2100-01-01T00:00:00.000Z',
      validFrom: '2000-01-01T00:00:00.000Z',
    },
    order: { customer: { id: 'test-customer-id' }, orderStatus: 'PAID' },
  };
  PrismaMock.orderItem.findUnique.mockResolvedValue(MockOrderItem);
  const validationResponse = await service.validateExperiencePass(
    'test-serial-number',
    'test-experience-id',
  );
  expect(PrismaMock.orderItem.findUnique).toHaveBeenCalledWith({
    where: { serialNumber: 'test-serial-number' },
    include: {
      ticket: { include: { experience: true } },
      order: { include: { customer: true } },
    },
  });
  expect(validationResponse).toEqual({
    isValid: true,
    message: 'VALID',
    orderItem: {
      ticket: {
        experience: { id: 'test-experience-id' },
        validTo: '2100-01-01T00:00:00.000Z',
        validFrom: '2000-01-01T00:00:00.000Z',
      },
    },
    customer: { id: 'test-customer-id' },
  });
});

it('should return not found validation response when validating experience pass', async () => {
  PrismaMock.orderItem.findUnique.mockResolvedValue(null);
  const validationResponse = await service.validateExperiencePass(
    'test-serial-number',
    'test-experience-id',
  );
  expect(PrismaMock.orderItem.findUnique).toHaveBeenCalledWith({
    where: { serialNumber: 'test-serial-number' },
    include: {
      ticket: { include: { experience: true } },
      order: { include: { customer: true } },
    },
  });
  expect(validationResponse).toEqual({ isValid: false, message: 'NOT_FOUND' });
});

it('should return invalid validation response when validating experience pass', async () => {
  PrismaMock.orderItem.findUnique.mockResolvedValue({
    ticket: { experience: { id: 'test-experience-id' } },
    order: { customer: { id: 'test-customer-id' } },
  });
  const validationResponse = await service.validateExperiencePass(
    'test-serial-number',
    'test-wrong-experience-id',
  );
  expect(PrismaMock.orderItem.findUnique).toHaveBeenCalledWith({
    where: { serialNumber: 'test-serial-number' },
    include: {
      ticket: { include: { experience: true } },
      order: { include: { customer: true } },
    },
  });
  expect(validationResponse).toEqual({ isValid: false, message: 'INVALID' });
});

it('should return unpaid validation response when validating experience pass', async () => {
  PrismaMock.orderItem.findUnique.mockResolvedValue({
    ticket: { experience: { id: 'test-experience-id' } },
    order: { customer: { id: 'test-customer-id' }, orderStatus: 'CREATED' },
  });
  const validationResponse = await service.validateExperiencePass(
    'test-serial-number',
    'test-experience-id',
  );
  expect(PrismaMock.orderItem.findUnique).toHaveBeenCalledWith({
    where: { serialNumber: 'test-serial-number' },
    include: {
      ticket: { include: { experience: true } },
      order: { include: { customer: true } },
    },
  });
  expect(validationResponse).toEqual({
    isValid: false,
    message: 'UNPAID',
    orderItem: {
      ticket: { experience: { id: 'test-experience-id' } },
      order: { customer: { id: 'test-customer-id' }, orderStatus: 'CREATED' },
    },
    customer: { id: 'test-customer-id' },
  });
});

it('should return too early validation response when validating experience pass', async () => {
  const MockOrderItem = {
    ticket: {
      experience: { id: 'test-experience-id' },
      validFrom: '2100-01-01T00:00:00.000Z',
      validTo: '2100-01-01T00:00:00.000Z',
    },
    order: { customer: { id: 'test-customer-id' }, orderStatus: 'PAID' },
  };

  PrismaMock.orderItem.findUnique.mockResolvedValue(MockOrderItem);
  const validationResponse = await service.validateExperiencePass(
    'test-serial-number',
    'test-experience-id',
  );
  expect(PrismaMock.orderItem.findUnique).toHaveBeenCalledWith({
    where: { serialNumber: 'test-serial-number' },
    include: {
      ticket: { include: { experience: true } },
      order: { include: { customer: true } },
    },
  });
  expect(validationResponse).toEqual({
    isValid: false,
    message: 'TOO_EARLY',
    orderItem: {
      ticket: {
        experience: { id: 'test-experience-id' },
        validFrom: '2100-01-01T00:00:00.000Z',
        validTo: '2100-01-01T00:00:00.000Z',
      },
    },
    customer: { id: 'test-customer-id' },
  });
});

it('should return too late validation response when validating experience pass', async () => {
  PrismaMock.orderItem.findUnique.mockResolvedValue({
    ticket: {
      experience: { id: 'test-experience-id' },
      validFrom: '2000-01-01T00:00:00.000Z',
      validTo: '2000-01-01T00:00:00.000Z',
    },
    order: { customer: { id: 'test-customer-id' }, orderStatus: 'PAID' },
  });
  const validationResponse = await service.validateExperiencePass(
    'test-serial-number',
    'test-experience-id',
  );
  expect(PrismaMock.orderItem.findUnique).toHaveBeenCalledWith({
    where: { serialNumber: 'test-serial-number' },
    include: {
      ticket: { include: { experience: true } },
      order: { include: { customer: true } },
    },
  });
  expect(validationResponse).toEqual({
    isValid: false,
    message: 'TOO_LATE',
    orderItem: {
      ticket: {
        experience: { id: 'test-experience-id' },
        validFrom: '2000-01-01T00:00:00.000Z',
        validTo: '2000-01-01T00:00:00.000Z',
      },
    },
    customer: { id: 'test-customer-id' },
  });
});
