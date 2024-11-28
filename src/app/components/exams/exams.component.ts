import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { Exam } from '../../models/exam.model';
import { ExamService } from '../../services/exam.service';

@Component({
  selector: 'app-exams',
  standalone: true,
  imports: [CommonModule, MatGridListModule, MatCardModule],
  templateUrl: './exams.component.html',
  styleUrl: './exams.component.css',
})
export class ExamsComponent implements OnInit {
  exams: Exam[] = [];

  errorMessage: string = '';

  constructor(private router: Router, private examService: ExamService) {}

  ngOnInit(): void {
    this.loadExams();
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

  redirectToExam(examId: number): void {
    this.router.navigate([`student/exams/${examId}`]);
  }
}
