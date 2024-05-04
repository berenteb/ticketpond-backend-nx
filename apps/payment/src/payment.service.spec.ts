import { Test, TestingModule } from '@nestjs/testing';
import { OrderPatterns } from '@ticketpond-backend-nx/message-patterns';
import { ConfigServiceMock, KafkaMock } from '@ticketpond-backend-nx/testing';
import { OrderDto, ServiceNames } from '@ticketpond-backend-nx/types';

import { ConfigService } from './config.service';
import { PaymentService } from './payment.service';

jest.mock(
  'stripe',
  () =>
    class {
      paymentIntents = {
        create: jest.fn().mockResolvedValue({ client_secret: 'client_secret' }),
      };
      webhooks = {
        constructEvent: jest.fn(),
      };
    },
);

let service: PaymentService;

beforeEach(async () => {
  jest.clearAllMocks();
  ConfigServiceMock.get.mockReturnValue('configValue');
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      PaymentService,
      {
        provide: ServiceNames.KAFKA_SERVICE,
        useValue: KafkaMock,
      },
      {
        provide: ConfigService,
        useValue: ConfigServiceMock,
      },
    ],
  }).compile();

  service = module.get<PaymentService>(PaymentService);
});

it('should create intent', async () => {
  const order = { id: 'order-id', items: [{ price: 100 }, { price: 200 }] };
  const payment = await service.createIntent(order as OrderDto);
  expect(payment.clientSecret).toBe('client_secret');
  expect(service['stripe'].paymentIntents.create).toHaveBeenCalledWith({
    amount: 30000,
    currency: 'huf',
    payment_method_types: ['card'],
    metadata: { orderId: 'order-id' },
  });
});

it('should handle webhook with success', async () => {
  const constructEvent = service['stripe'].webhooks.constructEvent;
  (constructEvent as jest.Mock).mockReturnValueOnce({
    type: 'charge.succeeded',
    data: { object: { metadata: { orderId: 'order-id' } } },
  });
  await service.handleWebhook('signature', 'body');
  expect(constructEvent).toHaveBeenCalledWith(
    'body',
    'signature',
    'configValue',
  );
  expect(KafkaMock.emit).toHaveBeenCalledWith(
    OrderPatterns.FULFILL_ORDER,
    'order-id',
  );
});

it('should handle webhook with failure', async () => {
  const constructEvent = service['stripe'].webhooks.constructEvent;
  (constructEvent as jest.Mock).mockReturnValueOnce({
    type: 'charge.failed',
    data: { object: { metadata: { orderId: 'order-id' } } },
  });
  await service.handleWebhook('signature', 'body');
  expect(constructEvent).toHaveBeenCalledWith(
    'body',
    'signature',
    'configValue',
  );
  expect(KafkaMock.emit).toHaveBeenCalledWith(
    OrderPatterns.FAIL_ORDER,
    'order-id',
  );
});

it('should not send kafka event if event type is unknown', async () => {
  const constructEvent = service['stripe'].webhooks.constructEvent;
  (constructEvent as jest.Mock).mockReturnValueOnce({
    type: 'unknown',
  });
  await service.handleWebhook('signature', 'body');
  expect(KafkaMock.emit).not.toHaveBeenCalled();
});
