import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  WritableSignal,
  signal,
} from '@angular/core';
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

  // --- GESTIÓN DE ESTADO CON SIGNALS ---
  public isLoading: WritableSignal<boolean> = signal(true);
  public isSaving: WritableSignal<boolean> = signal(false);
  public errorMessage: WritableSignal<string | null> = signal(null);

  // Signal para almacenar el usuario cargado
  public userToEdit: WritableSignal<User | null> = signal(null);

  ngOnInit(): void {
    // 1. Obtener el ID de la URL
    const userId = Number(this.route.snapshot.paramMap.get('id'));

    if (isNaN(userId)) {
      this.errorMessage.set('ID de usuario inválido.');
      this.isLoading.set(false);
      return;
    }

    // 2. Cargar el usuario
    this.userService
      .getUserById(userId)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.userToEdit.set(response.data); // Almacenar datos en la Signal
          } else {
            this.errorMessage.set(response.message || 'No se pudo cargar el usuario.');
          }
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage.set(error.error?.message || 'Error al conectar con el servidor.');
        },
      });
  }

  /**
   * Maneja el evento 'save' emitido por UserFormComponent.
   * Llama al servicio para actualizar el usuario.
   */
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
      next: (response) => {
        this.isSaving.set(false);
        if (response.success) {
          alert('Usuario actualizado exitosamente.');
          this.router.navigate(['/dashboard']); // Redirigir a la lista
        } else {
          this.errorMessage.set(response.message || 'Error al actualizar el usuario.');
        }
      },
      error: (error: HttpErrorResponse) => {
        this.isSaving.set(false);
        this.errorMessage.set(
          error.error?.message || 'Error de conexión con el servidor durante la actualización.'
        );
      },
    });
  }
}
