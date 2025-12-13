import { Component, inject, signal, WritableSignal } from '@angular/core';
import { LoanService } from '../../loan.service';
import { Loan } from '../../models/loan.model';
import { Router, RouterLink } from '@angular/router';
import { DatePipe, CommonModule } from '@angular/common';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-loan-history',
  imports: [DatePipe, CommonModule],
  templateUrl: './loan-history.html',
  styleUrl: './loan-history.css',
})
export class LoanHistoryPage {
  private loanService = inject(LoanService);
  private router = inject(Router);

  public loans = this.loanService.adminLoans;
  public isListLoading: WritableSignal<boolean> = signal(true);
  public error: WritableSignal<string> = signal('');

  constructor() {
    this.loadData();
  }

  onInfo(loan: Loan) {
    this.router.navigate(['/admin/loans', loan.id, 'view']);
  }

  loadData() {
    this.isListLoading.set(true);
    this.loanService
      .loadCompleteHistory()
      .pipe(finalize(() => this.isListLoading.set(false)))
      .subscribe({
        error: (err) => {
          this.error.set('Error al cargar el historial de préstamos. ' + err.message);
        },
        next: () => {
          this.error.set('');
        },
      });
  }
}
