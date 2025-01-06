import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { SnackBarService } from '../../services/snack-bar.service';

import { UserResponse } from '../../models/user.model';

type UserRole = 'student' | 'professor' | 'admin';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  isNotLogin: boolean = true;
  userInfo: UserResponse | undefined;
  role: UserRole | undefined;
  gettingUserData: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.isNotLogin = this.router.url !== '/login';
      if (this.authService.getToken() && !this.gettingUserData) {
        this.loadUserData();
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  loadUserData(): void {
    this.userInfo = undefined;
    this.gettingUserData = true;
    this.userService.getUserData().subscribe({
      next: (data: UserResponse) => {
        this.userInfo = data;
        if (data.user.isAdmin) {
          this.role = 'admin';
        } else if (data.student) {
          this.role = 'student';
        } else if (data.professor) {
          this.role = 'professor';
        }
        this.gettingUserData = false;
      },
      error: (err) => {
        console.error('Eroare la preluarea datelor utilizatorului:', err);
        this.snackBarService.show('Eroare la preluarea datelor utilizatorului!', 'error');
        this.gettingUserData = false;
      },
    });
  }

  acronym(str: string | undefined): string {
    if (!str) return '';
    return str.replace(/[^A-Z]/g, '');
  }
}
