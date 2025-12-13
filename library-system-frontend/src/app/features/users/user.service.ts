import { inject, Injectable, WritableSignal, signal, computed, Signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User } from '../../core/models/user.model';
import { ApiResponse, UserRequest } from '../../core/auth/auth.models';
import { Observable, catchError, map, tap, throwError } from 'rxjs';

type UserSaveRequest = Partial<UserRequest> & Pick<User, 'name' | 'email' | 'role'>;

interface UserState {
  users: User[];
  isLoading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/users';

  private state: WritableSignal<UserState> = signal({
    users: [],
    isLoading: false,
    error: null,
  });

  public users: Signal<User[]> = computed(() => this.state().users);
  public isLoading: Signal<boolean> = computed(() => this.state().isLoading);
  public error: Signal<string | null> = computed(() => this.state().error);

  public getAllUsers(): Observable<ApiResponse<User[]>> {
    this.state.update((s) => ({ ...s, isLoading: true, error: null }));

    return this.http.get<ApiResponse<User[]>>(this.API_URL).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMsg =
          error.error?.message || 'Error al cargar usuarios. Token OK, pero fallo en el servidor.';
        this.state.update((s) => ({ ...s, error: errorMsg, isLoading: false }));
        return throwError(() => error);
      })
    );
  }

  public loadAllUsers(): void {
    this.getAllUsers()
      .pipe(
        map((response) => {
          if (response.success && response.data) {
            return { success: true, data: response.data };
          }
          return { success: false, data: [], message: response.message };
        }),
        tap((result) => {
          if (result.success) {
            this.state.update((s) => ({
              ...s,
              users: result.data,
              isLoading: false,
            }));
          } else {
            this.state.update((s) => ({
              ...s,
              error: result.message || 'Error desconocido al obtener lista.',
              isLoading: false,
            }));
          }
        })
      )
      .subscribe();
  }

  public getUserById(id: number): Observable<User> {
    this.state.update((s) => ({ ...s, error: null }));
    return this.http.get<ApiResponse<User>>(`${this.API_URL}/${id}`).pipe(
      map((response) => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Error desconocido al obtener el usuario.');
        }
        return response.data;
      }),
      catchError((error) => {
        this.state.update((s) => ({ ...s, error: 'Error al obtener el detalle del usuario.' }));
        return throwError(() => error);
      })
    );
  }

  public createUser(userRequest: UserRequest): Observable<User> {
    this.state.update((s) => ({ ...s, isLoading: true, error: null }));

    return this.http.post<ApiResponse<User>>(`${this.API_URL}`, userRequest).pipe(
      map((response) => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Error desconocido al crear el usuario.');
        }
        return response.data;
      }),
      tap((newUserData) => {
        this.state.update((s) => ({
          ...s,
          isLoading: false,
          users: [...s.users, newUserData],
        }));
      }),
      catchError((error) => {
        this.state.update((s) => ({
          ...s,
          isLoading: false,
          error: 'Error al crear el usuario. Revise los datos.',
        }));
        return throwError(() => error);
      })
    );
  }

  public updateUser(id: number, userData: UserSaveRequest): Observable<User> {
    this.state.update((s) => ({ ...s, isLoading: true, error: null }));

    return this.http.put<ApiResponse<User>>(`${this.API_URL}/${id}`, userData).pipe(
      map((response) => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Error desconocido al actualizar el usuario.');
        }
        return response.data;
      }),
      tap((updatedUser) => {
        this.state.update((s) => ({
          ...s,
          isLoading: false,
          users: s.users.map((u) => (u.id === id ? updatedUser : u)),
        }));
      }),
      catchError((error) => {
        this.state.update((s) => ({
          ...s,
          isLoading: false,
          error: 'Error al actualizar el usuario. Revise los datos.',
        }));
        return throwError(() => error);
      })
    );
  }

  public deleteUser(id: number): Observable<ApiResponse<void>> {
    this.state.update((s) => ({ ...s, error: null }));
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${id}`).pipe(
      tap(() => {
        this.state.update((s) => ({ ...s, users: s.users.filter((u) => u.id !== id) }));
      }),
      catchError((error) => {
        this.state.update((s) => ({
          ...s,
          error: 'Error al eliminar el usuario. Es posible que no tengas permisos.',
        }));
        return throwError(() => error);
      })
    );
  }
}
