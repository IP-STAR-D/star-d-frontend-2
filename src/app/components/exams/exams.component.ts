import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';

import { Exam } from '../../models/exam.model';
import { Appointment } from '../../models/appointment.model';
import { Professor } from '../../models/professor.model';
import { User } from '../../models/user.model';

import { ExamService } from '../../services/exam.service';
import { AppointmentsService } from '../../services/appointment.service';
import { ProfessorService } from '../../services/professor.service';
import { UserService } from '../../services/user.service';
import { StatusTranslationService } from '../../services/status.service';
import { SnackBarService } from '../../services/snack-bar.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-exams',
  standalone: true,
  imports: [CommonModule, MatGridListModule, MatCardModule, FormsModule],
  templateUrl: './exams.component.html',
  styleUrl: './exams.component.css',
})
export class ExamsComponent implements OnInit {
  exams: Exam[] = [];
  appointments: Appointment[] = [];
  professors: Professor[] = [];

  filteredExams: Exam[] = [];
  professorFilter: number | null = null;
  statusFilter: string = '';

  constructor(
    private router: Router,
    private examService: ExamService,
    private appointmentService: AppointmentsService,
    private professorService: ProfessorService,
    private userService: UserService,
    private statusTranslationService: StatusTranslationService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.loadExams();
    this.loadAppointments();
    this.loadProfessors();
  }

  loadExams(): void {
    this.examService.getExams().subscribe({
      next: (data: Exam[]) => {
        this.exams = data;
        this.applyFilters();
      },
      error: (err) => {
        console.error('Eroare la preluarea examenelor:', err);
        this.snackBarService.show('Eroare la preluarea examenelor!', 'error');
      },
    });
  }

  loadAppointments(): void {
    this.appointmentService.getAppointments().subscribe({
      next: (data: Appointment[]) => {
        this.appointments = data;
        this.applyFilters();
      },
      error: (err) => {
        console.error('Eroare la preluarea programărilor:', err);
        this.snackBarService.show('Eroare la preluarea programărilor!', 'error');
      },
    });
  }

  loadProfessors(): void {
    this.professorService.getProfessors().subscribe({
      next: (data: Professor[]) => {
        this.professors = data.map((professor) => {
          const user = this.getUserForProfessor(professor.userId);
          return { ...professor, user };
        });
      },
      error: (err) => {
        console.error('Eroare la preluarea profesorilor:', err);
        this.snackBarService.show('Eroare la preluarea profesorilor!' , 'error');
      },
    });
  }

  getUserForProfessor(userId: number): User | null {
    let user: User | null = null;
    this.userService.getUserById(userId).subscribe({
      next: (data: User) => {
        user = data;
      },
      error: (err) => {
        console.error('Eroare la preluarea utilizatorului:', err);
      },
    });
    return user;
  }

  applyFilters(): void {
    this.filteredExams = this.exams.filter((exam) => {
      const matchesProfessor = this.professorFilter ? exam.professorId === this.professorFilter : true;
      const appointment = this.getAppointmentsForExam(exam.examId);
      const matchesStatus = this.statusFilter
        ? appointment && appointment.status.toLowerCase() === this.statusFilter
        : true;
      return matchesProfessor && matchesStatus;
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
