import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { Exam } from '../../models/exam.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-exams',
  standalone: true,
  imports: [CommonModule, MatGridListModule, MatCardModule],
  templateUrl: './exams.component.html',
  styleUrl: './exams.component.css',
})
export class ExamsComponent {
  exams: Exam[] = [
    new Exam(1, 1, 'Ingineria programelor', 1, 2),
    new Exam(2, 2, 'Sisteme inteligente', 1, 2),
    new Exam(3, 3, 'SIIEP', 1, 2),
    new Exam(4, 4, 'Proiectarea bazelor de date', 1, 2),
    new Exam(5, 5, 'Proiectarea translatoarelor', 1, 2),
    new Exam(6, 5, 'Calcul mobil', 1, 2),
  ];

  users: User[] = [
    new User(1, 'turcu.cristina@usm.com', 'Cristina', 'Turcu', 'password123', false),
    new User(2, 'turcu.corneliu@usm.com', 'Corneliu', 'Turcu', 'password123', false),
    new User(3, 'petrariu.adrian@usm.com', 'Adrian', 'Petrariu', 'password123', false),
    new User(4, 'danubianu.mirela@usm.com', 'Mirela', 'Danubianu', 'password123', false),
    new User(5, 'gherman.ovidiu@usm.com', 'Ovidiu', 'Gherman', 'password123', false),
  ];

  constructor(private router: Router) {}

  redirectToExam(examId: number): void {
    this.router.navigate([`/exams/${examId}`]);
  }

  getProfessor(professorId: number): User | null {
    const professor = this.users.find((p) => p.userId === professorId);
    return professor ? professor : null;
  }
}
