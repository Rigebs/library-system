import { Routes } from '@angular/router';

export const CATALOG_ROUTES: Routes = [
  {
    path: '',
    title: 'Book Catalog',
    loadComponent: () => import('./pages/catalog/catalog').then((m) => m.CatalogComponent),
  },
  {
    path: ':id',
    title: 'Book Detail',
    loadComponent: () =>
      import('./pages/book-detail/book-detail').then((m) => m.BookDetailComponent),
  },
];
