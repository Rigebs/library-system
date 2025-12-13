import { Component, inject, WritableSignal, signal } from '@angular/core';
import { BookService } from '../../book.service';
import { Router, RouterLink } from '@angular/router';
import { Book } from '../../models/book.model';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  MinimalTableComponent,
  TableAction,
  TableColumn,
} from '../../../../shared/components/minimal-table/minimal-table';

@Component({
  selector: 'app-book-list',
  imports: [RouterLink, CommonModule, MinimalTableComponent],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css',
})
export class BookListComponent {
  private bookService = inject(BookService);
  private router = inject(Router);

  public books = this.bookService.books;
  public isLoading = this.bookService.isLoading;
  public error = this.bookService.error;
  public isDeleting: WritableSignal<boolean> = signal(false);

  booksList: Book[] = [
    {
      id: 1,
      title: 'Cien años de soledad',
      author: 'Gabriel García Márquez',
      isbn: '978-0307474728',
      publisher: 'Editorial Sudamericana',
      summary: 'Épica saga familiar.',
      fileUrl: '',
      coverUrl: '',
      totalQuantity: 25,
      category: { id: 1, name: 'Ficción' },
      categoryId: 1,
    },
    {
      id: 2,
      title: 'El nombre del viento',
      author: 'Patrick Rothfuss',
      isbn: '978-0756404741',
      publisher: 'DAW Books',
      summary: 'Fantasía épica.',
      fileUrl: '',
      coverUrl: '',
      totalQuantity: 10,
      category: { id: 2, name: 'Fantasía' },
      categoryId: 2,
    },
    {
      id: 3,
      title: 'Sapiens: De animales a dioses',
      author: 'Yuval Noah Harari',
      isbn: '978-0062316097',
      publisher: 'Harper',
      summary: 'Historia de la humanidad.',
      fileUrl: '',
      coverUrl: '',
      totalQuantity: 50,
      category: { id: 3, name: 'No Ficción' },
      categoryId: 3,
    },
    {
      id: 4,
      title: 'La Guía del Autoestopista Galáctico',
      author: 'Douglas Adams',
      isbn: '978-0345391803',
      publisher: 'Harmony Books',
      summary: 'Ciencia ficción cómica.',
      fileUrl: '',
      coverUrl: '',
      totalQuantity: 0,
      category: { id: 4, name: 'Ciencia Ficción' },
      categoryId: 4,
    },
    {
      id: 5,
      title: 'Fundación',
      author: 'Isaac Asimov',
      isbn: '978-0553293357',
      publisher: 'Doubleday',
      summary: 'Ciencia Ficción clásica.',
      fileUrl: '',
      coverUrl: '',
      totalQuantity: 18,
      category: { id: 4, name: 'Ciencia Ficción' },
      categoryId: 4,
    },
    // Añadir más datos si es necesario
  ];

  // Configuración de las columnas (usando `keyof Book`)
  // Para mostrar el nombre de la categoría, podemos usar 'category' (si se muestra como string)
  // o modificar la tabla para aceptar una función de transformación.
  // Por simplicidad, mostraremos las propiedades directas:
  bookColumns: TableColumn<Book>[] = [
    { key: 'id', header: 'ID' },
    { key: 'title', header: 'Título', isSortable: true },
    { key: 'author', header: 'Autor', isSortable: true },
    { key: 'publisher', header: 'Editorial' },
    // Mostramos la cantidad total como 'Stock' para mantener la lógica de acciones
    { key: 'totalQuantity', header: 'Cantidad' },
    // Columna especial para las acciones
    { key: 'actions', header: 'Acciones' },
  ];

  // Configuración de las acciones
  bookActions: TableAction<Book>[] = [
    {
      label: 'Editar',
      color: 'primary',
      icon: '/icons/edit.svg', // Usando tu icono de edición
      onClick: (book: Book) => this.editBook(book),
    },
    {
      label: 'Eliminar',
      color: 'warn',
      icon: '/icons/delete.svg', // Usando tu icono de eliminación
      isHidden: (book: Book) => book.totalQuantity === 0,
      onClick: (book: Book) => this.deleteBook(book),
    },
  ];

  editBook(book: Book): void {
    this.router.navigate(['/admin/books/edit', book.id]);
  }

  deleteBook(book: Book): void {
    if (confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
      this.isDeleting.set(true);
      this.bookService
        .deleteBook(book.id)
        .pipe(finalize(() => this.isDeleting.set(false)))
        .subscribe({
          next: () => {
            console.log(`Book with ID ${book.id} deleted successfully.`);
          },
          error: (err) => {
            alert(`Error deleting book: ${err.message}`);
          },
        });
    }
  }

  constructor() {
    if (this.books().length === 0) {
      this.bookService.loadBooks();
    }
  }
}
