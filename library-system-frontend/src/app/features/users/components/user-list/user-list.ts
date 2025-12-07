import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { AuthService } from '../../../../core/auth/auth.service';
import { UserService } from '../../user.service';
import { DatePipe } from '@angular/common';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-list',
  imports: [DatePipe, RouterLink],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserListComponent implements OnInit {
  public authService = inject(AuthService);
  public userService = inject(UserService);

  public users = this.userService.users;
  public isLoading = this.userService.isLoading;
  public error = this.userService.error;

  public deleteError: WritableSignal<string | null> = signal(null);
  public isDeleting: WritableSignal<boolean> = signal(false);

  ngOnInit(): void {
    this.userService.loadAllUsers();
  }

  public onDelete(userId: number): void {
    if (!confirm(`¿Estás seguro de que quieres eliminar el usuario con ID ${userId}?`)) {
      return;
    }

    this.deleteError.set(null);
    this.isDeleting.set(true);

    this.userService
      .deleteUser(userId)
      .pipe(finalize(() => this.isDeleting.set(false)))
      .subscribe({
        next: (response) => {
          if (response.success) {
            // El servicio ya actualiza la Signal 'users'
            alert(`Usuario ${userId} eliminado con éxito.`);
          } else {
            this.deleteError.set(response.message || 'Fallo al eliminar el usuario.');
          }
        },
        error: (error: HttpErrorResponse) => {
          const msg = error.error?.message || 'No tienes permisos para eliminar este usuario.';
          this.deleteError.set(msg);
        },
      });
  }
}
