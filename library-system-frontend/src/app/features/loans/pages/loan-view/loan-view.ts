import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Loan, LoanPayload } from '../../models/loan.model';
import { switchMap, of, Observable, catchError, map } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';
import { LoanService } from '../../loan.service';

interface LoanStateData {
  loan: Loan | null;
  error: string | null;
}

@Component({
  selector: 'app-loan-view',
  imports: [AsyncPipe, DatePipe],
  templateUrl: './loan-view.html',
  styleUrl: './loan-view.css',
})
export class LoanViewPage implements OnInit {
  public isSubmitting = signal(false);
  private loanService = inject(LoanService);
  public router = inject(Router);
  private route = inject(ActivatedRoute);

  public loanData$!: Observable<LoanStateData>;
  public loanId = signal<number | null>(null);

  ngOnInit() {
    this.loanData$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const id = Number(params.get('id'));
        this.loanId.set(id);
        if (id) {
          return this.loanService.getLoanById(id).pipe(
            map((loan) => ({ loan: loan, error: null } as LoanStateData)),
            catchError((err) => {
              console.error('Error al cargar préstamo:', err);
              return of({
                loan: null,
                error: 'Fallo al cargar los datos del préstamo.',
              } as LoanStateData);
            })
          );
        }
        return of({ loan: null, error: 'ID de Préstamo no proporcionado.' } as LoanStateData);
      })
    );
  }

  onReturnLoan() {
    const id = this.loanId();
    if (!id) return;

    this.isSubmitting.set(true);
    this.loanService.returnLoan(id).subscribe({
      next: (loan) => {
        alert(`Préstamo (ID: ${id}) devuelto exitosamente!`);
        this.router.navigate(['/admin/loans']);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        alert(`Error al devolver el préstamo: ${err.message || 'Error de conexión'}`);
      },
    });
  }

  onSubmit(payload: LoanPayload) {
    console.warn('Intento de edición genérica bloqueado. Solo la devolución está permitida.');
  }
}
