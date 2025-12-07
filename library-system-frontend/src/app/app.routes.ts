import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';
import { AuthLayout } from './core/layouts/auth-layout/auth-layout';
import { MainLayout } from './core/layouts/main-layout/main-layout';
import { DefaultLayout } from './core/layouts/default-layout/default-layout';
import { AdminGuard } from './core/auth/admin.guard';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayout,
    children: [
      {
        path: '',
        loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
      },
    ],
  },

  {
    path: 'admin',
    component: MainLayout,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'users',
        loadChildren: () => import('./features/users/users.routes').then((m) => m.USERS_ROUTES),
      },
      {
        path: 'books',
        loadChildren: () =>
          import('./features/books/admin-book.routes').then((m) => m.ADMIN_BOOKS_ROUTES),
      },
    ],
  },

  {
    path: '',
    component: DefaultLayout,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./features/home/home.routes').then((m) => m.HOME_ROUTES),
      },
      {
        path: 'catalog',
        loadChildren: () =>
          import('./features/books/public-catalog.routes').then((m) => m.CATALOG_ROUTES),
      },
    ],
  },

  { path: '**', redirectTo: '' },
];
