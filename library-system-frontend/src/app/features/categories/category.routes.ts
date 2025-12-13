import { Routes } from '@angular/router';
import { CategoryManagementPage } from './pages/category-management/category-management';

export const CATEGORY_ROUTES: Routes = [
  {
    path: '',
    component: CategoryManagementPage,
    title: 'Gestión de Categorías',
  },
];
