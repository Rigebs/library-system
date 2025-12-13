import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { DashboardSummary } from './dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);
  private API_URL = `http://localhost:8080/api/admin/dashboard/summary`;

  private state: WritableSignal<{
    summary: DashboardSummary | null;
    isLoading: boolean;
    error: string | null;
  }> = signal({
    summary: null,
    isLoading: false,
    error: null,
  });

  public summary: Signal<DashboardSummary | null> = computed(() => this.state().summary);
  public isLoading: Signal<boolean> = computed(() => this.state().isLoading);
  public error: Signal<string | null> = computed(() => this.state().error);

  public loadSummary(): Observable<DashboardSummary> {
    this.state.update((s) => ({ ...s, isLoading: true, error: null }));

    return this.http.get<DashboardSummary>(this.API_URL).pipe(
      tap((result) => {
        this.state.update((s) => ({
          ...s,
          summary: result,
          isLoading: false,
        }));
      }),
      catchError((err) => {
        const errorMsg = 'Error al cargar el resumen del Dashboard.';
        this.state.update((s) => ({
          ...s,
          error: errorMsg,
          isLoading: false,
        }));
        return throwError(() => err);
      })
    );
  }
}
