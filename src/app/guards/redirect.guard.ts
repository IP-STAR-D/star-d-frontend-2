import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class redirectGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = this.authService.isAuthenticated();
    const role = this.authService.getRole();

    if (isAuthenticated) {
      if (role === 'student') {
        this.router.navigate(['/student/exams']);
      } else if (role === 'professor') {
        this.router.navigate(['/professor/appointments']);
      } else if (role === 'admin') {
        this.router.navigate(['/admin']);
      }
    } else {
      this.router.navigate(['/login']);
    }

    return false;
  }
}
