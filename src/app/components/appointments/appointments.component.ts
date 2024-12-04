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
import { StatusTranslationService } from '../../services/status.service';

@Component({
  selector: 'app-exams',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    MatCardModule
  ],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css',
})
export class AppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  users: User[] = [];
  exams: Exam[] = [];
  professorId: number | null = null;
  showTooltip = false;
  tooltipX = 0;
  tooltipY = 0;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private examService: ExamService,
    private appointmentService: AppointmentsService,
    private statusTranslationService: StatusTranslationService
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
    if (localStorage.getItem('user_id'))
      this.professorId = Number(localStorage.getItem('user_id'));

    if (!this.professorId) {
      // console.log(localStorage.getItem('user_id'));
      // console.log(this.professorId);
      console.error('Profesorul nu are ID valid.');
      return;
    }

    this.examService.getExamsByProfessorId(this.professorId).subscribe({
      next: (data: Exam[]) => {
        this.exams = data; // Salvează datele primite de la API în variabila exams
        // console.log('Examene preluate:', this.exams);
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
      },
      error: (err) => {
        // console.error('Eroare la preluarea programarilor:', err);
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
