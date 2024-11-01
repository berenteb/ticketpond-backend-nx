import { RawBodyRequest } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ReqWithUserMock } from '@ticketpond-backend-nx/testing';
import { PaymentServiceInterface } from '@ticketpond-backend-nx/types';

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
  const response = await controller.createPaymentIntent('id', ReqWithUserMock);
  expect(response).toEqual({ clientSecret: '123456' });
});

it('should handle webhook', async () => {
  await expect(
    controller.handleWebhook({
      headers: { 'stripe-signature': 'signature' },
      rawBody: Buffer.from('body'),
    } as unknown as RawBodyRequest<Request>),
  ).resolves.not.toThrow();
  expect(PaymentServiceMock.handleWebhook).toHaveBeenCalledWith(
    'signature',
    'body',
  );
});
