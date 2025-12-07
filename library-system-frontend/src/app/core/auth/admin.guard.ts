import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';

export const AdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = authService.isLoggedIn();

  const isAdmin = authService.isAdmin();

  if (isAuthenticated && isAdmin) {
    return true;
  }

  if (isAuthenticated && !isAdmin) {
    console.warn('Acceso denegado: Usuario no tiene rol de Administrador.');
    return router.createUrlTree(['/']);
  }

  console.warn('Acceso denegado: Usuario no autenticado.');
  return router.createUrlTree(['/auth/login'], {
    queryParams: { returnUrl: state.url },
  });
};
