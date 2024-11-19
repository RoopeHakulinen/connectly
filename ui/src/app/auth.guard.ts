import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from './user.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  return userService.getMe().pipe(
    map((me) => !!me),
    catchError(() => {
      window.location.replace(
        `/api/auth/redirect?redirect_url=${encodeURIComponent(state.url)}`,
      );
      return of(false);
    }),
  );
};
