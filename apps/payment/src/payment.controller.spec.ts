import { Test, TestingModule } from '@nestjs/testing';
import {
  OrderDto,
  PaymentServiceInterface,
} from '@ticketpond-backend-nx/types';
import { CreateServiceResponse } from '@ticketpond-backend-nx/utils';

import { PaymentServiceMock } from './__mocks__/payment-service.mock';
import { PaymentController } from './payment.controller';

let controller: PaymentController;

beforeEach(async () => {
  jest.clearAllMocks();
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      { provide: PaymentServiceInterface, useValue: PaymentServiceMock },
    ],
    controllers: [PaymentController],
  }).compile();

  controller = module.get<PaymentController>(PaymentController);
});

it('should create payment intent', async () => {
  const paymentIntent = await controller.createPaymentIntent({} as OrderDto);

  expect(paymentIntent).toEqual(
    CreateServiceResponse.success({ clientSecret: '123456' }),
  );
});

it('should handle webhook', async () => {
  await expect(
    controller.handleWebhook({
      signature: 'signature',
      body: 'body',
    }),
  ).resolves.not.toThrow();
  expect(PaymentServiceMock.handleWebhook).toHaveBeenCalledWith(
    'signature',
    'body',
  );
});
