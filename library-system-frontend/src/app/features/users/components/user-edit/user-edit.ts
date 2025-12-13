import { Component, inject, OnInit, WritableSignal, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../user.service';
import { User } from '../../../../core/models/user.model';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { UserFormComponent } from '../user-form/user-form';

@Component({
  selector: 'app-user-edit',
  imports: [CommonModule, RouterModule, UserFormComponent],
  templateUrl: './user-edit.html',
  styleUrl: './user-edit.css',
})
export class UserEditComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private router = inject(Router);

  public isLoading: WritableSignal<boolean> = signal(true);
  public isSaving: WritableSignal<boolean> = signal(false);
  public errorMessage: WritableSignal<string | null> = signal(null);

  public userToEdit: WritableSignal<User | null> = signal(null);

  ngOnInit(): void {
    const userId = Number(this.route.snapshot.paramMap.get('id'));

    if (isNaN(userId)) {
      this.errorMessage.set('ID de usuario inválido.');
      this.isLoading.set(false);
      return;
    }

    this.userService
      .getUserById(userId)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (user: User) => {
          this.userToEdit.set(user);
        },
        error: (error: HttpErrorResponse | Error) => {
          const msg =
            (error as Error).message ||
            (error as HttpErrorResponse).error?.message ||
            'Error al conectar con el servidor.';
          this.errorMessage.set(msg);
        },
      });
  }

  onUpdate(event: { id?: number; data: any }): void {
    const userId = event.id;
    const userData = event.data;

    if (!userId) {
      this.errorMessage.set('Error interno: ID de usuario no proporcionado.');
      return;
    }

    this.errorMessage.set(null);
    this.isSaving.set(true);

    this.userService.updateUser(userId, userData).subscribe({
      next: (updatedUser: User) => {
        this.isSaving.set(false);

        alert('Usuario actualizado exitosamente.');
        this.router.navigate(['/dashboard']);
        this.userToEdit.set(updatedUser);
      }, // 💡 Pequeña corrección para tipado de error, para manejar tanto Error como HttpErrorResponse
      error: (error: HttpErrorResponse | Error) => {
        this.isSaving.set(false);
        const msg =
          (error as Error).message || // Error lanzado desde el service
          (error as HttpErrorResponse).error?.message ||
          'Error de conexión con el servidor durante la actualización.';
        this.errorMessage.set(msg);
      },
    });
  }
}
