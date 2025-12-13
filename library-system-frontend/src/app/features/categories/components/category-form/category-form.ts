import { Component, input, output, inject, effect, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Category, CategoryPayload } from '../../models/category.model';
import { finalize } from 'rxjs';
import { CategoryService } from '../../category.service';

@Component({
  selector: 'app-category-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css',
})
export class CategoryFormComponent {
  private readonly categoryService = inject(CategoryService);
  private readonly fb = inject(FormBuilder);

  selectedCategory = input<Category | null>(null);

  categorySaved = output<string>();

  cancelCallback = input<(() => void) | undefined>();

  isSubmitting = signal(false);
  formError = signal<string | null>(null);

  categoryForm = this.fb.group({
    id: [null as number | null],
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
  });

  constructor() {
    effect(
      () => {
        const category = this.selectedCategory();
        this.categoryForm.reset();
        this.formError.set(null);

        if (category) {
          this.categoryForm.patchValue({
            id: category.id,
            name: category.name,
          });
        }
      },
      { allowSignalWrites: true }
    );
  }

  onSubmit() {
    this.categoryForm.markAllAsTouched();
    if (this.categoryForm.invalid) {
      this.formError.set('Por favor, revise los errores del formulario.');
      return;
    }

    this.isSubmitting.set(true);
    this.formError.set(null);

    const { id, name } = this.categoryForm.getRawValue();
    const payload: CategoryPayload = { name: name! };

    const operation = id
      ? this.categoryService.updateCategory(id, payload) // UPDATE
      : this.categoryService.createCategory(payload); // CREATE

    operation.pipe(finalize(() => this.isSubmitting.set(false))).subscribe({
      next: (result) => {
        const message = id
          ? `Categoría ${result.name} actualizada con éxito.`
          : `Categoría ${result.name} creada con éxito.`;

        this.categorySaved.emit(message);
        this.categoryForm.reset();
        this.categoryService.clearSelection(); // Limpia la selección en el servicio
      },
      error: (err) => {
        const message = err.error?.message || 'Error al procesar la categoría.';
        // Manejo de error específico de duplicidad, si aplica
        this.formError.set(
          message.includes('Unique') ? 'Ya existe una categoría con ese nombre.' : message
        );
      },
    });
  }

  onCancel() {
    if (this.cancelCallback()) {
      this.cancelCallback()!();
    }
    this.categoryService.clearSelection();
    this.categoryForm.reset();
    this.formError.set(null);
  }
}
