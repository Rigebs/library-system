import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LoanFormComponent } from '../../components/loan-form/loan-form';
import { LoanService } from '../../loan.service';
import { LoanPayload } from '../../models/loan.model';

@Component({
  selector: 'app-loan-create',
  imports: [LoanFormComponent],
  templateUrl: './loan-create.html',
  styleUrl: './loan-create.css',
})
export class LoanCreatePage {
  public isSubmitting = signal(false);
  private loanService = inject(LoanService);
  public router = inject(Router);

  onSubmit(payload: LoanPayload) {
    this.isSubmitting.set(true);

    this.loanService.createLoan(payload).subscribe({
      next: (loan) => {
        alert(`Préstamo creado exitosamente (ID: ${loan.id})!`);
        this.router.navigate(['/admin/loans']);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        alert(`Error al crear el préstamo: ${err.message || 'Error de conexión'}`);
      },
    });
  }
}
