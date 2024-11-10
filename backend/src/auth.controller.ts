import { Controller, Get, Query, Redirect, Request, Res, UnauthorizedException } from '@nestjs/common';

import { Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { UsersService } from './users/users.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  private appUrl = this.configService.getOrThrow<string>('common.appUrl');
  private clientId = this.configService.getOrThrow<string>('auth.clientId');
  private clientSecret = this.configService.getOrThrow<string>('auth.clientSecret');
  private jwtSigningSecret = this.configService.getOrThrow<string>('auth.jwtSigningKey');

  constructor(
    private usersService: UsersService,
    private http: HttpService,
    private configService: ConfigService,
  ) {
  }

  @Get('redirect')
  @Redirect('', 302)
  async redirectToOauth(
    @Query('redirect_url') appRedirectUrl: string,
  ) {
    const state = appRedirectUrl ?? this.appUrl;
    const clientId = '372875022616-vi137ar0f85rt6e1rgc8fk94t35h062p.apps.googleusercontent.com';
    const scope = 'openid+profile+email';
    const redirectUri = `${this.appUrl}/api/auth/callback`;
    const url = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&state=${state}
`;
    return { url };
  }

  @Get('refresh-login')
  @Redirect('', 302)
  async refreshLogin(@Request() req: any, @Res() res: Response, @Query('redirect_url') redirectUrl?: string) {
    const decodedAccessToken = jwt.decode(req.cookies.accessToken);
    if (!decodedAccessToken) {
      res.clearCookie('accessToken');
      return { url: `${this.appUrl}/login?redirect_url=${redirectUrl}` };
    }
    const url = '';
    return { url: url };
  }

  @Get('callback')
  async oauthLoginRedirect(@Query('code') code: string, @Query('state') state: string, @Res() res: Response): Promise<void> {
    if (!code) {
      throw new UnauthorizedException('The code is missing on the Google authentication callback.');
    }

    const token = await this.exchangeCodeForToken(code);
    const tokenData = jwt.decode(token);
    const email = tokenData.email;
    const name = tokenData.name;
    let user = await this.usersService.findByEmail(email);
    if (user === null) {
      user = await this.usersService.create(email, name);
    }

    const accessToken = jwt.sign({
      email: user.email,
      id: user.id,
    }, this.jwtSigningSecret);
    res.cookie('accessToken', accessToken, { secure: true, httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
    res.redirect('http://localhost:4200');
  }

  private async exchangeCodeForToken(code: string): Promise<string> {
    // Get the token from Google based on the code
    const openIdResponse: any = await firstValueFrom(this.http.post<any>(
      'https://oauth2.googleapis.com/token',
      {
        code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: `${this.appUrl}/api/auth/callback`,
        grant_type: 'authorization_code',
      },
    ));

    return openIdResponse.data.id_token;
  }
}
