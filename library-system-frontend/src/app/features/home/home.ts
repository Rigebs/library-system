import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService } from '../books/book.service';
import { BookCardComponent } from '../../shared/components/book-card/book-card';

@Component({
  selector: 'app-home',
  imports: [CommonModule, BookCardComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent implements OnInit {
  private bookService = inject(BookService);

  public readonly availableBooks = this.bookService.books;
  public readonly isLoading = this.bookService.isLoading;
  public readonly loadingError = this.bookService.error;
  public readonly currentSearchTerm = this.bookService.currentSearchTerm;

  readonly visits = signal(0);
  readonly appName = 'Biblioteca Digital';
  readonly welcomeMessage = computed(() => {
    if (this.visits() === 0) {
      return `¡Bienvenido por primera vez a ${this.appName}!`;
    }
    return `Gracias por visitarnos. Visitas totales: ${this.visits()}.`;
  });

  ngOnInit(): void {
    this.bookService.loadBooks();
  }

  incrementVisits(): void {
    this.visits.update((count) => count + 1);
  }
}
