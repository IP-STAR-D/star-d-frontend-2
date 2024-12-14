import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';

import { Exam } from '../../models/exam.model';
import { Appointment } from '../../models/appointment.model';
import { Professor } from '../../models/professor.model';
import { User } from '../../models/user.model';

import { ExamService } from '../../services/exam.service';
import { AppointmentsService } from '../../services/appointment.service';
import { ProfessorService } from '../../services/professor.service';
import { UserService } from '../../services/user.service';
import { StatusTranslationService } from '../../services/translation.service';
import { SnackBarService } from '../../services/snack-bar.service';
import { StudentService } from '../../services/student.service';

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
  statusFilter: string = '';

  constructor(
    private router: Router,
    private examService: ExamService,
    private appointmentService: AppointmentsService,
    private professorService: ProfessorService,
    private userService: UserService,
    private statusTranslationService: StatusTranslationService,
    private snackBarService: SnackBarService,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.loadExams();
    this.loadAppointments();
  }

  loadExams(): void {
    this.examService.getExams().subscribe({
      next: (data: Exam[]) => {
        this.exams = data;
        this.applyFilters();
      },
      error: (err) => {
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
        this.snackBarService.show('Eroare la preluarea programărilor!', 'error');
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
        this.snackBarService.show('Eroare la preluarea utilizatorului!', 'error');
      },
    });
    return user;
  }

  applyFilters(): void {
    this.filteredExams = this.exams.filter((exam) => {
      const appointment = this.getAppointmentsForExam(exam.examId);
      const matchesStatus = this.statusFilter
        ? appointment && appointment.status.toLowerCase() === this.statusFilter
        : true;
      return matchesStatus;
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

  getTypeTranslation(type: string): string {
    return this.statusTranslationService.getTypeTranslation(type);
  }

  redirectToExam(examId: number): void {
    this.studentService.isStudentBoss().subscribe({
      next: (response) => {
        if (response.isBoss) {
          this.router.navigate([`student/exams/${examId}`]);
        } else {
          this.snackBarService.show('Doar sefii de grupa pot accesa aceasta pagina!', 'error');
        }
      },
      error: () => {
        this.snackBarService.show('Eroare la verificarea permisiunilor!', 'error');
      },
    });
  }
}
