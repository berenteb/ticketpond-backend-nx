import { Test } from '@nestjs/testing';
import { ConfigServiceMock } from '@ticketpond-backend-nx/utils';

import { AppleService } from './apple.service';
import { ConfigService } from './config.service';
import { ImageService } from './image.service';
import { PassService } from './pass.service';

describe('AssetService', () => {
  let service: PassService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [
        PassService,
        AppleService,
        ImageService,
        {
          provide: ConfigService,
          useValue: ConfigServiceMock,
        },
      ],
    }).compile();

    service = app.get<PassService>(PassService);
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {});
  });
});
