import { Routes } from '@angular/router';

export const LOAN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/loan-management/loan-management').then((m) => m.LoanManagementPage),
  },
  {
    path: 'create',
    loadComponent: () => import('./pages/loan-create/loan-create').then((m) => m.LoanCreatePage),
  },
  {
    path: ':id/view',
    loadComponent: () => import('./pages/loan-view/loan-view').then((m) => m.LoanViewPage),
  },
  {
    path: 'history',
    loadComponent: () => import('./pages/loan-history/loan-history').then((m) => m.LoanHistoryPage),
  },
];
