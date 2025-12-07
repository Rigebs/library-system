import { computed, inject, Injectable, signal } from '@angular/core';
import { Book, BookPayload } from './models/book.model';
import { catchError, of, tap, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface BookState {
  books: Book[];
  isLoading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/books';

  private state = signal<BookState>({
    books: [],
    isLoading: false,
    error: null,
  });

  public books = computed(() => this.state().books);
  public isLoading = computed(() => this.state().isLoading);
  public error = computed(() => this.state().error);

  constructor() {}

  loadBooks(): void {
    this.state.update((s) => ({ ...s, isLoading: true, error: null }));

    this.http
      .get<ApiResponse<Book[]>>(this.apiUrl)
      .pipe(
        map((response) => response.data),
        catchError((err) => {
          console.error('Error loading books:', err);
          this.state.update((s) => ({
            ...s,
            isLoading: false,
            error: 'Failed to load books. Please try again.',
          }));
          return of([]);
        })
      )
      .subscribe((books) => {
        this.state.update((s) => ({
          ...s,
          books: books,
          isLoading: false,
        }));
      });
  }

  getBookById(id: number) {
    return this.http
      .get<ApiResponse<Book>>(`${this.apiUrl}/${id}`)
      .pipe(map((response) => response.data));
  }

  createBook(payload: BookPayload) {
    return this.http.post<ApiResponse<Book>>(this.apiUrl, payload).pipe(
      map((response) => response.data),
      tap((newBook) => {
        this.state.update((s) => ({
          ...s,
          books: [...s.books, newBook],
        }));
      })
    );
  }

  updateBook(id: number, payload: BookPayload) {
    return this.http.put<ApiResponse<Book>>(`${this.apiUrl}/${id}`, payload).pipe(
      map((response) => response.data),
      tap((updatedBook) => {
        this.state.update((s) => ({
          ...s,
          books: s.books.map((book) => (book.id === id ? updatedBook : book)),
        }));
      })
    );
  }

  deleteBook(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.state.update((s) => ({
          ...s,
          books: s.books.filter((book) => book.id !== id),
        }));
      })
    );
  }
}
