import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from './user.service';
import { catchError, map, of } from 'rxjs';

export const alreadyLoggedInGuard: CanActivateFn = (route, state) => {
    const userService = inject(UserService);
    const router = inject(Router);

    return userService.getMe().pipe(
        map((me) => {
            if (me) {
                router.navigate(['/app/dashboard']);
                return false;
            }
            return true;
        }),
        catchError(() => {
            return of(true);
        }),
    );
};
