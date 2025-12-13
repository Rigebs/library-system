import { inject, Injectable, WritableSignal, signal, computed, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { LoanPayload, Loan } from './models/loan.model';
import { ApiResponse } from '../../core/auth/auth.models';

const OPERATIONAL_STATUSES = 'ACTIVE,OVERDUE';

interface LoanState {
  adminLoans: Loan[];
  userHistory: Loan[];
  isLoading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class LoanService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/loans';

  private readonly state: WritableSignal<LoanState> = signal({
    adminLoans: [],
    userHistory: [],
    isLoading: false,
    error: null,
  });

  public readonly adminLoans: Signal<Loan[]> = computed(() => this.state().adminLoans);
  public readonly userHistory: Signal<Loan[]> = computed(() => this.state().userHistory);
  public readonly isLoading: Signal<boolean> = computed(() => this.state().isLoading);
  public readonly error: Signal<string | null> = computed(() => this.state().error);

  loadOperationalLoans(): Observable<Loan[]> {
    const url = `${this.apiUrl}?status=${OPERATIONAL_STATUSES}`;
    this.state.update((s) => ({ ...s, isLoading: true, error: null }));

    return this.http.get<ApiResponse<Loan[]>>(url).pipe(
      map((response) => {
        if (!response.success) {
          throw new Error(response.message || 'Error al cargar préstamos operativos.');
        }
        return response.data || [];
      }),
      tap((loans) => {
        this.state.update((s) => ({
          ...s,
          adminLoans: loans,
          isLoading: false,
        }));
      }),
      catchError((err) => {
        this.state.update((s) => ({
          ...s,
          error: 'Fallo al cargar préstamos operativos.',
          isLoading: false,
        }));
        return throwError(() => err);
      })
    );
  }

  loadCompleteHistory(): Observable<Loan[]> {
    this.state.update((s) => ({ ...s, isLoading: true, error: null }));
    return this.http.get<ApiResponse<Loan[]>>(this.apiUrl).pipe(
      map((response) => {
        if (!response.success) {
          throw new Error(response.message || 'Error al cargar el historial completo.');
        }
        return response.data || [];
      }),
      tap((loans) => {
        this.state.update((s) => ({
          ...s,
          adminLoans: loans,
          isLoading: false,
        }));
      }),
      catchError((err) => {
        this.state.update((s) => ({
          ...s,
          error: 'Fallo al cargar el historial completo.',
          isLoading: false,
        }));
        return throwError(() => err);
      })
    );
  }

  loadAllLoans(): Observable<Loan[]> {
    return this.loadCompleteHistory();
  }

  loadUserLoans(): Observable<Loan[]> {
    const url = `${this.apiUrl}/my-loans`;
    this.state.update((s) => ({ ...s, isLoading: true, error: null }));
    return this.http.get<ApiResponse<Loan[]>>(url).pipe(
      map((response) => response.data || []),
      tap((loans) => {
        this.state.update((s) => ({
          ...s,
          userHistory: loans,
          isLoading: false,
        }));
      })
    );
  }

  createLoan(payload: LoanPayload): Observable<Loan> {
    const url = `${this.apiUrl}/create`;
    this.state.update((s) => ({ ...s, error: null }));
    return this.http.post<ApiResponse<Loan>>(url, payload).pipe(
      map((response) => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Error desconocido al crear el préstamo.');
        }
        return response.data;
      })
    );
  }

  returnLoan(loanId: number): Observable<Loan> {
    const url = `${this.apiUrl}/${loanId}/return`;
    this.state.update((s) => ({ ...s, error: null }));
    return this.http.put<ApiResponse<Loan>>(url, {}).pipe(
      map((response) => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Error desconocido al devolver el préstamo.');
        }
        return response.data;
      }),
      tap((returnedLoan) => {
        this.state.update((s) => ({
          ...s,
          adminLoans: s.adminLoans.map((loan) => (loan.id === loanId ? returnedLoan : loan)),
          userHistory: s.userHistory.map((loan) => (loan.id === loanId ? returnedLoan : loan)),
        }));
      })
    );
  }

  getLoanById(id: number): Observable<Loan> {
    const url = `${this.apiUrl}/${id}`;
    this.state.update((s) => ({ ...s, error: null }));

    return this.http.get<ApiResponse<Loan>>(url).pipe(
      map((response) => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Error desconocido al obtener el préstamo.');
        }
        return response.data;
      })
    );
  }
}
