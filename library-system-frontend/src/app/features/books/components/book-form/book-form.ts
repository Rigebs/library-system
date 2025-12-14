import { Component, input, output, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { BookPayload } from '../../models/book.model';
import { Category } from '../../../categories/models/category.model';
import { Book } from '../../models/book.model'; // 💡 Importamos la interfaz Book completa
import { UploadService } from '../../upload.service';
import { finalize } from 'rxjs';

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
  public initialData = input<InitialBookData>(null);
  public isEditMode = input.required<boolean>();
  public isSubmitting = input<boolean>(false);
  public formSubmit = output<BookPayload>();

  public categories = input<Category[]>([]);

  private uploadService = inject(UploadService);
  private fb = inject(FormBuilder);
  public bookForm!: FormGroup;

  public isCoverUploading = signal(false);
  public isFileUploading = signal(false);
  public uploadError = signal<string | null>(null);

  public uploadedFileName = signal<string | null>(null);

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

    if (this.initialData()?.fileUrl) {
      const parts = this.initialData()!.fileUrl.split('/');
      this.uploadedFileName.set(parts[parts.length - 1]);
    }
  }

  onFileUpload(event: Event, type: 'cover' | 'file'): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;

    if (!file) return;

    this.uploadError.set(null);

    const validCoverTypes = ['image/jpeg', 'image/png'];
    const validBookTypes = ['application/pdf', 'application/epub+zip'];
    const validTypes = type === 'cover' ? validCoverTypes : validBookTypes;

    if (
      !validTypes.includes(file.type) &&
      (type !== 'file' || !file.name.toLowerCase().endsWith('.epub'))
    ) {
      this.uploadError.set(
        `Tipo de archivo ${type === 'cover' ? 'de portada' : 'de libro'} no válido.`
      );
      input.value = '';
      return;
    }

    const isUploadingSignal = type === 'cover' ? this.isCoverUploading : this.isFileUploading;
    isUploadingSignal.set(true);

    this.uploadService
      .uploadFile(file, type === 'cover' ? 'covers' : 'books')
      .pipe(finalize(() => isUploadingSignal.set(false)))
      .subscribe({
        next: (response) => {
          const controlName = type === 'cover' ? 'coverUrl' : 'fileUrl';

          this.bookForm.get(controlName)?.setValue(response.url);
          this.bookForm.get(controlName)?.markAsDirty();

          if (type === 'file') {
            this.uploadedFileName.set(file.name);
          }
        },
        error: (err) => {
          this.uploadError.set(`Error al subir el archivo de ${type}.`);
          console.error(err);
          input.value = '';

          if (type === 'file') {
            this.uploadedFileName.set(null);
          }
        },
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
