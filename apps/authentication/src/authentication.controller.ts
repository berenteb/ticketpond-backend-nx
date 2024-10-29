import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Profile } from 'passport-auth0';

import { AuthenticationService } from './authentication.service';
import { ConfigService } from './config.service';

@Controller()
@ApiTags('auth')
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(AuthGuard('auth0'))
  @Get('login')
  @ApiResponse({
    status: 302,
    description: 'Redirects to the Auth0 login page.',
  })
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  login() {}

  @Get('callback')
  @UseGuards(AuthGuard('auth0'))
  @ApiResponse({
    status: 302,
    description: 'Redirects to the frontend and sets cookie with JWT.',
  })
  @ApiQuery({ name: 'code', required: true })
  async oauthRedirect(
    @Req() request: Request & { user: Profile },
    @Res() res: Response,
  ): Promise<void> {
    const jwt = await this.authService.login(request.user);
    res.cookie('jwt', jwt, {
      httpOnly: true,
      secure: true,
      domain: this.configService.get('cookieDomain'),
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });
    res.redirect(this.configService.get('frontendUrl'));
  }

  @Get('logout')
  @ApiResponse({
    status: 302,
    description: 'Redirects to the frontend and clears the JWT cookie.',
  })
  logout(@Res() res: Response): void {
    res.clearCookie('jwt', {
      domain: this.configService.get('cookieDomain'),
    });
    res.redirect(this.configService.get('frontendUrl'));
  }
}
