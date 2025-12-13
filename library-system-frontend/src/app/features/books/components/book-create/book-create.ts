import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BookFormComponent } from '../book-form/book-form';
import { BookService } from '../../book.service';
import { BookPayload } from '../../models/book.model';
import { CategoryService } from '../../../categories/category.service';

@Component({
  selector: 'app-book-create',
  imports: [BookFormComponent],
  templateUrl: './book-create.html',
  styleUrl: './book-create.css',
})
export class BookCreateComponent implements OnInit {
  public isSubmitting = signal(false);
  private bookService = inject(BookService);
  private categoryService = inject(CategoryService);
  public router = inject(Router);

  public categories = this.categoryService.categories;
  public categoriesLoadingError = this.categoryService.error;

  ngOnInit() {
    this.categoryService.loadCategories();
  }

  onSubmit(payload: BookPayload) {
    this.isSubmitting.set(true);
    this.bookService.createBook(payload).subscribe({
      next: () => {
        alert('Book created successfully!');
        this.router.navigate(['/admin/books']);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        alert(`Error creating book: ${err.message}`);
      },
    });
  }
}
