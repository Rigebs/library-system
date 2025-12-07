import { Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list';
import { UserCreateComponent } from './components/user-create/user-create';
import { UserEditComponent } from './components/user-edit/user-edit';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    component: UserListComponent,
    title: 'Gestión de Usuarios',
  },
  {
    path: 'create',
    component: UserCreateComponent,
    title: 'Crear Usuario',
  },
  {
    path: 'edit/:id',
    component: UserEditComponent,
    title: 'Editar Usuario',
  },
];
