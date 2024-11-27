import { Component,OnInit } from '@angular/core';
import { usersData } from '../../data/user.data';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule,HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  users:any=[];


  constructor(private router: Router,private authService:AuthService) {}


  onLogin(): void {
    console.log('Email trimis:', this.email);  
    console.log('Parola trimisă:', this.password); 
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Răspuns server:', response);
        // Salvăm token-ul în sesiune
        this.authService.saveToken(response.token);

          //       // Asigurăm verificarea în ordine strictă
        if (this.email.endsWith('student.usv.ro')) {
          this.router.navigate(['/user/student/exams']);
        } else if (this.email.endsWith('usm.com')) {
          this.router.navigate(['/user/professor/appointments']);
        } else if (this.email.endsWith('usv.ro')) {
          this.router.navigate(['/user/professor/appointments']);
        } else {
          this.errorMessage = 'User necunoscut';
        }
     
      },
      error: (err) => {
        console.error('Eroare login:', err);
        this.errorMessage = 'Email sau parolă invalidă!';
      }
    });
  }

}
  





