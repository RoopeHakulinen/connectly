import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loginUrl = '/api/auth/redirect';

  login(redirectUrl: string = '/app'): void {
    window.location.replace(`${this.loginUrl}?redirect_url=${redirectUrl}`);
  }
}
