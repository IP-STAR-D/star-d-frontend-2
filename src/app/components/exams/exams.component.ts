import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { Exam } from '../../models/exam.model';
import { User } from '../../models/user.model';
import { usersData } from '../../data/user.data';
import { examsData } from '../../data/exam.data';

@Component({
  selector: 'app-exams',
  standalone: true,
  imports: [CommonModule, MatGridListModule, MatCardModule],
  templateUrl: './exams.component.html',
  styleUrl: './exams.component.css',
})
export class ExamsComponent {
  exams: Exam[] = examsData;
  users: User[] = usersData;

  constructor(private router: Router) {}

  redirectToExam(examId: number): void {
    this.router.navigate([`/exams/${examId}`]);
  }

  getProfessor(professorId: number): User | null {
    const professor = this.users.find((p) => p.userId === professorId);
    return professor ? professor : null;
  }
}
