import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Appointment } from '../../models/appointment.model';
import { Exam } from '../../models/exam.model';
import { AppointmentModal } from '../modal/modal.component';
import { ExamService } from '../../services/exam.service';
import { AppointmentsService } from '../../services/appointment.service';
import { StatusTranslationService } from '../../services/translation.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class AdminComponent implements OnInit {
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  exams: Exam[] = [];
  statusFilter: string = '';
  examFilter: string = '';

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private examService: ExamService,
    private appointmentService: AppointmentsService,
    private statusTranslationService: StatusTranslationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
    this.loadExams();
  }

  openDialog(appointment: Appointment): void {
    const dialogRef = this.dialog.open(AppointmentModal, {
      data: { appointment, exam: this.getExam(appointment.examId) },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateStatus(appointment, result.status);
      }
    });
  }

  loadAppointments(): void {
    this.appointmentService.getAppointments().subscribe({
      next: (data: any[]) => {
        this.appointments = data.map(
          (item) =>
            new Appointment(
              item.appointmentId,
              item.examId,
              item.groupId,
              item.status,
              new Date(item.startTime),
              new Date(item.endTime),
              item.classroomId
            )
        );
        this.filteredAppointments = [...this.appointments];
      },
      error: (err) => {
        console.error('Eroare la preluarea programarilor:', err);
      },
    });
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

  getExam(examId: number): Exam | null {
    return this.exams.find((exam) => exam.examId === examId) || null;
  }

  applyFilters(): void {
    this.filteredAppointments = this.appointments.filter((appointment) => {
      const matchesStatus =
        this.statusFilter === '' || appointment.status.toLowerCase() === this.statusFilter.toLowerCase();
      const matchesExam = this.examFilter === '' || appointment.examId === Number(this.examFilter);
      return matchesStatus && matchesExam;
    });
  }

  onStatusFilterChange(event: Event): void {
    const status = (event.target as HTMLSelectElement).value;
    this.statusFilter = status;
    this.applyFilters();
  }

  onExamFilterChange(event: Event): void {
    const examId = (event.target as HTMLSelectElement).value;
    this.examFilter = examId;
    this.applyFilters();
  }

  getStatusTranslation(status: string): string {
    return this.statusTranslationService.getStatusTranslation(status);
  }

  updateStatus(appointment: Appointment, status: string): void {
    appointment.status = status;
    this.appointmentService.updateAppointment(appointment.appointmentId, appointment).subscribe(
      (updatedAppointment) => {
        console.log('Appointment updated:', updatedAppointment);
      },
      (error) => {
        console.error('Error updating appointment:', error);
      }
    );
  }
}
