import { Component } from '@angular/core';
import { usersData } from '../../data/user.data';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router) {}

  authenticateUser(email: string, password: string): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Te rugăm să completezi toate câmpurile!';
      return;
    }

    const user = usersData.find((u) => u.email === this.email && u.password === this.password);
    if (!user) {
      this.errorMessage = 'Date incorecte';
      return;
    }

    if (user.email.includes('usm.com')) {
      this.router.navigate(['/user/professor/classes']);
    } else if (user.email.includes('student.usv.ro')) {
      this.router.navigate(['/user/student/exams']);
    } else {
      this.errorMessage = 'User necunoscut';
    }
  }
}
