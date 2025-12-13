import { Component, input, output, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { BookPayload } from '../../models/book.model';
import { Category } from '../../../categories/models/category.model';
import { Book } from '../../models/book.model'; // 💡 Importamos la interfaz Book completa

// Definimos una interfaz más amplia para manejar los datos de entrada
// Esto permite que el componente reciba tanto el payload de creación como el objeto completo de la API
type InitialBookData = BookPayload | Book | null;

@Component({
  selector: 'app-book-form',
  // Asumo standalone: true y que ReactiveFormsModule está importado
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './book-form.html',
  styleUrl: './book-form.css',
})
export class BookFormComponent implements OnInit {
  // Cambiamos el tipo de initialData para aceptar Book o BookPayload
  public initialData = input<InitialBookData>(null);
  public isEditMode = input.required<boolean>();
  public isSubmitting = input<boolean>(false);
  public formSubmit = output<BookPayload>();

  public categories = input<Category[]>([]);

  private fb = inject(FormBuilder);
  public bookForm!: FormGroup;

  ngOnInit() {
    const getCategoryId = (data: InitialBookData): number | null => {
      if (!data) return null;

      if (data.categoryId) return data.categoryId;

      if ('category' in data && data.category && data.category.id) {
        return data.category.id;
      }

      return null;
    };

    const initialCategoryId = getCategoryId(this.initialData());

    this.bookForm = this.fb.group({
      title: [this.initialData()?.title || '', Validators.required],
      author: [this.initialData()?.author || '', Validators.required],
      isbn: [this.initialData()?.isbn || '', Validators.required],
      publisher: [this.initialData()?.publisher || '', Validators.required],
      summary: [this.initialData()?.summary || '', Validators.required],
      fileUrl: [this.initialData()?.fileUrl || '', Validators.required],
      coverUrl: [this.initialData()?.coverUrl || '', Validators.required],
      totalQuantity: [
        this.initialData()?.totalQuantity || 1,
        [Validators.required, Validators.min(1)],
      ],
      categoryId: [initialCategoryId || null, [Validators.required, Validators.min(1)]],
    });
  }

  onSubmit() {
    if (this.bookForm.valid) {
      this.formSubmit.emit(this.bookForm.value as BookPayload);
    }
  }

  hasError(controlName: string, errorType: string) {
    const control = this.bookForm.get(controlName);
    return control && control.hasError(errorType) && (control.touched || control.dirty);
  }
}
