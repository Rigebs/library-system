import { Component, DestroyRef, inject } from '@angular/core';
import { BookService } from '../../book.service';
import { Router, RouterLink } from '@angular/router';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-list',
  imports: [RouterLink],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css',
})
export class BookListComponent {
  private bookService = inject(BookService);
  private router = inject(Router);

  public books = this.bookService.books;
  public isLoading = this.bookService.isLoading;
  public error = this.bookService.error;

  constructor() {
    if (this.books().length === 0) {
      this.bookService.loadBooks();
    }
  }

  onEdit(book: Book) {
    this.router.navigate(['/admin/books/edit', book.id]);
  }

  onDelete(id: number) {
    if (confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
      this.bookService.deleteBook(id).subscribe({
        next: () => {
          console.log(`Book with ID ${id} deleted successfully.`);
        },
        error: (err) => {
          alert(`Error deleting book: ${err.message}`);
        },
      });
    }
  }
}
