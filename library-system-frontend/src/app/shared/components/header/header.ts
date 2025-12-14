import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookSearch } from '../book-search/book-search';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, BookSearch],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class HeaderComponent {
  private authService = inject(AuthService);

  public readonly isLoggedIn = this.authService.isLoggedIn;
  public isAdmin = this.authService.isUserAdmin;
  public readonly currentUser = this.authService.currentUser;

  readonly isMenuOpen = signal(false);

  readonly isSearchVisible = signal(false);

  logout(): void {
    this.authService.logout();
    this.isMenuOpen.set(false);
  }

  toggleMenu(): void {
    this.isMenuOpen.update((value) => !value);
    this.isSearchVisible.set(false);
  }

  toggleSearch(): void {
    this.isSearchVisible.update((value) => !value);
    this.isMenuOpen.set(false);
  }
}
