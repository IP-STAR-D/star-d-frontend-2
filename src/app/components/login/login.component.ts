import { Component, OnInit } from '@angular/core';
import { usersData } from '../../data/user.data';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, MatInputModule, MatFormFieldModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  users: any = [];

  constructor(private router: Router, private authService: AuthService, private snackBarService: SnackBarService) {}

  onLogin(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);
        const role = this.authService.getRole();

        if (response.isAdmin) {
          this.router.navigate(['/admin']);
        } else if (response.role === 'professor') {
          this.router.navigate(['/professor/appointments']);
        } else if (response.role === 'student') {
          this.router.navigate(['/student/exams']);
        } else {
          this.errorMessage = 'Rol necunoscut';
        }
      },
      error: (err) => {
        this.snackBarService.show('Eroare login!', 'error');
        this.errorMessage = 'Email sau parola invalida!';
      },
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onContinue(): void {
    const role = this.authService.getRole();

    if (role === 'professor') {
      this.router.navigate(['/professor/appointments']);
    } else if (role === 'student') {
      this.router.navigate(['/student/exams']);
    } else if (role === 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.errorMessage = 'Rol necunoscut';
    }
  }

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }
}
