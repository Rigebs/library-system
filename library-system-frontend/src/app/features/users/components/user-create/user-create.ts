import { Component, inject, WritableSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { UserFormComponent } from '../user-form/user-form';
import { UserService } from '../../user.service';
import { UserRequest } from '../../../../core/auth/auth.models';
import { User } from '../../../../core/models/user.model';

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
      next: (createdUser: User) => {
        this.isLoading.set(false);
        alert(`Usuario ${createdUser.name} creado exitosamente.`);
        this.router.navigate(['/dashboard']);
      },
      error: (error: unknown) => {
        this.isLoading.set(false);
        const msg =
          (error as Error).message ||
          (error as HttpErrorResponse).error?.message ||
          'Error de conexión con el servidor.';
        this.errorMessage.set(`Fallo en la creación: ${msg}`);
      },
    });
  }
}
