import { Component, input, output, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { BookPayload } from '../../models/book.model';

@Component({
  selector: 'app-book-form',
  imports: [ReactiveFormsModule],
  templateUrl: './book-form.html',
  styleUrl: './book-form.css',
})
export class BookFormComponent implements OnInit {
  public initialData = input<BookPayload | null>(null);
  public isEditMode = input.required<boolean>();
  public isSubmitting = input<boolean>(false);
  public formSubmit = output<BookPayload>();

  private fb = inject(FormBuilder);
  public bookForm!: FormGroup;

  ngOnInit() {
    this.bookForm = this.fb.group({
      title: [this.initialData()?.title || '', Validators.required],
      author: [this.initialData()?.author || '', Validators.required],
      isbn: [this.initialData()?.isbn || '', Validators.required],
      // ✅ Campo actualizado de 'editorial' a 'publisher' para el backend
      publisher: [this.initialData()?.publisher || '', Validators.required],
      summary: [this.initialData()?.summary || '', Validators.required],
      // ✅ Campo actualizado de 'filePath' a 'fileUrl' para el backend
      fileUrl: [this.initialData()?.fileUrl || '', Validators.required],
      coverUrl: [this.initialData()?.coverUrl || '', Validators.required],
      totalQuantity: [
        this.initialData()?.totalQuantity || 1,
        [Validators.required, Validators.min(1)],
      ],
    });
  }

  onSubmit() {
    if (this.bookForm.valid) {
      this.formSubmit.emit(this.bookForm.value as BookPayload);
    }
  }

  // Helper para validaciones
  hasError(controlName: string, errorType: string) {
    const control = this.bookForm.get(controlName);
    // Agregamos control.dirty para una mejor UX al momento de escribir
    return control && control.hasError(errorType) && (control.touched || control.dirty);
  }
}
