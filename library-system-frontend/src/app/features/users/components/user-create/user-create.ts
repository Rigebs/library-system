import { Component, inject, WritableSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { UserFormComponent } from '../user-form/user-form';
import { UserService } from '../../user.service';
import { UserRequest } from '../../../../core/auth/auth.models';

@Component({
  selector: 'app-user-create',
  imports: [CommonModule, RouterModule, UserFormComponent],
  templateUrl: './user-create.html',
  styleUrl: './user-create.css',
})
export class UserCreateComponent {
  private userService = inject(UserService);
  private router = inject(Router);

  public isLoading: WritableSignal<boolean> = signal(false);
  public errorMessage: WritableSignal<string | null> = signal(null);

  onCreate(event: { data: UserRequest }): void {
    this.errorMessage.set(null);
    this.isLoading.set(true);

    this.userService.createUser(event.data).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success) {
          alert('Usuario creado exitosamente.');
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage.set(response.message || 'Error desconocido al crear usuario.');
        }
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading.set(false);
        const msg = error.error?.message || 'Error de conexión con el servidor.';
        this.errorMessage.set(`Fallo en la creación: ${msg}`);
      },
    });
  }
}
