import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { switchMap, of } from 'rxjs';

// Mock de datos (reemplazar con llamadas al servicio real)
interface BookDetailResponse {
  id: number;
  title: string;
  author: string;
  coverUrl: string;
  isbn: string;
  editorial: string;
  category: string;
  summary: string;
  totalQuantity: number;
  availableQuantity: number;
  rating: number; // Para RF4.1
}

@Component({
  selector: 'app-book-detail',
  imports: [CommonModule],
  templateUrl: './book-detail.html',
  styleUrl: './book-detail.css',
})
export class BookDetailComponent {
  private route = inject(ActivatedRoute);
  // private loanService = inject(LoanService); // Servicio para préstamos
  // private bookService = inject(BookService); // Servicio para obtener detalles

  public book = signal<BookDetailResponse | null>(null);
  public isLoading = signal(true);
  public isBorrowing = signal(false);

  // Carga los datos del libro basado en el ID de la ruta
  constructor() {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');
          this.isLoading.set(true);
          if (id) {
            // ⚠️ Reemplazar con this.bookService.findBookDetail(id)
            return this.getMockBook(+id);
          }
          return of(null);
        })
      )
      .subscribe((bookData) => {
        this.isLoading.set(false);
        this.book.set(bookData);
      });
  }

  onBorrow() {
    if (this.book()!.availableQuantity === 0) return;

    this.isBorrowing.set(true);
    // ⚠️ Aquí va la llamada al servicio de Préstamos (RF3.1)
    console.log(`Solicitando préstamo para el libro ID: ${this.book()!.id}`);

    // Simulación de préstamo exitoso
    setTimeout(() => {
      this.isBorrowing.set(false);
      alert(`¡Préstamo de "${this.book()!.title}" concedido!`);
      // Lógica para actualizar el stock localmente o recargar
    }, 1500);
  }

  // --- Mock Function ---
  private getMockBook(id: number): Promise<BookDetailResponse | null> {
    const mockData: BookDetailResponse[] = [
      {
        id: 1,
        title: 'Cien años de soledad',
        author: 'Gabriel García Márquez',
        coverUrl:
          'https://tse3.mm.bing.net/th/id/OIP.iQwjd5SnmY00CsM1Ojo-ggHaJQ?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3',
        isbn: '978-0307474728',
        editorial: 'Editorial Sudamericana',
        category: 'Ficción',
        summary:
          'La novela cuenta la historia de la familia Buendía a lo largo de siete generaciones en el pueblo ficticio de Macondo, explorando temas como el amor, la soledad y el destino.',
        totalQuantity: 10,
        availableQuantity: 3,
        rating: 4.5,
      },
      {
        id: 2,
        title: 'El Gran Gatsby',
        author: 'F. Scott Fitzgerald',
        coverUrl: '/covers/c2.jpg',
        isbn: '978-0743273565',
        editorial: 'Scribner',
        category: 'Ficción',
        summary:
          'Un clásico que explora los temas de la decadencia, el idealismo, la resistencia al cambio, la convulsión social y el exceso, creando un retrato de la década de 1920 en Estados Unidos.',
        totalQuantity: 8,
        availableQuantity: 0,
        rating: 4.2,
      },
      {
        id: 3,
        title: '1984',
        author: 'George Orwell',
        coverUrl: '/covers/c3.jpg',
        isbn: '978-0451524935',
        editorial: 'Secker & Warburg',
        category: 'Ciencia Ficción',
        summary:
          'Una distopía que narra la vida de Winston Smith, un miembro externo del Partido que vive en Oceanía, un país regido por el "Gran Hermano" donde se prohíben las libertades individuales.',
        totalQuantity: 15,
        availableQuantity: 10,
        rating: 4.8,
      },
    ];
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockData.find((b) => b.id === id) || null);
      }, 300);
    });
  }
}
