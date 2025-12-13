import { Component, inject, signal, WritableSignal } from '@angular/core';
import { LoanService } from '../../loan.service';
import { Loan } from '../../models/loan.model';
import { Router, RouterLink } from '@angular/router';
import { DatePipe, CommonModule } from '@angular/common';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [RouterLink, DatePipe, CommonModule],
  templateUrl: './loan-list.html',
  styleUrl: './loan-list.css',
})
export class LoanListComponent {
  private loanService = inject(LoanService);
  private router = inject(Router);

  public loans = this.loanService.adminLoans;
  public isListLoading: WritableSignal<boolean> = signal(true);
  public isReturning: WritableSignal<boolean> = signal(false);
  public error: WritableSignal<string> = signal('');

  constructor() {
    this.loadData();
  }

  onInfo(loan: Loan) {
    this.router.navigate(['/admin/loans', loan.id, 'view']);
  }

  onReturn(loan: Loan) {
    if (loan.status === 'RETURNED') {
      alert('Este préstamo ya ha sido devuelto.');
      return;
    }

    if (
      confirm(`¿Estás seguro de que quieres registrar la devolución del Préstamo ID ${loan.id}?`)
    ) {
      this.isReturning.set(true);
      this.loanService
        .returnLoan(loan.id)
        .pipe(finalize(() => this.isReturning.set(false)))
        .subscribe({
          next: (returnedLoan) => {
            console.log(`Préstamo ${returnedLoan.id} devuelto con éxito.`);
            this.loadData();
          },
          error: (err) => {
            alert(`Error al registrar la devolución: ${err.message}`);
            this.error.set(`Error al devolver: ${err.message}`);
          },
        });
    }
  }

  loadData() {
    this.isListLoading.set(true);
    this.loanService
      .loadAllLoans()
      .pipe(finalize(() => this.isListLoading.set(false)))
      .subscribe({
        error: (err) => {
          this.error.set('Error al cargar los préstamos. ' + err.message);
        },
        next: () => {
          this.error.set('');
        },
      });
  }
}
