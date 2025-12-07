import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Book } from '../../../features/books/models/book.model';

@Component({
  selector: 'app-book-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './book-card.html',
  styleUrl: './book-card.css',
})
export class BookCardComponent {
  book = input.required<Book>();

  readonly IMAGE_WIDTH = 150;
  readonly IMAGE_HEIGHT = 225;

  getBookDetailRoute(id: number): string[] {
    return ['/books', id.toString()];
  }
}
