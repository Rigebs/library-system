import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookService, SearchCriteria } from '../../../features/books/book.service';

@Component({
  selector: 'app-book-search',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './book-search.html',
  styleUrl: './book-search.css',
})
export class BookSearch {
  private fb = inject(FormBuilder);
  private bookService = inject(BookService);

  readonly searchFields = [
    { value: 'all', label: 'Todos' },
    { value: 'title', label: 'Título' },
    { value: 'author', label: 'Autor' },
    { value: 'isbn', label: 'ISBN' },
    { value: 'publisher', label: 'Editorial' },
    { value: 'category', label: 'Categoría' },
  ] as const;

  readonly searchForm = this.fb.nonNullable.group({
    term: ['', [Validators.required, Validators.minLength(2)]],
    field: ['all' as SearchCriteria['field'], [Validators.required]],
  });

  onSubmit(): void {
    if (this.searchForm.valid) {
      const criteria: SearchCriteria = this.searchForm.getRawValue();
      this.bookService.searchBooks(criteria);
    }
  }

  clearSearch(): void {
    this.searchForm.reset({ term: '', field: 'all' });
    this.bookService.searchBooks({ term: '', field: 'all' });
  }
}
