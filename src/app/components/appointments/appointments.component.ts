import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { Appointment } from '../../models/appointment.model';
import { User } from '../../models/user.model';
import { Exam } from '../../models/exam.model';
import { AppointmentModal } from '../modal/modal.component';
import { ExamService } from '../../services/exam.service';
import { AppointmentsService } from '../../services/appointment.service';
import { AuthService } from '../../services/auth.service';
import { StatusTranslationService } from '../../services/status.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-exams',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    MatCardModule,
    FormsModule
  ],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css',
})
export class AppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  users: User[] = [];
  exams: Exam[] = [];
  professorId: number | null = null;
  showTooltip = false;
  tooltipX = 0;
  tooltipY = 0;

  statusFilter: string = ''; // Filtrul pentru status
  examFilter: string = ''; // Inițializat la șir gol

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private examService: ExamService,
    private appointmentService: AppointmentsService,
    private statusTranslationService: StatusTranslationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadMyAppointments();
    this.loadExamsByProfessor();
  }

  openDialog(appointment: Appointment): void {
    const dialogRef = this.dialog.open(AppointmentModal, {
      data: { appointment, exam: this.getExam(appointment.examId) },
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dialog result:', result);
        this.updateStatus(appointment, result.status);
      }
    });
  }

  loadExamsByProfessor(): void {
    this.professorId = Number(this.authService.getUserId());

    if (!this.professorId) {
      console.error('Profesorul nu are ID valid.');
      return;
    }

    this.examService.getExamsByProfessorId(this.professorId).subscribe({
      next: (data: Exam[]) => {
        this.exams = data; // Salvează datele primite de la API în variabila exams
      },
      error: (err) => {
        console.error('Eroare la preluarea examenelor:', err);
      },
    });
  }

  getExam(examId: number): Exam | null {
    const exam = this.exams.find((exam) => exam.examId === examId);
    return exam ? exam : null;
  }

  applyFilters(): void {
    //console.log("Applying filters:", this.statusFilter, this.examFilter);  // Debugging
  
    this.filteredAppointments = this.appointments.filter((appointment) => {
      const matchesStatus =
        this.statusFilter === '' ||
        appointment.status.toLowerCase() === this.statusFilter.toLowerCase();
  
      // Modificare: Verificăm dacă `examFilter` este gol
      const matchesExam =
        this.examFilter === '' || appointment.examId === Number(this.examFilter);
  
      //console.log("Appointment matches: ", appointment, matchesStatus, matchesExam);  // Debugging
  
      return matchesStatus && matchesExam;
    });
  
    //console.log("Filtered appointments:", this.filteredAppointments);  // Debugging
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

  loadMyAppointments(): void {
    this.appointmentService.getAppointments().subscribe({
      next: (data: any[]) => {
        this.appointments = data.map(
          (item) =>
            new Appointment(
              item.appointment_id,
              item.exam_id,
              item.group_id,
              item.status,
              new Date(item.start_time),
              new Date(item.end_time),
              item.classroom_id
            )
        );
        this.filteredAppointments = [...this.appointments]; // Inițial, toate programările sunt vizibile
      },
      error: (err) => {
        console.error('Eroare la preluarea programarilor:', err);
      },
    });
  }

  getStatusTranslation(status: string): string {
    return this.statusTranslationService.getStatusTranslation(status);
  }

  onMouseMove(event: MouseEvent) {
    this.showTooltip = true;
    this.tooltipX = event.clientX + 10; // Ajustează poziția față de cursor
    this.tooltipY = event.clientY + 10;
  }

  hideTooltip() {
    this.showTooltip = false;
  }

  updateStatus(appointment: Appointment, status: string) {
    appointment.status = status;
    
    this.appointmentService.updateAppointment(appointment.appointmentId, appointment).subscribe(
      (updatedAppointment) => {
        console.log('Appointment updated successfully:', updatedAppointment);
        // Poți face ceva cu appointment-ul actualizat
      },
      (error) => {
        console.error('Error updating appointment:', error);
        // Poți gestiona erorile aici
      }
    );
  }
}
