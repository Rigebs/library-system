import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface BookResponse {
  id: number;
  title: string;
  author: string;
  coverUrl: string;
  isbn: string;
  totalQuantity: number;
  availableQuantity: number;
}

interface CategoryResponse {
  id: number;
  name: string;
}

@Component({
  selector: 'app-catalog',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class CatalogComponent {
  private fb = inject(FormBuilder);
  // private bookService = inject(BookService); // Reemplazar

  // Estado
  public isLoading = signal(false);
  public error = signal<string | null>(null);
  public books = signal<BookResponse[]>([
    // Datos de ejemplo
    {
      id: 1,
      title: 'Cien años de soledad',
      author: 'Gabriel García Márquez',
      coverUrl:
        'https://tse3.mm.bing.net/th/id/OIP.iQwjd5SnmY00CsM1Ojo-ggHaJQ?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3',
      isbn: '978-0307474728',
      totalQuantity: 10,
      availableQuantity: 3,
    },
    {
      id: 2,
      title: 'El Gran Gatsby',
      author: 'F. Scott Fitzgerald',
      coverUrl: '/covers/c2.jpg',
      isbn: '978-0743273565',
      totalQuantity: 8,
      availableQuantity: 0,
    },
    {
      id: 3,
      title: '1984',
      author: 'George Orwell',
      coverUrl: '/covers/c3.jpg',
      isbn: '978-0451524935',
      totalQuantity: 15,
      availableQuantity: 10,
    },
  ]);
  public categories = signal<CategoryResponse[]>([
    { id: 1, name: 'Ficción' },
    { id: 2, name: 'Ciencia Ficción' },
    { id: 3, name: 'Misterio' },
  ]);

  // Formulario de Búsqueda Avanzada (RF1.1)
  public searchForm = this.fb.nonNullable.group({
    title: [''],
    author: [''],
    isbn: [''],
    editorial: [''],
    categoryId: [null as number | null],
  });

  constructor() {
    // Inicializa la carga de datos al cargar el componente
    // this.loadBooks();
  }

  onSearch() {
    this.isLoading.set(true);
    const filters = this.searchForm.getRawValue();
    console.log('Filtros de búsqueda:', filters);
    // ⚠️ Aquí iría la llamada al servicio con los filtros
    // this.bookService.searchBooks(filters).subscribe({...});
    // Simulación de carga
    setTimeout(() => {
      this.isLoading.set(false);
      // Mostrar solo los libros disponibles para simular
      this.books.update((b) => b.filter((book) => book.availableQuantity > 0));
    }, 500);
  }

  onClearFilters() {
    this.searchForm.reset({
      title: '',
      author: '',
      isbn: '',
      editorial: '',
      categoryId: null,
    });
    // Vuelve a cargar todos los libros
    // this.loadBooks();
    this.books.set([
      {
        id: 1,
        title: 'Cien años de soledad',
        author: 'Gabriel García Márquez',
        coverUrl: '/covers/c1.jpg',
        isbn: '978-0307474728',
        totalQuantity: 10,
        availableQuantity: 3,
      },
      {
        id: 2,
        title: 'El Gran Gatsby',
        author: 'F. Scott Fitzgerald',
        coverUrl: '/covers/c2.jpg',
        isbn: '978-0743273565',
        totalQuantity: 8,
        availableQuantity: 0,
      },
      {
        id: 3,
        title: '1984',
        author: 'George Orwell',
        coverUrl: '/covers/c3.jpg',
        isbn: '978-0451524935',
        totalQuantity: 15,
        availableQuantity: 10,
      },
    ]);
  }
}
