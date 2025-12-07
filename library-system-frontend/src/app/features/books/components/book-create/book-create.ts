import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BookFormComponent } from '../book-form/book-form';
import { BookService } from '../../book.service';
import { BookPayload } from '../../models/book.model';

@Component({
  selector: 'app-book-create',
  imports: [BookFormComponent],
  templateUrl: './book-create.html',
  styleUrl: './book-create.css',
})
export class BookCreateComponent {
  public isSubmitting = signal(false);
  private bookService = inject(BookService);
  public router = inject(Router);

  onSubmit(payload: BookPayload) {
    this.isSubmitting.set(true);
    this.bookService.createBook(payload).subscribe({
      next: () => {
        alert('Book created successfully!');
        this.router.navigate(['/books']);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        alert(`Error creating book: ${err.message}`);
      },
    });
  }
}
