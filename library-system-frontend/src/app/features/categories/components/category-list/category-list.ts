import { Component, input, output, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../category.service';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-category-list',
  imports: [CommonModule],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export class CategoryListComponent {
  private readonly categoryService = inject(CategoryService);

  categories = input.required<Category[]>();
  isLoading = input.required<boolean>();
  error = input<string | null>(null);

  editCategory = output<Category>();
  categoryDeleted = output<{ message: string; success: boolean }>();

  public isDeleting: WritableSignal<boolean> = signal(false);

  onEdit(category: Category) {
    this.editCategory.emit(category);
  }

  onDelete(id: number, name: string) {
    if (
      confirm(
        `¿Estás seguro de que deseas eliminar la categoría "${name}" (ID: ${id})? \nEsto puede fallar si hay libros asociados.`
      )
    ) {
      this.isDeleting.set(true);
      this.categoryService
        .deleteCategory(id)
        .pipe(finalize(() => this.isDeleting.set(false)))
        .subscribe({
          next: () => {
            this.categoryDeleted.emit({
              message: `Categoría "${name}" eliminada correctamente.`,
              success: true,
            });
          },
          error: (err: HttpErrorResponse) => {
            const errorMessage =
              'ERROR: ' + (err.error?.message || 'Verifique que no haya libros asociados.');
            this.categoryDeleted.emit({ message: errorMessage, success: false });
          },
        });
    }
  }
}
