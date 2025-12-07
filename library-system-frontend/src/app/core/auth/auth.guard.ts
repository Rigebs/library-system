// auth.guard.ts

import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, of, map, catchError } from 'rxjs';

export const AuthGuard: CanActivateFn = (route, state): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = authService.isLoggedIn();
  const loginUrl = router.createUrlTree(['/auth/login'], { queryParams: { returnUrl: state.url } });

  const isAdminRoute = route.routeConfig?.path === 'admin';

  if (!isAuthenticated) {
    return of(loginUrl);
  }

  if (authService.currentUser()) {
    if (isAdminRoute && !authService.isAdmin()) {
      return of(router.createUrlTree(['/']));
    }
    return of(true);
  }

  return authService.loadUserFromToken().pipe(
    map(() => {
      if (isAdminRoute) {
        if (authService.isAdmin()) {
          return true;
        }
        return router.createUrlTree(['/']);
      }
      return true;
    }),
    catchError(() => {
      return of(loginUrl);
    })
  );
};
