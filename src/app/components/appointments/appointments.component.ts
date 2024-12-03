import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { Appointment } from '../../models/appointment.model';
import { User } from '../../models/user.model';
import { usersData } from '../../data/user.data';
import { Exam } from '../../models/exam.model';
import { examsData } from '../../data/exam.data';
import { appointmentsData } from '../../data/appointment.data';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { AppointmentModal } from '../modal/modal.component';
import { ExamService } from '../../services/exam.service';
import { AppointmentsService } from '../../services/appointment.service';

@Component({
  selector: 'app-exams',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    MatCardModule,
    FooterComponent,
    HeaderComponent,
  ],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css',
})
export class AppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  users: User[] = [];
  exams: Exam[] = [];
  professorId: number | null = null;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private examService: ExamService,
    private appointmentService: AppointmentsService
  ) {}

  ngOnInit(): void {
    this.loadMyAppointments();
    this.loadExamsByProfessor();
  }

  openDialog(appointment: Appointment): void {
    const dialogRef = this.dialog.open(AppointmentModal, {
      data: { appointment, exam: this.getExam(appointment.examId) },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        //Change appointment status
      }
    });
  }

  loadExamsByProfessor(): void {
    if (localStorage.getItem('user_id'))
      this.professorId = Number(localStorage.getItem('user_id'));

    if (!this.professorId) {
      console.log(localStorage.getItem('user_id'));
      console.log(this.professorId);
      console.error('Profesorul nu are ID valid.');
      return;
    }

    this.examService.getExamsByProfessorId(this.professorId).subscribe({
      next: (data: Exam[]) => {
        this.exams = data; // Salvează datele primite de la API în variabila exams
        console.log('Examene preluate:', this.exams);
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
        // Mapare manuală a câmpurilor
        this.appointments = data.map(
          (item) =>
            new Appointment(
              item.appointment_id,
              item.exam_id,
              item.group_id, // se mapează group_id la groupId
              item.status,
              new Date(item.start_time), // se mapează start_time la startTime și îl convertești într-un obiect Date
              new Date(item.end_time), // similar pentru end_time
              item.classroom_id
            )
        );
      },
      error: (err) => {
        console.error('Eroare la preluarea programarilor:', err);
      },
    });
  }
}
