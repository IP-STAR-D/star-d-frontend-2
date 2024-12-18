import { Inject, PLATFORM_ID, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformServer } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { SnackBarService } from '../../services/snack-bar.service';
import { GoogleAuthService } from '../../services/googleAuthService.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, MatInputModule, MatFormFieldModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  users: any = [];
  isServer = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBarService: SnackBarService,
    @Inject(PLATFORM_ID) private platformId: object,
    private googleService: GoogleAuthService
  ) {
    this.isServer = isPlatformServer(this.platformId);
  }
  ngOnInit(): void {
    //this.googleService.getFirebaseUserData();
  }

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
  handleGoogleLogin() {
    this.googleService
      .signInWithGoogle()
      .then(() => {
        const role = this.authService.getRole();

        if (role === 'professor') {
          this.router.navigate(['/professor/appointments']);
        } else if (role === 'student') {
          this.router.navigate(['/student/exams']);
        } else {
          this.errorMessage = 'Rol necunoscut';
        }
      })
      .catch((error) => {
        console.error('Eroare la autentificare:', error);
        this.errorMessage = 'Autentificare Google eșuată.';
      });
  }
}
