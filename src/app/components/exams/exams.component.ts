import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-exams',
  standalone: true,
  imports: [CommonModule, MatGridListModule, MatCardModule],
  templateUrl: './exams.component.html',
  styleUrl: './exams.component.css',
})
export class ExamsComponent {
  exams = [
    { id: '1', title: 'Ingineria programelor', professor: 'Turcu Cristina' },
    { id: '2', title: 'Sisteme inteligente', professor: 'Turcu Corneliu' },
    { id: '3', title: 'SIIEP', professor: 'Petrariu Adrian' },
    { id: '4', title: 'Proiectarea bazelor de date', professor: 'Danubianu Mirela' },
    { id: '5', title: 'Proiectarea translaatoarelor', professor: 'Gherman Ovidiu' },
    { id: '6', title: 'Calcul mobil', professor: 'Gherman Ovidiu' },
  ];

  constructor(private router: Router) {}

  redirectToExam(examId: string): void {
    this.router.navigate([`/exams/${examId}`]);
  }
}
