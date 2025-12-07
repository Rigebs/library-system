import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BookFormComponent } from '../book-form/book-form';
import { BookService } from '../../book.service';
import { Book, BookPayload } from '../../models/book.model';
import { switchMap, tap, catchError, of, Observable, map } from 'rxjs';
import { AsyncPipe } from '@angular/common';

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
  public router = inject(Router);
  private route = inject(ActivatedRoute);

  public bookId = computed(() => Number(this.route.snapshot.paramMap.get('id')));

  public bookData$!: Observable<BookStateData>; // 👈 Tipado correcto

  ngOnInit() {
    this.bookData$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const id = Number(params.get('id'));
        if (id) {
          return this.bookService.getBookById(id).pipe(
            // 📚 CORRECCIÓN: Usar map para asegurar que el Observable emita el tipo BookStateData
            map((book) => ({ book: book, error: null } as BookStateData)),
            catchError((err) => {
              console.error('Error loading book:', err);
              // Devolver un objeto del tipo BookStateData con el error
              return of({
                book: null,
                error: 'Failed to load book data.',
              } as BookStateData);
            })
          );
        }
        // Devolver un objeto del tipo BookStateData para ID inválido
        return of({ book: null, error: 'Invalid book ID.' } as BookStateData);
      })
    );
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
