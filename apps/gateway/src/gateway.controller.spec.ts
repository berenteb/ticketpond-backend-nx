import { Test, TestingModule } from '@nestjs/testing';

import { GatewayController } from './gateway.controller';

let app: TestingModule;

beforeAll(async () => {
  app = await Test.createTestingModule({
    controllers: [GatewayController],
  }).compile();
});

describe('getHealth', () => {
  it('should return Ok', async () => {
    const appController = app.get<GatewayController>(GatewayController);
    expect(await appController.getHealth()).toEqual('OK');
  });
});
