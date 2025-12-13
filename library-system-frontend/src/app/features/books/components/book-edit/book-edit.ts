import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BookFormComponent } from '../book-form/book-form';
import { BookService } from '../../book.service';
import { Book, BookPayload } from '../../models/book.model';
import { switchMap, tap, catchError, of, Observable, map } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { CategoryService } from '../../../categories/category.service';

interface BookStateData {
  book: Book | null;
  error: string | null;
}

@Component({
  selector: 'app-book-edit',
  imports: [BookFormComponent, AsyncPipe],
  templateUrl: './book-edit.html',
  styleUrl: './book-edit.css',
})
export class BookEditComponent implements OnInit {
  public isSubmitting = signal(false);
  private bookService = inject(BookService);
  private categoryService = inject(CategoryService);
  public router = inject(Router);
  private route = inject(ActivatedRoute);

  public bookId = computed(() => Number(this.route.snapshot.paramMap.get('id')));
  public bookData$!: Observable<BookStateData>;

  public categories = this.categoryService.categories;
  public categoriesError = this.categoryService.error;

  ngOnInit() {
    this.bookData$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const id = Number(params.get('id'));
        if (id) {
          return this.bookService.getBookById(id).pipe(
            map((book) => ({ book: book, error: null } as BookStateData)),
            catchError((err) => {
              console.error('Error loading book:', err);
              return of({
                book: null,
                error: 'Failed to load book data.',
              } as BookStateData);
            })
          );
        }
        return of({ book: null, error: 'Invalid book ID.' } as BookStateData);
      })
    );
    this.categoryService.loadCategories();
  }

  onSubmit(payload: BookPayload) {
    this.isSubmitting.set(true);
    const id = this.bookId();
    this.bookService.updateBook(id, payload).subscribe({
      next: () => {
        alert('Book updated successfully!');
        this.router.navigate(['/admin/books']);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        alert(`Error updating book: ${err.message}`);
      },
    });
  }
}
