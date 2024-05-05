import { Test, TestingModule } from '@nestjs/testing';
import { ConfigServiceMock } from '@ticketpond-backend-nx/testing';
import fs from 'fs';
import { PKPass } from 'passkit-generator';

import { OrderItemMock } from './__mocks__/entities/order-item.mock';
import { AppleService } from './apple.service';
import { ConfigService } from './config.service';

const writePassToFile = jest.fn();

class TestAppleService extends AppleService {
  writePassToFile = writePassToFile;
}

jest.mock('passkit-generator', () => ({
  PKPass: class {
    type: string;
    primaryFields: never[] = [];
    headerFields: never[] = [];
    auxiliaryFields: never[] = [];
    setBarcodes = jest.fn();
    addBuffer = jest.fn();
    getAsBuffer = jest.fn();
    backFields: never[] = [];
    props = {};
  },
}));

let service: AppleService;

jest.mock('fs', () => ({
  existsSync: jest.fn().mockReturnValue(false),
  mkdirSync: jest.fn(),
  readFileSync: jest.fn().mockReturnValue('cert'),
  createWriteStream: jest.fn().mockReturnValue({
    write: jest.fn().mockImplementation((_, cb) => cb()),
  }),
}));

beforeEach(async () => {
  jest.clearAllMocks();

  ConfigServiceMock.get.mockReturnValue('configValue');

  const module: TestingModule = await Test.createTestingModule({
    providers: [
      {
        provide: AppleService,
        useClass: TestAppleService,
      },
      {
        provide: ConfigService,
        useValue: ConfigServiceMock,
      },
    ],
  }).compile();

  service = module.get<AppleService>(AppleService);
});

it('should not create folder if it already exists', () => {
  (fs.mkdirSync as jest.Mock).mockClear();
  (fs.existsSync as jest.Mock).mockReturnValueOnce(true);
  new AppleService({} as ConfigService);
  expect(fs.mkdirSync).not.toHaveBeenCalled();
});

it("should create folder on start if it doesn't exist", () => {
  (fs.mkdirSync as jest.Mock).mockClear();
  new AppleService({} as ConfigService);
  expect(fs.mkdirSync).toHaveBeenCalledWith(expect.any(String), {
    recursive: true,
  });
});

it('should generate pass with passkit with correct fields set', async () => {
  let generatedPass: PKPass;
  writePassToFile.mockImplementation((pass) => {
    generatedPass = pass;
  });
  await expect(service.generatePass(OrderItemMock)).resolves.not.toThrow();
  expect(generatedPass).toBeDefined();
  expect(generatedPass.type).toBe('eventTicket');
  expect(generatedPass.primaryFields).toContainEqual({
    key: 'eventName',
    label: 'Esemény',
    value: OrderItemMock.ticket.experience.name,
  });

  expect(generatedPass.headerFields).toContainEqual({
    key: 'ticketName',
    label: 'Típus',
    value: OrderItemMock.ticket.name,
  });

  expect(generatedPass.setBarcodes).toHaveBeenCalledWith({
    message: OrderItemMock.serialNumber,
    format: 'PKBarcodeFormatQR',
  });

  expect(generatedPass.auxiliaryFields).toContainEqual({
    key: 'validFrom',
    label: 'Érvényesség kezdete',
    value: new Date(OrderItemMock.ticket.validFrom).toLocaleDateString(),
  });

  expect(generatedPass.auxiliaryFields).toContainEqual({
    key: 'validTo',
    label: 'Lejár',
    value: new Date(OrderItemMock.ticket.validTo).toLocaleDateString(),
  });

  expect(generatedPass.backFields).toContainEqual({
    key: 'serialNumber',
    label: 'Sorszám',
    value: OrderItemMock.serialNumber,
  });

  expect(generatedPass.backFields).toContainEqual({
    key: 'ticketDescription',
    label: 'Jegy leírás',
    value: OrderItemMock.ticket.description,
  });

  expect(generatedPass.backFields).toContainEqual({
    key: 'experienceDescription',
    label: 'Esemény leírás',
    value: OrderItemMock.ticket.experience.description,
  });

  expect(generatedPass.addBuffer).toHaveBeenCalled();
});
