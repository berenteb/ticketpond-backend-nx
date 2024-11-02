import { Test, TestingModule } from '@nestjs/testing';
import { ConfigServiceMock } from '@ticketpond-backend-nx/testing';
import { Profile } from 'passport-auth0';

import { AuthenticationServiceMock } from './__mocks__/services/authentication-service.mock';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { ConfigService } from './config.service';

let controller: AuthenticationController;

beforeEach(async () => {
  jest.clearAllMocks();
  ConfigServiceMock.get.mockImplementation((key: string) => {
    if (key === 'frontendUrl') {
      return 'https://frontend.com';
    }
    if (key === 'cookieDomain') {
      return 'ticketpond.com';
    }
  });
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      { provide: AuthenticationService, useValue: AuthenticationServiceMock },
      { provide: ConfigService, useValue: ConfigServiceMock },
    ],
    controllers: [AuthenticationController],
  }).compile();

  controller = module.get<AuthenticationController>(AuthenticationController);
});

it('should set cookie and redirect to frontend on redirect', async () => {
  const res = {
    cookie: jest.fn(),
    redirect: jest.fn(),
  };
  const auth0Profile: Profile = {
    _json: undefined,
    _raw: 'raw',
    birthday: 'birthday',
    displayName: 'displayName',
    id: 'id',
    provider: 'provider',
  };
  await controller.oauthRedirect(
    {
      user: auth0Profile,
    } as any,
    res as any,
  );
  expect(res.cookie).toHaveBeenCalledWith('jwt', '', {
    httpOnly: true,
    secure: true,
    domain: 'ticketpond.com',
    maxAge: 86400000,
  });
  expect(res.redirect).toHaveBeenCalledWith('https://frontend.com');
});

it('should clear cookie and redirect to frontend on logout', async () => {
  const res = {
    clearCookie: jest.fn(),
    redirect: jest.fn(),
  };
  controller.logout(res as any);
  expect(res.clearCookie).toHaveBeenCalledWith('jwt', {
    domain: 'ticketpond.com',
  });
  expect(res.redirect).toHaveBeenCalledWith('https://frontend.com');
});
