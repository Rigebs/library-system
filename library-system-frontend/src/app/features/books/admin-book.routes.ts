import { Routes } from '@angular/router';
import { BookListComponent } from './components/book-list/book-list';
import { BookCreateComponent } from './components/book-create/book-create';
import { BookEditComponent } from './components/book-edit/book-edit';

export const ADMIN_BOOKS_ROUTES: Routes = [
  {
    path: '',
    title: 'Books Management',
    component: BookListComponent,
  },
  {
    path: 'create',
    title: 'Create Book',
    component: BookCreateComponent,
  },
  {
    path: 'edit/:id',
    title: 'Edit Book',
    component: BookEditComponent,
  },
];
