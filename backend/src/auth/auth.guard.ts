import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  private jwtSigningSecret =
    this.configService.getOrThrow<string>('auth.jwtSigningKey');
  private whitelistedPaths = [
    '/api/auth/redirect',
    '/api/auth/callback',
    '/api/auth/refresh-login',
    '/api/health',
  ];

  constructor(private readonly configService: ConfigService) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (
      this.whitelistedPaths.some((path) =>
        context.switchToHttp().getRequest().url.startsWith(path),
      )
    ) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  private validateRequest(request: any) {
    const accessToken = request.cookies.accessToken;
    const userObject = jwt.decode(accessToken);
    const isTokenValid = !!jwt.verify(accessToken, this.jwtSigningSecret);
    if (!isTokenValid) {
      return false;
    } else {
      request.user = userObject;
      return true;
    }
  }
}
