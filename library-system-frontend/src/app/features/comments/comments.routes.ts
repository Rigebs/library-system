import { Routes } from '@angular/router';
import { ModerationPage } from './pages/moderation-page/moderation-page';

export const COMMENTS_ROUTES: Routes = [
  {
    path: '',
    component: ModerationPage,
    title: 'Moderación de Comentarios',
  },
];
