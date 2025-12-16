import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap, of, Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReviewForm } from '../../components/review-form/review-form';
import { BookSummary } from '../../components/book-summary/book-summary';
import { Book } from '../../models/book.model';
import { BookService } from '../../book.service';

export interface BookDetailView extends Book {
  availableQuantity: number;
  rating: number;
  editorial: string;
}

@Component({
  selector: 'app-book-detail',
  imports: [CommonModule, ReviewForm, BookSummary],
  templateUrl: './book-detail.html',
  styleUrl: './book-detail.css',
})
export class BookDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private bookService = inject(BookService);
  private destroyRef = inject(DestroyRef);

  public book = signal<BookDetailView | null>(null);
  public isLoading = signal(true);
  public isBorrowing = signal(false);

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap): Observable<Book | null> => {
          const idString = params.get('id');
          this.isLoading.set(true);

          if (idString) {
            const id = Number(idString);
            if (isNaN(id)) return of(null);

            return this.bookService.getBookById(id);
          }
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (bookData: Book | null) => {
          if (bookData) {
            const viewData: BookDetailView = {
              ...bookData,
              availableQuantity: 3,
              rating: 4.5,
              editorial: bookData.publisher,
            };
            this.book.set(viewData);
          } else {
            this.book.set(null);
          }
          this.isLoading.set(false);
        },
        error: (err: unknown) => {
          console.error('Error loading book detail:', err);
          this.isLoading.set(false);
          this.book.set(null);
        },
      });
  }

  onBorrow(): void {
    const currentBook = this.book();
    if (!currentBook || currentBook.availableQuantity === 0) return;

    this.isBorrowing.set(true);

    console.log(`Solicitando préstamo para el libro ID: ${currentBook.id}`);

    setTimeout(() => {
      this.isBorrowing.set(false);
      alert(`Préstamo de "${currentBook.title}" concedido!`);
    }, 1500);
  }

  onSubmitReview(reviewData: { rating: number; reviewText: string }): void {
    const currentBook = this.book();
    if (!currentBook) return;

    console.log(
      `Enviando review para ID ${currentBook.id}: Rating=${reviewData.rating}, Comentario="${reviewData.reviewText}"`
    );

    alert('Gracias por tu comentario y calificación!');
  }
}
