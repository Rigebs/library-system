import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryFormComponent } from '../../components/category-form/category-form';
import { CategoryService } from '../../category.service';
import { Category } from '../../models/category.model';
import { CategoryListComponent } from '../../components/category-list/category-list';

interface CategoryDeletedEvent {
  message: string;
  success: boolean;
}

@Component({
  selector: 'app-category-management-page',
  imports: [CommonModule, CategoryFormComponent, CategoryListComponent],
  templateUrl: './category-management.html',
  styleUrl: './category-management.css',
})
export class CategoryManagementPage implements OnInit {
  private readonly categoryService = inject(CategoryService);

  public categories = this.categoryService.categories;
  public selectedCategory = this.categoryService.selectedCategory;
  public isLoading = this.categoryService.isLoading;
  public error = this.categoryService.error;

  public successMessage = signal<string | null>(null);
  public globalError = signal<string | null>(null);

  public isDialogOpen = signal(false);

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.successMessage.set(null);
    this.globalError.set(null);
    this.categoryService.loadCategories();
  }

  openCreateDialog() {
    this.categoryService.selectCategory(null);
    this.isDialogOpen.set(true);
    this.successMessage.set(null);
    this.globalError.set(null);
  }

  closeDialog() {
    this.isDialogOpen.set(false);
    this.categoryService.selectCategory(null);
  }

  onCategorySaved(message: string) {
    this.closeDialog();
    this.successMessage.set(message);
    this.globalError.set(null);
    this.loadCategories();
  }

  onEditCategory(category: Category) {
    this.categoryService.selectCategory(category);
    this.isDialogOpen.set(true);
    this.successMessage.set(null);
    this.globalError.set(null);
  }

  onCategoryDeleted(event: CategoryDeletedEvent) {
    this.globalError.set(null);
    this.successMessage.set(null);

    if (!event.success) {
      this.globalError.set(event.message);
    } else {
      this.successMessage.set(event.message);
      this.loadCategories();
    }
  }
}
