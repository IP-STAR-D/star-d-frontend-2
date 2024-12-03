import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';

import { Exam } from '../../models/exam.model';
import { Appointment } from '../../models/appointment.model';

import { ExamService } from '../../services/exam.service';
import { AppointmentsService } from '../../services/appointment.service';
import { StatusTranslationService } from '../../services/status.service';

@Component({
  selector: 'app-exams',
  standalone: true,
  imports: [CommonModule, MatGridListModule, MatCardModule],
  templateUrl: './exams.component.html',
  styleUrl: './exams.component.css',
})
export class ExamsComponent implements OnInit {
  exams: Exam[] = [];
  appointments: Appointment[] = [];

  constructor(
    private router: Router,
    private examService: ExamService,
    private appointmentService: AppointmentsService,
    private statusTranslationService: StatusTranslationService
  ) {}

  ngOnInit(): void {
    this.loadExams();
    this.loadAppointments();
  }

  loadExams(): void {
    this.examService.getExams().subscribe({
      next: (data: Exam[]) => {
        this.exams = data;
      },
      error: (err) => {
        console.error('Eroare la preluarea examenelor:', err);
      },
    });
  }

  loadAppointments(): void {
    this.appointmentService.getAppointments().subscribe({
      next: (data: Appointment[]) => {
        this.appointments = data;
      },
      error: (err) => {
        console.error('Eroare la preluarea programarilor:', err);
      },
    });
  }

  getAppointmentsForExam(examId: number): Appointment | null {
    const priorityStatuses = ['scheduled', 'pending', 'rejected'];

    for (const status of priorityStatuses) {
      const filteredAppointments = this.appointments.filter(
        (appointment) => appointment.examId === examId && appointment.status.toLowerCase() === status
      );
      if (filteredAppointments.length > 0) {
        return filteredAppointments[0];
      }
    }

    return null;
  }

  getStatusTranslation(status: string): string {
    return this.statusTranslationService.getStatusTranslation(status);
  }

  redirectToExam(examId: number): void {
    this.router.navigate([`student/exams/${examId}`]);
  }
}
