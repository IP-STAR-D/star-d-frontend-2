import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { Exam } from '../../models/exam.model';
import { ExamService } from '../../services/exam.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-exams',
  standalone: true,
  imports: [CommonModule, MatGridListModule, MatCardModule],
  templateUrl: './exams.component.html',
  styleUrl: './exams.component.css',
})
export class ExamsComponent implements OnInit {
  exams: Exam[] = [];
  users: User[] = [];
  errorMessage: string = '';

  constructor(private router: Router, private examService: ExamService, private userService: UserService) {}

  ngOnInit(): void {
    this.loadExams();
    this.loadUsers();
  }

  loadExams(): void {
    this.examService.getExams().subscribe({
      next: (data: Exam[]) => {
        this.exams = data;
        console.log('Exams:', this.exams);
      },
      error: (err) => {
        console.error('Eroare la preluarea examenelor:', err);
        this.errorMessage = 'Nu s-au putut încărca examenele.';
      },
    });
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data: User[]) => {
        this.users = data;
        console.log('Users:', this.users);
      },
      error: (err) => {
        console.error('Eroare la preluarea utilizatorilor:', err);
        this.errorMessage = 'Nu s-au putut încărca utilizatorii.';
      },
    });
  }

  redirectToExam(examId: number): void {
    this.router.navigate([`user/student/exams/${examId}`]);
  }

  getProfessor(professorId: number): User | null {
    const professor = this.users.find((user) => user.userId === professorId);
    return professor ? professor : null;
  }
}
