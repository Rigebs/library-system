import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DecimalPipe } from '@angular/common';
import { BookDetailView } from '../../pages/book-detail/book-detail';

@Component({
  selector: 'app-book-summary',
  imports: [CommonModule, DecimalPipe],
  templateUrl: './book-summary.html',
  styleUrl: './book-summary.css',
})
export class BookSummary {
  book = input.required<BookDetailView>();
  isBorrowing = input(false);

  borrowBook = output<void>();
}
