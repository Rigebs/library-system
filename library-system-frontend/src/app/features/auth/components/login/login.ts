import { Component, inject, WritableSignal, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../../../core/auth/auth.service';
import { AuthRequest } from '../../../../core/auth/auth.models';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  public errorMessage: WritableSignal<string | null> = signal(null);
  public isLoading: WritableSignal<boolean> = signal(false);

  public loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  public onSubmit(): void {
    this.errorMessage.set(null);

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const request: AuthRequest = this.loginForm.value;

    this.authService
      .login(request)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          if (response.success) {
            console.log('Login exitoso. Tokens recibidos.');
          } else {
            this.errorMessage.set(response.message || 'Credenciales inválidas. Intente de nuevo.');
          }
        },
        error: (error: HttpErrorResponse) => {
          let message = 'Credenciales inválidas o error de conexión.';

          if (error.status === 401 || error.status === 403) {
            message = 'Email o contraseña incorrectos.';
          } else if (error.error?.message) {
            message = error.error.message;
          }

          this.errorMessage.set(message);
        },
      });
  }
}
