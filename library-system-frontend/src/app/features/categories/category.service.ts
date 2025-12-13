import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap, map, Observable } from 'rxjs';
import { Category, CategoryPayload } from './models/category.model';
import { ApiResponse } from '../../core/auth/auth.models';

interface CategoryState {
  categories: Category[];
  selectedCategory: Category | null;
  isLoading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/categories';

  private state = signal<CategoryState>({
    categories: [],
    selectedCategory: null,
    isLoading: false,
    error: null,
  });

  public categories = computed(() => this.state().categories);
  public selectedCategory = computed(() => this.state().selectedCategory);
  public isLoading = computed(() => this.state().isLoading);
  public error = computed(() => this.state().error);

  loadCategories(): void {
    this.state.update((s) => ({ ...s, isLoading: true, error: null }));

    this.http
      .get<ApiResponse<Category[]>>(this.apiUrl)
      .pipe(
        map((response) => response.data || []),
        catchError((err) => {
          console.error('Error loading categories:', err);
          this.state.update((s) => ({
            ...s,
            isLoading: false,
            error: 'Failed to load categories. Please check server connection.',
          }));
          return of([] as Category[]);
        })
      )
      .subscribe((categories) => {
        this.state.update((s) => ({
          ...s,
          categories: categories,
          isLoading: false,
        }));
      });
  }

  createCategory(payload: CategoryPayload): Observable<Category> {
    return this.http.post<ApiResponse<Category>>(this.apiUrl, payload).pipe(
      map((response) => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Error desconocido al crear la categoría.');
        }
        return response.data;
      }),
      tap((newCategory) => {
        this.state.update((s) => ({
          ...s,
          categories: [...s.categories, newCategory],
        }));
      })
    );
  }

  updateCategory(id: number, payload: CategoryPayload): Observable<Category> {
    return this.http.put<ApiResponse<Category>>(`${this.apiUrl}/${id}`, payload).pipe(
      map((response) => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Error desconocido al actualizar la categoría.');
        }
        return response.data;
      }),
      tap((updatedCategory) => {
        this.state.update((s) => ({
          ...s,
          categories: s.categories.map((c) => (c.id === id ? updatedCategory : c)),
          selectedCategory: null,
        }));
      })
    );
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      map((response) => {
        if (!response.success) {
          throw new Error(response.message || 'Error al eliminar la categoría.');
        }
        return undefined;
      }),
      tap(() => {
        this.state.update((s) => ({
          ...s,
          categories: s.categories.filter((c) => c.id !== id),
        }));
      })
    );
  }

  selectCategory(category: Category | null) {
    this.state.update((s) => ({
      ...s,
      selectedCategory: category,
    }));
  }

  clearSelection() {
    this.state.update((s) => ({
      ...s,
      selectedCategory: null,
    }));
  }
}
