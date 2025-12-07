import { inject, Injectable, WritableSignal, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User } from '../../core/models/user.model';
import { ApiResponse, UserRequest } from '../../core/auth/auth.models';
import { Observable, catchError, tap, throwError } from 'rxjs';

type UserSaveRequest = Partial<UserRequest> & Pick<User, 'name' | 'email' | 'role'>;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/users';

  public users: WritableSignal<User[]> = signal([]);
  public isLoading: WritableSignal<boolean> = signal(false);
  public error: WritableSignal<string | null> = signal(null);

  public getAllUsers(): Observable<ApiResponse<User[]>> {
    this.isLoading.set(true);
    this.error.set(null);

    return this.http.get<ApiResponse<User[]>>(this.API_URL).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMsg =
          error.error?.message || 'Error al cargar usuarios. Token OK, pero fallo en el servidor.';
        this.error.set(errorMsg);
        this.isLoading.set(false);
        return throwError(() => error);
      })
    );
  }

  public loadAllUsers(): void {
    this.getAllUsers().subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success && response.data) {
          this.users.set(response.data);
        } else {
          this.error.set(response.message || 'Error desconocido al obtener lista.');
        }
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  public getUserById(id: number): Observable<ApiResponse<User>> {
    this.error.set(null);
    return this.http.get<ApiResponse<User>>(`${this.API_URL}/${id}`).pipe(
      catchError((error) => {
        this.error.set('Error al obtener el detalle del usuario.');
        return throwError(() => error);
      })
    );
  }

  public createUser(userRequest: UserRequest): Observable<ApiResponse<User>> {
    this.isLoading.set(true);
    this.error.set(null);

    return this.http.post<ApiResponse<User>>(`${this.API_URL}`, userRequest).pipe(
      tap(() => this.isLoading.set(false)),
      catchError((error) => {
        this.isLoading.set(false);
        this.error.set('Error al crear el usuario. Revise los datos.');
        return throwError(() => error);
      })
    );
  }

  public updateUser(id: number, userData: UserSaveRequest): Observable<ApiResponse<User>> {
    this.isLoading.set(true);
    this.error.set(null);

    return this.http.put<ApiResponse<User>>(`${this.API_URL}/${id}`, userData).pipe(
      tap(() => this.isLoading.set(false)),
      catchError((error) => {
        this.isLoading.set(false);
        this.error.set('Error al actualizar el usuario. Revise los datos.');
        return throwError(() => error);
      })
    );
  }

  /**
   * Elimina un usuario.
   * @param id ID del usuario a eliminar.
   */
  public deleteUser(id: number): Observable<ApiResponse<void>> {
    this.error.set(null);
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${id}`).pipe(
      tap(() => {
        // Actualizar la Signal users después de la eliminación
        this.users.update((currentUsers) => currentUsers.filter((u) => u.id !== id));
      }),
      catchError((error) => {
        this.error.set('Error al eliminar el usuario. Es posible que no tengas permisos.');
        return throwError(() => error);
      })
    );
  }
}
