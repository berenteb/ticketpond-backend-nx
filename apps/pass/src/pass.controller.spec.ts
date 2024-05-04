import { Test, TestingModule } from '@nestjs/testing';
import { PassServiceInterface } from '@ticketpond-backend-nx/types';

import { PassServiceMock } from './__mocks__/pass-service.mock';
import { PassController } from './pass.controller';
import { PassService } from './pass.service';

describe('AssetController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [PassController],
      providers: [
        {
          provide: PassServiceInterface,
          useValue: PassServiceMock,
        },
      ],
    }).compile();
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      expect(app).toBeDefined();
    });
  });
});
