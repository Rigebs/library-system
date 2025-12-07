import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { UserRequest } from '../../../../core/auth/auth.models';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  public errorMessage: WritableSignal<string | null> = signal(null);
  public isLoading: WritableSignal<boolean> = signal(false);

  public registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  public onSubmit(): void {
    this.errorMessage.set(null);

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const request: UserRequest = this.registerForm.value;

    this.authService
      .register(request)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          if (response.success) {
            alert('Registro exitoso. ¡Inicia sesión!');
            this.router.navigate(['/auth/login']);
          } else {
            this.errorMessage.set(
              response.message || 'Ocurrió un error inesperado durante el registro.'
            );
          }
        },
        error: (error: HttpErrorResponse) => {
          // Error HTTP (ej: 400 Bad Request, 500 Internal Server Error)
          const errorMsg = error.error?.message || error.message;
          this.errorMessage.set(`Fallo del servidor: ${errorMsg}`);
        },
      });
  }
}
