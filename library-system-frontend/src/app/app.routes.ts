import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';
import { AuthLayout } from './core/layouts/auth-layout/auth-layout';
import { MainLayout } from './core/layouts/main-layout/main-layout';
import { DefaultLayout } from './core/layouts/default-layout/default-layout';

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
      {
        path: 'categories',
        loadChildren: () =>
          import('./features/categories/category.routes').then((m) => m.CATEGORY_ROUTES),
      },
      {
        path: 'loans',
        loadChildren: () => import('./features/loans/loan.routes').then((m) => m.LOAN_ROUTES),
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
      },
      {
        path: 'moderation',
        loadChildren: () =>
          import('./features/comments/comments.routes').then((m) => m.COMMENTS_ROUTES),
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
