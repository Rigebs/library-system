import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth/auth.service';

interface NavItem {
  label: string;
  icon?: string;
  routerLink?: string;
  exactLink?: boolean;
  menuKey?: string;
  children?: NavItem[];
}

const SIDEBAR_NAV_DATA: NavItem[] = [
  {
    label: 'Dashboards',
    icon: '/icons/home.svg',
    menuKey: 'dashboard',
    routerLink: '/admin/dashboard',
  },
  {
    label: 'Catálogo / Libros',
    icon: '/icons/tag.svg',
    menuKey: 'books',
    children: [
      {
        label: 'Lista de Libros',
        routerLink: '/admin/books',
        exactLink: true,
      },
      {
        label: 'Registrar Libro',
        routerLink: '/admin/books/create',
      },
      {
        label: 'Gestión de Categorías',
        routerLink: '/admin/categories',
      },
    ],
  },
  {
    label: 'Préstamos Digitales',
    icon: '/icons/calendar.svg',
    menuKey: 'loans',
    children: [
      {
        label: 'Préstamos',
        routerLink: '/admin/loans/active',
      },
      {
        label: 'Historial Completo',
        routerLink: '/admin/loans/history',
      },
    ],
  },
  {
    label: 'Gestión de Usuarios',
    icon: '/icons/users.svg',
    menuKey: 'users',
    children: [
      {
        label: 'Lista de Usuarios',
        routerLink: '/admin/users',
        exactLink: true,
      },
      {
        label: 'Crear Nuevo Usuario',
        routerLink: '/admin/users/create',
      },
    ],
  },
  {
    label: 'Moderar Comentarios',
    icon: '/icons/message-square.svg',
    routerLink: '/admin/moderation',
  },
  {
    label: 'Configuración',
    icon: '/icons/settings.svg',
    routerLink: '/admin/settings',
  },
];

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent {
  private authService = inject(AuthService);
  menuOpen: string | null = null;
  navItems: NavItem[] = SIDEBAR_NAV_DATA;

  userName: string = 'Juan Pérez';
  userRole: string = 'Administrador';
  logoutIcon: string = '/icons/logout.svg';

  toggleMenu(menuKey: string | undefined): void {
    if (!menuKey) return;
    this.menuOpen = this.menuOpen === menuKey ? null : menuKey;
  }

  getUserInitial(): string {
    return this.userName ? this.userName.charAt(0).toUpperCase() : '';
  }

  performAction(item: NavItem): void {
    if (item.children && item.menuKey) {
      this.toggleMenu(item.menuKey);
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
