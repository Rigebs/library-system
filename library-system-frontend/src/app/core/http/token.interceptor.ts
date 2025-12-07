import {
  HttpInterceptorFn,
  HttpHandlerFn,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { catchError, switchMap, throwError, filter, take } from 'rxjs';

/**
 * Función auxiliar para añadir la cabecera de autorización a la petición.
 */
function addTokenHeader(request: HttpRequest<unknown>, token: string | null): HttpRequest<unknown> {
  if (!token) return request;

  // No modificar la URL, solo las cabeceras
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
}

/**
 * Función para manejar el error 401 (token expirado).
 */
function handle401Error(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService
) {
  const refreshToken = authService.getRefreshToken();

  // 1. Si no hay refresh token, cerrar sesión (ya está manejado en AuthService.httpRefresh si falla)
  if (!refreshToken) {
    authService.logout();
    return throwError(() => new Error('No refresh token available.'));
  }

  if (authService.getIsRefreshing()) {
    return authService.getRefreshTokenSubject().pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => {
        return next(addTokenHeader(request, token));
      })
    );
  }

  authService.setIsRefreshing(true);
  authService.setRefreshTokenSubject(null);

  return authService.httpRefresh(refreshToken).pipe(
    switchMap((response) => {
      authService.setIsRefreshing(false);
      const newAccessToken = response.data?.accessToken || null;

      authService.setRefreshTokenSubject(newAccessToken);

      return next(addTokenHeader(request, newAccessToken));
    }),
    catchError((refreshError) => {
      authService.setIsRefreshing(false);
      return throwError(() => refreshError);
    })
  );
}

export const tokenInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const accessToken = authService.getAccessToken();

  if (request.url.includes('/api/auth/')) {
    return next(request);
  }

  const authRequest = addTokenHeader(request, accessToken);

  return next(authRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && accessToken) {
        return handle401Error(authRequest, next, authService);
      }

      return throwError(() => error);
    })
  );
};
