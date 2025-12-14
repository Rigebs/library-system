import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiResponse, AuthRequest, TokenResponse, UserRequest, UserResponse } from './auth.models';
import { BehaviorSubject, catchError, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { Role } from '../enums/role.enum';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly API_URL = 'http://localhost:8080/api/auth';
  private readonly USER_INFO_URL = 'http://localhost:8080/api/users/me';

  private accessTokenSignal: WritableSignal<string | null> = signal(this.getStoredAccessToken());
  private refreshTokenSignal: WritableSignal<string | null> = signal(this.getStoredRefreshToken());

  public isLoggedIn: Signal<boolean> = computed(() => !!this.accessTokenSignal());

  public isUserAdmin: Signal<boolean> = computed(() => this.currentUser()?.role === Role.ADMIN);

  public currentUser: WritableSignal<UserResponse | null> = signal(null);

  private isRefreshing: boolean = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(
    null
  );

  private getStoredAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private getStoredRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  private saveTokens(tokens: TokenResponse): void {
    localStorage.setItem('access_token', tokens.accessToken);
    localStorage.setItem('refresh_token', tokens.refreshToken);
    this.accessTokenSignal.set(tokens.accessToken);
    this.refreshTokenSignal.set(tokens.refreshToken);
  }

  public getIsRefreshing(): boolean {
    return this.isRefreshing;
  }

  public setIsRefreshing(value: boolean): void {
    this.isRefreshing = value;
  }

  public getRefreshTokenSubject(): BehaviorSubject<string | null> {
    return this.refreshTokenSubject;
  }

  public setRefreshTokenSubject(token: string | null): void {
    this.refreshTokenSubject.next(token);
  }

  register(request: UserRequest): Observable<ApiResponse<UserResponse>> {
    const url = `${this.API_URL}/register`;
    return this.http.post<ApiResponse<UserResponse>>(url, request).pipe(
      tap((response) => {
        if (response.success) {
          console.log('Registro exitoso:', response.message);
        }
      })
    );
  }

  login(request: AuthRequest): Observable<ApiResponse<TokenResponse>> {
    const url = `${this.API_URL}/login`;
    return this.http.post<ApiResponse<TokenResponse>>(url, request).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.saveTokens(response.data);
        } else {
          console.error('Login fallido:', response.message);
        }
      }),
      switchMap((tokenResponse: ApiResponse<TokenResponse>) => {
        if (tokenResponse.success && tokenResponse.data) {
          return this.loadUserFromToken().pipe(
            tap((userResponse: ApiResponse<UserResponse>) => {
              if (userResponse.success) {
                this.router.navigate(['/catalog']);
              }
            }),
            switchMap(() => of(tokenResponse))
          );
        }
        return of(tokenResponse);
      })
    );
  }

  public httpRefresh(refreshToken: string): Observable<ApiResponse<TokenResponse>> {
    const url = `${this.API_URL}/refresh`;
    const requestBody = { refreshToken: refreshToken };

    return this.http.post<ApiResponse<TokenResponse>>(url, requestBody).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.saveTokens(response.data);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  public loadUserFromToken(): Observable<ApiResponse<UserResponse>> {
    if (!this.isLoggedIn()) {
      return of({ success: false, message: 'No session active', data: null });
    }

    return this.http.get<ApiResponse<UserResponse>>(this.USER_INFO_URL).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.currentUser.set(response.data);

          console.log('Datos del usuario cargados:', response.data.email);
        } else {
          this.logout();
        }
      }),
      catchError((error) => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  isAdmin(): boolean {
    const user = this.currentUser();
    console.log('Comprobando rol de usuario:', user);
    return user?.role === Role.ADMIN;
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.accessTokenSignal.set(null);
    this.refreshTokenSignal.set(null);
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  getAccessToken(): string | null {
    return this.accessTokenSignal();
  }

  getRefreshToken(): string | null {
    return this.refreshTokenSignal();
  }
}
