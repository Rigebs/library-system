import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class HeaderComponent {
  private authService = inject(AuthService);

  public isLoggedIn = this.authService.isLoggedIn;

  public currentUser = this.authService.currentUser;

  logout() {
    this.authService.logout();
  }
}
